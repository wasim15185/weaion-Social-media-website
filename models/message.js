const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
	text: String,
	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}
});

module.exports = mongoose.model('message', messageSchema);
