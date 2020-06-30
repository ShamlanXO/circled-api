const Announcement = require("../models/Announcement.js");
const aqp = require("api-query-params");
const {CreateImplicitFeed}=require("./Feed.js")
exports.FetchAnnouncement = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Announcement.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate("CreatedBy")
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Announcements Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Announcements Listing", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateAnnouncement = (req, res) => {
  console.log(req.body)
  const Announcements = new Announcement(req.body);
  Announcements
    .save()
    .then(result => {
      CreateImplicitFeed({Announcement:result._id,Type:"Announcement"})
      return res
        .status(201)
        .send({ Message: "Announcement Created", id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateAnnouncement = (req, res) => {
  Announcement.updateOne({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "Announcement Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteAnnouncement = (req, res) => {
  Announcement.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Announcement Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
