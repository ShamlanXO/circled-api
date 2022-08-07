const BodyImageModel = require("../models/BodyImages");

var ObjectID = require("mongodb").ObjectID;

exports.FetchImages = (req, res) => {
  BodyImageModel.find({ createdBy: ObjectID(req.userData._id) })
    .then((result) => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Libraryes Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Libraryes Listing", items: result });
      }
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
exports.CreateImages= (req, res) => {
    
    const BodyImagesCon = new BodyImageModel({...req.body,createdBy:req.userData._id});
    BodyImagesCon
      .save()
      .then(result => {
        return res
          .status(201)
          .send({ Message: "Library Created", item: result });
      })
      .catch(error => {
        return res.status(500).send({ ErrorOccured: error });
      });
  };
  

exports.UpdateImages = (req, res) => {
    BodyImageModel.updateOne(
    { createdBy: req.userData._id },
    { ...req.body}
  )
    .then((result) => {
      return res.status(200).send({ message: "Library Updated" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteImages = (req, res) => {
    BodyImageModel.deleteOne({
   
    createdBy: req.userData._id,
  })
    .then((result) => {
      return res.status(200).send({ message: "Library Deleted" });
    })
    .catch((error) => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
