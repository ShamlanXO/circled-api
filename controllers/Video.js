const Video = require("../models/Videos");
const aqp = require("api-query-params");

exports.FetchVideo = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Video.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Videoes Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Videoes Listing", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateVideo = (req, res) => {
  const Videos = new Video(req.body);
  Videos
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ Message: "Video Created", id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateVideo = (req, res) => {
  Video.updateOne({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "Video Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteVideo = (req, res) => {
  Video.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Video Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
