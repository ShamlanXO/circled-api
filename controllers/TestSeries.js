const TestSeries = require("../models/TestSeries");
const aqp = require("api-query-params");

exports.SearchTestSeries = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  TestSeries.find({ ...filter, Disable: false })
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate("CreatedBy Tests")
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No Search result found for the test series"
        });
      } else {
        return res.status(200).send({
          message: "Search Results for Test Series",
          ServerResponse: result
        });
      }
    })
    .catch(error => {
      return res.status(500).send({
        ErrorOccured: error
      });
    });
};

exports.GetTestSeriesUnperchased = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  TestSeries.find({
    _id: { $nin: [req.body.notIn] },
    Disable: false,
    ...filter
  })
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate("CreatedBy Tests")
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No Search result found for the test series"
        });
      } else {
        return res.status(200).send({
          message: "Search Results for Test Series",
          ServerResponse: result
        });
      }
    })
    .catch(error => {
      return res.status(500).send({
        ErrorOccured: error
      });
    });
};

exports.CreateTestSeries = (req, res) => {
  const testSeries = new TestSeries(req.body);
  testSeries
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ message: "Test Series Created", Id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateTestSeries = (req, res) => {
  TestSeries.update({ _id: req.params.Id }, req.body, function(err, doc) {
    if (err) {
      return res.status(500).send({ ErrorOccured: err });
    } else {
      return res
        .status(200)
        .send({ message: "Test Series Updated Successfully" });
    }
  }).catch(error => {
    return res.status(500).send({ ErrorOccured: error });
  });
};

exports.DeleteTestSeries = (req, res) => {
  TestSeries.update({ _id: req.params.Id }, { Disable: true })
    .then(result => {
      return res.status(200).send({
        message: "Test Series Deleted Successfully"
      });
    })
    .catch(error => {
      return res.stauts(500).send({
        ErrorOccured: error
      });
    });
};
