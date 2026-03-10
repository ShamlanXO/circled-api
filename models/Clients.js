const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    addedOn: {
        type: Date,
        default: Date.now
    }
    
});

ClientSchema.index({ instructor: 1 });
ClientSchema.index({ client: 1 });

module.exports =
mongoose.model('client', ClientSchema);
