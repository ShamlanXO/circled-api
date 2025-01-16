const ClientModel = require("../models/Clients");
const ClientInvite = require("../models/InviteClients")
exports.getInstructorClient = (req, res) => {

   ClientModel.aggregate([
  {
    $match: { instructor: req.userData._id }
  },
  {
    $lookup: {
      from: 'users', // the name of the User collection
      localField: 'client', // name of the client field in ClientModel
      foreignField: '_id', // name of the _id field in User
      as: 'client' // output array field
    }
  },
  {
    $unwind: '$client' // this will flatten the client array
  },
  {
    $lookup: {
      from: 'purchasedprograms', // the name of the purchaseProgram collection
      let: { userId: '$client._id' }, // local field
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$UserId', '$$userId'] }, // foreign field
                { $eq: ['$isActive', true] }
              ]
            }
          }
        },
        {
          $project: { id: 1 ,"Program.Title":1} // fields from purchaseProgram you want to include
        }
      ],
      as: 'userPurchaseProgram' // output array field
    }
  },
  {
    $project: { // optional: to select the fields to include in the final result
      'name': 1,
      'email': 1,
      'addedOn': 1,
      "client.name": 1,
        "client.email": 1,
        "client.profilePic": 1,

      'userPurchaseProgram': { $arrayElemAt: ['$userPurchaseProgram', 0] }
    }
  }
])
        .then(async(result) => {
          let unaccepted = await ClientInvite.find({invitedBy:req.userData._id,accepted:false})
            return res.status(200).send({
              clients:result,
              pending:unaccepted
            
            });
        })
        .catch((error) => {
            return res.status(500).send({ ErrorOccured: error });
        });
}