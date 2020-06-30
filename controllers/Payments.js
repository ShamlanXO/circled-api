const Payment = require("../models/Payment");
const aqp = require("api-query-params");

exports.FindPayment = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Payment.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Payment Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Payment List", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreatePayment = (req, res) => {
  const payment = new Payment(req.body);
  payment
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ message: "Payment Created", Id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdatePayment = (req, res) => {
  Payment.updateOne({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "Payment Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeletePayment = (req, res) => {
  Payment.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Payment Deleted" });
    })
    .catch(error => {
      return res.status(500).seend({ ErrorOccured: error });
    });
};
