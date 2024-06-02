const Program = require("../models/Programs");
const aqp = require("api-query-params");
const User = require("../models/user");
const SentProgram = require("../models/SentPrograms");
const Notification = require("../models/Notifications");
const { sendPromoMain } = require("../script/sendPromoMail");
const jwt = require("jsonwebtoken");
var ObjectID = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const { startOfMonth, endOfMonth } = require("date-fns");
const axios = require("axios");
const {sendInvitationMail} = require("../script/sendInvitationEmail");
const InviteClientModel = require("../models/InviteClients");
const ClientModel = require("../models/Clients");
exports.InviteClient = (req, res) => {
    const { email, name } = req.body;
    InviteClientModel.findOneAndUpdate(
        { email: email },
        {
            email,
            name,
            message: req.body.message,
            invitedBy: req.userData._id,
            inveitedAt: Date.now(),
            accepted: false
        },
        { upsert: true, useFindAndModify: false ,new:true}
    )
        .then((result) => {
           let link ='https://circled.fit/invite/accept-invite/'+result._id
            sendInvitationMail({
                email,
                link,
                name: req.userData.name,
                message: req.body.message,
                profileImg: req.userData.profilePic,
                invitedBy: req.userData.name,
                invitedByEmail: req.userData.email,
            });
            return res.status(201).send({ message: "Client Invited" });
        }) // Add the 'new' option to return the updated document
        .catch((error) => {
            console.log(error)
            return res.status(500).send({ ErrorOccured: error });
        });
    }

exports.FetchInvitedClientsByUser = (req, res) => {
    InviteClientModel.find({ invitedBy: req.userData._id })
        .then((result) => {
        return res.status(200).send(result);
        })
        .catch((error) => {
        return res.status(500).send({ ErrorOccured: error });
        });
    }

exports.FetchInvitations = (req, res) => {
    InviteClientModel.find({ email: req.userData.email ,accepted:false}).limit(1).populate('invitedBy','name email profilePic')
        .then((result) => {
        return res.status(200).send(result);
        })
        .catch((error) => {
        return res.status(500).send({ ErrorOccured: error });
        });
    }

exports.AcceptInvitation = (req, res) => {
    InviteClientModel.findOneAndUpdate({ _id: req.params.id }, { accepted: true },{useFindAndModify:false})
        .then((result) => {
            ClientModel.findOneAndUpdate({
            email: result.email
        }, {
         email: result.email,
            name: result.name,
            client: req.userData._id,
            instructor: result.invitedBy
        }, {
            upsert: true,
            useFindAndModify: false
       }).then((result) => {
            return res.status(200).send({ message: "Invitation Accepted" });
            })
            .catch((error) => {
                console.log(error)
            return res.status(500).send({ ErrorOccured: error });
            });
        }   )
        
        
        .catch((error) => {
            console.log(error)
        return res.status(500).send({ ErrorOccured: error });
        });
    }
    
exports.RejectInvitation = (req, res) => {
    InviteClientModel.findOneAndDelete({ _id: req.params.id })
        .then((result) => {
        return res.status(200).send({ message: "Invitation Rejected" });
        })
        .catch((error) => {
        return res.status(500).send({ ErrorOccured: error });
        });
    }


