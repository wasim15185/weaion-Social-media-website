const router = require('express').Router();
const bodyParser = require('body-parser');

const userModel = require('../models/user');
const commentModel = require('../models/comment');

//importing middleware
const { AuthMiddleWare } = require('../middleware/middleware');

router.post('/comment/:id', AuthMiddleWare, (req, res) => {
	//ai require ta important
	const homeModel = require('../models/home');

	const postId = req.params.id;
	// console.log(postId);
	const { comment } = req.body;

	homeModel.findById(postId, (err, post) => {
		if (err) {
			console.log(err);
			res.redirect('/home')
		} else {
			//finding Current  user
			userModel.findOne({ email: req.session.passport.user }, (err, user) => {
				if (err) {
					console.log(err);
					res.redirect('/home')
				} else {
					//founded Current user

					// post

					// create comment Obj
					const commentDetail = {
						text: comment,
						author: user._id,
							
					};
					//saving comment to comment DATABASE

					commentModel.create(commentDetail, (err, commentCreated) => {
						if (err) {
							console.log(err);
							res.redirect('/home')
						} else {
							//comment create
							
							post.comments.push(commentCreated);
							post.save();
							// console.log(post);
						}
					});
				}
			});
		}
	});

	res.redirect('/home');
});

router.put('/comment/edit/:id', (req, res) => {
	const commentId = req.params.id;
	const { editComment } = req.body;

	commentModel.findByIdAndUpdate(commentId, { text: editComment }, (err, updatedComment) => {
		if (err) {
			console.log(err);
			res.redirect('/home')
		} else {
			console.log('you comment is updated ');
			res.redirect('/home');
		}
	});
});

router.delete('/comment/delete/:id', (req, res) => {
	const commentId = req.params.id;
	commentModel.findByIdAndDelete(commentId, (err, deletedComment) => {
		if (err) {
			console.log(err);
			res.redirect('/home')
		} else {
			console.log('comment deleted');
			res.redirect('/home');
		}
	});
});

module.exports = router;
