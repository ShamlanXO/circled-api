const mongoose = require('mongoose')
var AddressSchema = new mongoose.Schema({
	name:{
		type:String
	},
	address: {
		type: String
	},
	locality:{
		type: String},

	landmark:{
		type: String},
	city: {
		type: String
	},
	state: {
		type: String
	},
	postal: {
		type: Number
	},
	stateCode: {
		type: String
	},
	country: {
		type: String
	},
	phone: {
		type: String
	}
});

let CartSchema = new mongoose.Schema(
    {


               quantity:
               {
                   type:Number,
                default:0
            },

                   product:
                   {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                   }






    }
);



var UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		default: ''
	},
	lastName: {
		type: String,
		trim: true,
		default: ''
	},
	displayName: {
		type: String,
		trim: true
	},
	

	email: {
		type: String,
		trim: true,
		default: '',
        unique: true
	},

	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date
	}
});
module.exports = mongoose.model('User', UserSchema)
