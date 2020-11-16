const router = require('express').Router();
const _ = require('underscore');

const homeModel = require('../models/home');
const userModel = require('../models/user');
const commentModel = require('../models/comment');

//importing middleware
const { AuthMiddleWare } = require('../middleware/middleware');

router.get('/friends', AuthMiddleWare, (req, res) => {
	userModel.find({}, (err, allUser) => {
		if (err) {
			console.log(err);
			res.redirect('/home/friends')
		} else {
			userModel.findOne({ email: req.session.passport.user }).populate('friends').exec((err, activeUser) => {
				if (err) {
					res.redirect('/home/friends')
				} else {
					res.render('friends.ejs', { allUser, activeUser: activeUser });
				}
			});
		}
	});
});
//for frienList show routes
router.get('/friends/friendsList', AuthMiddleWare, (req, res) => {

	userModel.findOne({ email: req.session.passport.user }).populate('friends').exec((err, activeUser) => {
		if (err) {
			res.redirect('/home/friends/friendsList')
		} else {
			
			res.render('friendsList.ejs',{activeUser});
		}
	});



	



});

//for follow user router
router.post('/friends/:followedUserId/follow/:activeUserId', AuthMiddleWare, (req, res) => {
	userModel.findById(
		req.params.activeUserId,
		//start from here
		// { $push: { friends: [ req.params.followedUserId ] } },
		(err, activeUser) => {
			if (err) {
				console.log(err);
			} else {
				// activeUser
				// console.log(activeUser.friends.includes(req.params.activeUserId));
				// if (!activeUser.friends.includes(req.params.activeUserId)) {
				// 	activeUser.friends.push(req.params.activeUserId);
				// }
				activeUser.friends.push(req.params.followedUserId);
				activeUser.save();
				// console.log(activeUser);
				res.redirect('/home');
			}
		}
	);
});
//for unfollow user router

router.post('/friends/:unfollowedUserId/unfollow/:activeUserId', AuthMiddleWare, (req, res) => {
	userModel.findById(req.params.activeUserId, (err, activeUser) => {
		activeUser.friends = _.filter(activeUser.friends, (item) => {
			return item != req.params.unfollowedUserId;
		});
		activeUser.save();
		res.redirect('/home/friends');
	});
});

//for unfriend user router

module.exports = router;
