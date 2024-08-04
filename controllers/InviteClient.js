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
exports.InviteClient = async (req, res) => {
    const { email, name } = req.body;

    let AcceptedClient=await InviteClientModel.findOne({email:email,accepted:false})
    let ExistingUser= await User.findOne({email:email})
    if(AcceptedClient){
        return res.status(403).send({message:`Invite already sent to given email`})
    }


    InviteClientModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
            email:email.toLowerCase(),
            name,
          
            invitedBy: req.userData._id,
            inveitedAt: Date.now(),
            accepted: false
        },
        { upsert: true, useFindAndModify: false ,new:true}
    )
        .then((result) => {
          
           let link =`https://circled.fit/invite/accept-invite/${result._id}?userexist=${ExistingUser?true:false}`
            sendInvitationMail({
                email,
                link,
                name: req.userData.name,
                message: ExistingUser?'you might need to fill some information for your trainer.':'As new user you might need to fill the information needed for your trainer.',
                profileImg: req.userData.profilePic,
                invitedBy: req.userData.name,
                invitedByEmail: req.userData.email,
            });

            Notification.create(
                [
                  {
                    To: [email],
                    Title:req.userData.name,
                    Type: "InviteClient",
                    Description:"Request to add you on his client list",
                    Sender: result.invitedBy,
                    Link:'/invite/accept-invite/'+result._id
                    
                  },
                ]
              )

            return res.status(201).send({ message: "Client Invited" });
        }) // Add the 'new' option to return the updated document
        .catch((error) => {
            console.log(error)
            return res.status(500).send({ ErrorOccured: error });
        });
    }

exports.ResendInvite=(req,res)=>{
    const { _id } = req.body;
    InviteClientModel.findOne(
      {
        _id:_id
      }
       
    )
        .then(async(result) => {
            let ExistingUser= await User.findOne({email:result.email})
                    let link =`https://circled.fit/invite/accept-invite/${result._id}?userexist=${ExistingUser?true:false}`
            sendInvitationMail({
                email:result.email,
                link,
                name: req.userData.name,
                message: ExistingUser?'you might need to fill some information for your trainer.':'As new user you might need to fill the information needed for your trainer.',
                profileImg: req.userData.profilePic,
                invitedBy: req.userData.name,
                invitedByEmail: req.userData.email,
            });
            result.updatedAt=new Date()
            result.save()
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

    exports.FetchInvitation = (req, res) => {
    
        InviteClientModel.findOne({ _id:req.params.id}).limit(1).populate('invitedBy','name email profilePic')
            .then((result) => {
                console.log("fetch result",result)
               if(!result) {
                return res.status(404).send();
               }
               else
            return res.status(200).send(result);
            })
            .catch((error) => {
            return res.status(500).send({ ErrorOccured: error });
            });
        }

exports.AcceptInvitation = (req, res) => {
    InviteClientModel.findOneAndUpdate({ _id: req.params.id,accepted:false }, { accepted: true },{useFindAndModify:false}).populate('invitedBy','name email')
        .then((result) => {
            if(!result){
                return res.status(403).send({message:"Invitation already accepted"})
            }

                 Notification.create(
                [
                  {
                    To: [req.userData.email],
                    Title:`${result.invitedBy.name}`,
                    Description:"Your now on the client list",
                    Type: "InviteClient",
                    Sender: result.invitedBy._id,
                    
                  },
                ])
                Notification.create(
                [
                    {
                      To: [result.invitedBy.email],
                      Title:`${req.userData.name}`,
                      Description:"Added to your client list",
                      Type: "InviteClient",
                      Sender: req.userData._id,
                      
                    },
                  ]
                )
              


            ClientModel.findOneAndUpdate({
            email: result.email.toLowerCase()
        }, {
         email: result.email.toLowerCase(),
            name: result.name,
            client: req.userData._id,
            instructor: result.invitedBy._id
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

exports.DeleteInvitation=(req,res)=>{
    InviteClientModel.deleteOne({
        _id: req.params.id ,
        accepted: false
    }) .then((result) => {
        return res.status(200).send({ message: "Invitation Deleted" });
        })
        .catch((error) => {
        return res.status(500).send({ ErrorOccured: error });
        });
}


