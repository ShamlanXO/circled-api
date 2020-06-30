const CurrentAffairs = require("../models/CurrentAffairs");
const aqp = require("api-query-params");

exports.FetchCurrentAffairs = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  CurrentAffairs.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No CurrentAffairses Found" });
      } else {
        return res
          .status(200)
          .send({ message: "CurrentAffairses Listing", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateCurrentAffairs = (req, res) => {
  const CurrentAffair = new CurrentAffairs(req.body);
  CurrentAffair
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ Message: "CurrentAffairs Created", id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateCurrentAffairs = (req, res) => {
  CurrentAffairs.updateOne({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "CurrentAffairs Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteCurrentAffairs = (req, res) => {
  CurrentAffairs.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "CurrentAffairs Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
