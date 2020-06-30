const Cart = require("../models/Cart");
const aqp = require("api-query-params");

exports.FetchCart = (req, res) => {
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Cart.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .populate("User")
    .populate({
      path: "Items.TestSet",
      model: "test_set"
    })
    .populate({
      path: "Items.TestSeries",
      model: "test_series"
    })
    .populate({ 
      path: "Items.Course",
      model:"courses"
    })
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "no items found in cart" });
      } else {
        return res
          .status(200)
          .send({ message: "Cart Items", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateCart = (req, res) => {
  const cart = new Cart(req.body);
  cart
    .save()
    .then(result => {
      return res.status(201).send({
        message: "Cart Created Successfully",
        ServerResponse: result
      });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateCart = (req, res) => {
  Cart.updateOne({ User: req.query.UserId }, req.body, {
    upsert: true
  })
    .then(result => {
      return res
        .status(200)
        .send({ message: "Cart updated", ServerResponse: result });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteCart = (req, res) => {
  Cart.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Cart Item Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
