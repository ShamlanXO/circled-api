const aqp = require("api-query-params");
const Recent = require("../models/Recent");

exports.addTorecent = (type, data) => {
  const recent = new Recent({
    programId: data.programId,
    userId: data.userId,
    type: type,
    email: data.email,
    clientId: data.clientId,
  });
  recent
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getRecents = (req, res) => {
  Recent.find({
    programId: req.params.id,
  })
    .populate("clientId", "name profilePic")
    .then((result) => {
      console.log(result);
      if (result.length < 1) {
        return res.status(404).send([]);
      } else {
        return res.status(200).send(result);
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send({
        ErrorOccured: error,
      });
    });
};
