const Library = require("../models/Library");
const aqp = require("api-query-params");
var ObjectID = require("mongodb").ObjectID;
exports.FetchLibrary = (req, res) => {
console.log("fetching main")
  Library.aggregate(

    [
      {
        $facet:
        {
        Items:[{$match:{createdBy:ObjectID(req.userData._id),parent:ObjectID(req.params.parent)}}],
        parent:[{$match:{_id:ObjectID(req.params.parent),createdBy:ObjectID(req.userData._id)}}]
      }
    
    
    }

    ]
    
    
    
    ).then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Libraryes Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Libraryes Listing", items: result[0].Items ,parent:result[0].parent[0] });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.FetchRoot = (req, res) => {
  console.log("fetching root")
    Library.find({createdBy:req.userData._id,parent:null,recent:false}).then(result => {
        if (result.length < 1) {
          return res.status(404).send({ message: "No Libraryes Found" });
        } else {
          return res
            .status(200)
            .send({ message: "Libraryes Listing", items: result });
        }
      })
      .catch(error => {
        return res.status(500).send({ ErrorOccured: error });
      });
  };

  exports.FetchRecent = (req, res) => {
    console.log("fetching root")
      Library.find({createdBy:req.userData._id,parent:null,recent:true}).then(result => {
          if (result.length < 1) {
            return res.status(404).send({ message: "No Libraryes Found" });
          } else {
            return res
              .status(200)
              .send({ message: "Libraryes Listing", items: result });
          }
        })
        .catch(error => {
          return res.status(500).send({ ErrorOccured: error });
        });
    };

exports.CreateLibrary = (req, res) => {
  console.log(req.body)
  const LibraryCon = new Library({...req.body,createdBy:req.userData._id});
  LibraryCon
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

exports.UpdateLibrary = (req, res) => {
  Library.updateOne({  createdBy:req.userData._id,...req.body.updateCondition}, {...req.body.updateData})
    .then(result => {
      return res.status(200).send({ message: "Library Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteLibrary = (req, res) => {
  Library.deleteMany({$or:[{_id:req.body._id},{ancestors:req.body._id},{parent:req.body._id}],createdBy:req.userData._id})
    .then(result => {
      return res.status(200).send({ message: "Library Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
