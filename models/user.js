const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
	name: String,

	password: String,
	postCount:{type:Number,default:0},
	email: {
		type: String
	},
	profilePhoto:String,
	coverPhoto:String,
	username: String,
	friends: [ { type: mongoose.Types.ObjectId } ],
	totalMsg: [
		{
			id: { type: mongoose.Schema.ObjectId, ref: 'user' },
			msg: [ { type: mongoose.Schema.ObjectId, ref: 'message' } ]
		}
	]
});

//plug-in passport-local-mongoose
userSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('user', userSchema);
