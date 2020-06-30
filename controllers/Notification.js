const Notification = require("../models/Notifications");
const aqp = require("api-query-params");

exports.FetchNotification = (req, res) => {

  req.app.get("socketService").emiter('message', req.body);
  
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Notification.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Notifications Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Notifications", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateNotification = (req, res) => {
  const notification = new Notification(req.body);
  notification
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ message: "Notification Created", Id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateNotification = (req, res) => {
console.log("new update notification")

  Notification.update({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "Notification Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteNotification = (req, res) => {
  Notification.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Notification Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
