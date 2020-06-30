const TestSet = require("../models/TestSet");
const aqp = require("api-query-params");
const {CreateImplicitFeed}=require("./Feed.js")
exports.SearchPTS = (req, res) => {
  const { filter, skip, limit, sort, projection ,population} = aqp(req.query);
  TestSet
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
.populate(population)
    .populate("CreatedBy")
   
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({
          message: "No test Set found"
        });
      } else {
        return res.status(200).send({
          message: "PTS Search Result",
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

exports.CreatePTS = (req, res) => {
  const testSet = new TestSet(req.body);
  testSet
    .save()
    .then(result => {
      CreateImplicitFeed({TestSet:result._id,Type:"TestSet"})
      return res.status(201).send({
        data:result,
        message: "Practice test Set Created Successfully"
      });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdatePTS = (req, res) => {
  TestSet
    .update({ _id: req.params.Id }, req.body, function(err, doc) {
      if (err) {
        return res.status(500).send({
          message: "Error Updating test Set",
          ErrorOccured: err
        });
      } else {
        return res.status(200).send({
          message: "PTS Updated Successfully",
          result: doc
        });
      }
    })
    .catch(error => {
      return res.status(500).send({
        ErrorOccured: error
      });
    });
};

exports.DeletePTS = (req, res) => {
  TestSet.findByIdAndRemove(req.params.Id).then(result => {
    return res
      .status(200)
      .send({
        message: "test Set Deleted"
      })
      .catch(errror => {
        return res.status(500).send({
          ErrorOccured: error
        });
      });
  });
};


