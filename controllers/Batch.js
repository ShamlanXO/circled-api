const Batch = require("../models/Batch");
const aqp = require("api-query-params");

exports.FetchBatch = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Batch.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Batches Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Batches Listing", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateBatch = (req, res) => {
  const batch = new Batch(req.body);
  batch
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ Message: "Batch Created", id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateBatch = (req, res) => {
  Batch.updateOne({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "Batch Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteBatch = (req, res) => {
  Batch.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Batch Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
