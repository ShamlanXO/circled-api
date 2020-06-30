const Mail = require("../Models/Mail");

const ApiQuery = require("api-query-params");

exports.FindMail = (req, res) => {
  const { filter, skip, limit, sort, projection } = ApiQuery(req.query);
  Mail.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .then(result => {
      if (result.length < 1) {
        return res
          .status(200)
          .send({ message: "Mail List", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.CreateMail = (req, res) => {
  const mail = new Mail(req.body);
  mail
    .save()
    .then(result => {
      return res.status(201).send({ message: "Mail Created", Id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateMail = (req, res) => {
  Mail.update({ _id: req.params.Id }, req.body)
    .then(result => {
      return res.status(200).send({ message: "Mail Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteMail = (req, res) => {
  Mail.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ Message: "mail deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
