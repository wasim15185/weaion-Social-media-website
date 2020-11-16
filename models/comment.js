const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	text: String,
	author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
	}
});

module.exports = mongoose.model('comment', commentSchema);
