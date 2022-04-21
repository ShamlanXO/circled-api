const Notification = require("../models/Notifications");
const aqp = require("api-query-params");

exports.FetchNotification = (req, res) => {

  
  
  const { filter, skip, limit, sort, projection } = aqp(req.query);
  console.log(req.userData)
  Notification.find({$or:[
{
  To:req.userData.email
},

{
  To:req.userData.figgsId
},

{
  UserId:req.userData._id
}


  ],...filter})
    .skip(skip)
    .limit(limit)
    .sort({createdAt:-1})
   .populate("Sender","name _id profilePic")
   .populate("SentProgramId","Title Program.BannerImage Program.Price")
    .then(result => {
      if (result.length < 1) {
        return res.status(404).send({ message: "No Notifications Found" });
      } else {
        return res
          .status(200)
          .send({ message: "Notifications", ServerResponse: result });
      }
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};


exports.GetUnreadCount=(req,res) =>{

   

  Notification.find({$or:[
{
  To:req.userData.email
},

{
  To:req.userData.figgsId
},

{
  UserId:req.userData._id
}


  ],IsRead:false}).count().then(data => {
res.status(200).send({count:data})
  })
  .catch(err =>{
    res.status(500).send()
  }
    
    
    )


}



exports.CreateNotification = (req, res) => {
  const notification = new Notification(req.body);
  notification
    .save()
    .then(result => {
      return res
        .status(201)
        .send({ message: "Notification Created", Id: result._id });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.UpdateNotification = (req, res) => {
console.log("new update notification")

  Notification.update({ _id: req.params.Id }, req.body)
    .then(result => {
   
      return res.status(200).send({ message: "Notification Updated" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};

exports.DeleteNotification = (req, res) => {
  Notification.deleteOne({ _id: req.params.Id })
    .then(result => {
      return res.status(200).send({ message: "Notification Deleted" });
    })
    .catch(error => {
      return res.status(500).send({ ErrorOccured: error });
    });
};
