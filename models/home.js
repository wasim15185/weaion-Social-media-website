const mongoose = require('mongoose');
const { post } = require('../routes/auth');
const user = require('./user');

let homePageSchema = new mongoose.Schema({
	//user er model name hobe
	image: String,
	author: {
			type: mongoose.Schema.ObjectId,
			ref: 'user'	
	},

	postDescription: String,
	like: [ String ],
	disLike: [ String ],
	comments: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'comment'
		}
	]
});

// module.exports = mongoose.model('Home', homePageSchema);
module.exports = mongoose.model('Home', homePageSchema);
