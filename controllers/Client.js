const ClientModel = require("../models/Clients");

exports.getInstructorClient = (req, res) => {

    ClientModel.find({ instructor: req.userData._id }).populate('client', 'name email profilePic')
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((error) => {
            return res.status(500).send({ ErrorOccured: error });
        });
}