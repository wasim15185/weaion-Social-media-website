const router = require('express').Router();
const userModel = require('../models/user');
//importing middleware
const { AuthMiddleWare } = require('../middleware/middleware');

router.get('/message', AuthMiddleWare, (req, res) => {
	userModel.findOne({ email: req.session.passport.user }).populate('friends').exec((err, activeUser) => {
		if (err) {
			res.redirect('/home/message')
		} else {
			// console.log(activeUser);
			res.render('message.ejs', { activeUser });
		}
	});
});

router.get('/message/:id', AuthMiddleWare, (req, res) => {
	const particularUserId = req.params.id;
	userModel
		.findOne({ email: req.session.passport.user })
		.populate('friends')
		.exec((err, activeUser) => {
			if (err) {
				res.redirect('/home/message')
			} else {
				// console.log(activeUser);
				userModel.findById(particularUserId).populate('totalMsg.msg').exec((err, seletedUser) => {
					if (err) {
						console.log(err);
						res.redirect('/home/message')
					} else {
						
						console.log(seletedUser);
						res.render('messageSend.ejs', { activeUser, seletedUser });
					}
				});
			}
		});
});

module.exports = router;
