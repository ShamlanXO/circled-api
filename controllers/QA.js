const QA = require("../models/QA");
const aqp = require("api-query-params");

exports.FetchQA = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  QA.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({createdAt:-1})
    .select(projection)
    .populate("User")
    .populate("Answers.User")
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

exports.CreateQA = (req, res) => {
  const qa = new QA(req.body);
  qa
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ Message: "QA Created", ServerResponse: result });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateQA = (req, res) => {
  QA.updateOne({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "QA Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.AddAnswer = (req, res) => {

  console.log(req.body)
    QA.updateOne({ _id: req.body._id }, {
        $addToSet:{Answers:{Answer:req.body.Answer,User:req.body.User}}
    })
      .then(result => {
        return res.status(200).send({ message: "QA Updated" });
      })
      .catch(error => {
        return res.status(500).send({ ErrorOccured: error });
      });
  };



exports.DeleteQA = (req, res) => {
  QA.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "QA Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
