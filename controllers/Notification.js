const Notification = require("../models/Notifications");
const aqp = require("api-query-params");
const { sendNotificationMail } = require("./misc");
exports.FetchNotification = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);

  Notification.find({
    $or: [
      {
        To: req.userData.email,
      },

      {
        To: req.userData.figgsId,
      },
      {
        To: req.userData._id,
      },

      {
        UserId: req.userData._id,
      },
    ],
    ...filter,
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("Sender", "name _id profilePic")
    .populate("SentProgramId", "Title Program.BannerImage Program.Price")
    .lean()
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Notifications Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Notifications", ServerResponse: result });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.GetUnreadCount = (req, res) => {
  Notification.find({
    $or: [
      {
        To: req.userData.email,
      },

      {
        To: req.userData.figgsId,
      },

      {
        UserId: req.userData._id,
      },
      {
        To: req.userData._id,
      },
    ],
    IsRead: false,
  })
    .count()
    .then((data) => {
      res.status(200).send({ count: data });
    })
    .catch((err) => {
      res.status(500).send();
    });
};

exports.CreateNotification = (req, res) => {
  const notification = new Notification(req.body);
  notification
    .save()
    .then((result) => {
      return res
        .status(201)
        .send({ message: "Notification Created", Id: result._id });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateNotification = (req, res) => {
  console.log("new update notification");

  Notification.update({ _id: req.params.Id }, req.body)
    .then((result) => {
      return res.status(200).send({ message: "Notification Updated" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteNotification = (req, res) => {
  Notification.deleteOne({ _id: req.params.Id })
    .then((result) => {
      return res.status(200).send({ message: "Notification Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateGeneralNotification = (to, from, type, message, data,socket=null) => {
 
  switch (type) {
    case "update-program":
      new Notification({
        To: to,
        Sender: from._id,
        UserId: to,
        Type: type,
        //Link: link,
        Description: `${from.name} updated your workout program ${data.planName}`,
        Title: "Updated Program",
        orderId: data.orderId,
      }).save();
      sendNotificationMail({
        email: data.email,
        message: `${from.name} updated your workout program ${data.planName}`,
      });
      data.socket.sendTo(to, to, {
        type: "new-notification",
        data: {
          To: to,
          Sender: from._id,
          UserId: to,
          Type: type,
          //Link: link,
          Description: `${from.name} updated your workout program ${data.planName}`,
          Title: "Updated Program",
          orderId: data.orderId,
        },
      });
      break;
    case "edited-diet":
      console.log("edited diet create");
      new Notification({
        To: to,
        Sender: from._id,
        UserId: to,
        Type: type,
        //Link: link,
        Description: `${from.name} edited your diet plan of workout program ${data.planName}`,
        Title: "Edited Diet Plan",
        orderId: data.orderId,
      }).save();
      sendNotificationMail({
        email: data.email,
        message: `${from.name} edited your diet plan of workout program ${data.planName}`,
      });
      data.socket.sendTo(to, to, {
        type: "new-notification",
        data: {
          To: to,
          Sender: from._id,
          UserId: to,
          Type: type,
          //Link: link,
          Description: `${from.name} edited your diet plan of workout program ${data.planName}`,
          Title: "Edited Diet Plan",
          orderId: data.orderId,
        },
      });
      break;
    case "update-todo":
      data.removed.map((item) => {
        new Notification({
          To: to,
          Sender: from._id,
          UserId: to,
          Type: type,
          //Link: link,
          Description: `${from.name} removed (${item.value}) from your todo list`,
          Title: "Removed a todo task",
          orderId: data.orderId,
        }).save();
        sendNotificationMail({
          email: data.email,
          message: `${from.name} removed (${item.value}) from your todo list`,
        });
        data.socket.sendTo(to, to, {
          type: "new-notification",
          data: {
            To: to,
            Sender: from._id,
            UserId: to,
            Type: type,
            //Link: link,
            Description: `${from.name} removed (${item.value}) from your todo list`,
            Title: "Removed a todo task",
            orderId: data.orderId,
          },
        });
      });
      data.updated.map((item) => {
        new Notification({
          To: to,
          Sender: from._id,
          UserId: to,
          Type: type,
          //Link: link,
          Description: `${from.name} updated (${item.value}) in your todo list`,
          Title: "Updated a todo task",
          orderId: data.orderId,
        }).save();
        sendNotificationMail({
          email: data.email,
          message: `${from.name} updated (${item.value}) in your todo list`,
        });
        data.socket.sendTo(to, to, {
          type: "new-notification",
          data: {
            To: to,
            Sender: from._id,
            UserId: to,
            Type: type,
            //Link: link,
            Description: `${from.name} updated (${item.value}) in your todo list`,
            Title: "Updated a todo task",
            orderId: data.orderId,
          },
        });
      });
      data.added.map((item) => {
        new Notification({
          To: to,
          Sender: from._id,
          UserId: to,
          Type: type,
          //Link: link,
          Description: `${from.name} added (${item.value}) in your todo list`,
          Title: "You have a task",
          orderId: data.orderId,
        }).save();
        sendNotificationMail({
          email: data.email,
          message: `${from.name} added (${item.value}) in your todo list`,
        });
        data.socket.sendTo(to, to, {
          type: "new-notification",
          data: {
            To: to,
            Sender: from._id,
            UserId: to,
            Type: type,
            //Link: link,
            Description: `${from.name} added (${item.value}) in your todo list`,
            Title: "You have a task",
            orderId: data.orderId,
          },
        });
      });
      break;

     
      case "test":
        socket.sendTo(to, "test-event", {
          type: "new-notification",
          data: {
       
          },
        });
break
    default:
        new Notification({
          ...data
        }).save();
      console.log("invite client notification")
        socket.sendTo(to, type, {
          type: type,
          data,
        });

      break;
  }
};
