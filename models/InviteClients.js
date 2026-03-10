const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
      
    },
    message: {
        type: String,
        
    },
    email: {
        type: String,
        required: true,
  
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    invitedAt: {
        type: Date,
        default: Date.now
    },
    accepted: {
        type: Boolean,
        default: false
    }
   
    
},{ timestamps: true ,strict:false});

clientSchema.index({ invitedBy: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ accepted: 1, invitedBy: 1 });

const Client = mongoose.model('ClientInvite', clientSchema);

module.exports = Client;
