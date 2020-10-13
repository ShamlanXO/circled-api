const Chat = require("../models/Chat");
const aqp = require("api-query-params");
var ObjectID = require("mongodb").ObjectID;
exports.FetchChats = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  console.log(filter);
  Chat.find({

    $or:[
{
  ReceiverId: filter.id ,
  SenderId: req.userData._id ,
}
,
{
  ReceiverId: req.userData._id,
  SenderId: filter.id ,
}
    ]

  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    // .populate("SenderId","name profilePic")
    // .populate("ReceiverId","name profilePic")
    .populate("SentProgramId", "Title Program.BannerImage Amount")
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Chat Found" });
      } else {
        return res.status(200).send(result);
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateChat = (req, res) => {
  const chat = new Chat({ ...req.body, SenderId: req.userData._id });
  chat
    .save()
    .then((result) => {
      req.app
        .get("socketService")
        .sendTo(req.body.ReceiverId, req.body.ReceiverId, {
          type: "new-message",
          data: {
            ...req.body,
            SenderId: req.userData._id,
            _id: result._id,
            name: req.userData.name,
          },
        });
      return res.status(201).send({ message: "Chat Created", Id: result._id });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.GetChatUsersRecent = (req, res) => {
  // First Stage
  Chat.aggregate([
    {
      $match: {
        $or: [
          { ReceiverId: ObjectID(req.userData._id) },
          { SenderId: ObjectID(req.userData._id) },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },

    {
      $project: {
        _id: {
          $cond: {
            if: { $eq: ["$SenderId", req.userData._id] },
            then: "$ReceiverId",
            else: "$SenderId",
          },
        },
        SenderId: 1,
        ReceiverId: 1,
        Message: 1,

        IsRead: 1,
        File: 1,
        Link: 1,

        updatedAt: 1,
        createdAt: 1,
      },
    },
    {
      $group: {
        _id: "$_id",

        recentChat: { $first: "$$ROOT" },
        unread: {
          $sum: {
           $cond:{ if: { $and: [
              { $eq: ["$IsRead", false]  },
            
              { $eq: ["$ReceiverId", req.userData._id]  }
            ] },
            then: 1,
            else: 0,}
          },
        },
      },
    },
    // Second Stage
    {
      $lookup: {
        from: "users",
        localField: "recentChat.SenderId",
        foreignField: "_id",
        as: "SenderDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "recentChat.ReceiverId",
        foreignField: "_id",
        as: "ReceiverDetails",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $cond: {
            if: { $eq: ["$recentChat.SenderId", req.userData._id] },
            then: {
              $mergeObjects: [
                { $arrayElemAt: ["$ReceiverDetails", 0] },
                "$$ROOT",
                "$recentChat",
              ],
            },
            else: {
              $mergeObjects: [
                { $arrayElemAt: ["$SenderDetails", 0] },
                "$$ROOT",
                "$recentChat",
              ],
            },
          },
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },

    {
      $project: {
        _id: 1,
        unread: 1,
        name: 1,
        profilePic: 1,
        figgsId:1,
        SenderId: 1,
        ReceiverId: 1,
        IsRead: 1,
        File: 1,
        Link: 1,
        Message: 1,
        updatedAt: 1,
        createdAt: 1,
      },
    },
  ])
    .then((result) => {
      if (result.length < 1) res.status(404).send();
      else res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.GetUnreadCount = (req, res) => {
  Chat.find({ ReceiverId: req.userData._id, IsRead: false })
    .count()
    .then((result) => {
      res.status(200).send({ count: result });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.UpdateChat = (req, res) => {
  Chat.updateOne({ _id: req.params.id }, { IsRead: true })
    .then((result) => {
      console.log(result);
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
