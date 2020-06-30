const Centre = require("../models/Centre");
const aqp = require("api-query-params");

exports.FetchCentre = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Centre.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Centres Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Centres Listing", ServerResponse: result });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateCentre = (req, res) => {
  const centre = new Centre(req.body);
  centre
    .save()
    .then((result) => {
      return res
        .status(201)
        .send({ Message: "Centre Created", id: result._id });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateCentre = (req, res) => {
  Centre.updateOne({ _id: req.params.Id }, req.body)
    .then((result) => {
      return res.status(20).send({ message: "Centre Updated" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteCentre = (req, res) => {
  Centre.deleteOne({ _id: req.params.Id })
    .then((result) => {
      return res.status(200).send({ message: "Centre Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
