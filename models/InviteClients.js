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
});

const Client = mongoose.model('ClientInvite', clientSchema);

module.exports = Client;