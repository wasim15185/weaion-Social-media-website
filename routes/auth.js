const router = require('express').Router();
const bodyParser = require('body-parser');
//require model
const userModel = require('../models/user');
const homeModel = require('../models/home');
//require passport
const passport = require('passport');
const { use } = require('./comment');
//require passport-local-mongoose

//login Route
router.get('/signin', (req, res) => {
	res.render('login.ejs');
});
router.post(
	'/signin',
	passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/signin'
		//failureFlash: true
	}),
	(req, res) => {}
);

//signup Route
router.get('/signup', (req, res) => {
	res.render('signup.ejs', { msg: '' });
});

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	//here ..data from req.body is saving newUserObj for easliy save to database
	const newUserObj = new userModel({
		name: name,
		email: email,
		username: email,
		profilePhoto:"",
		coverPhoto:""

	});

	userModel.findOne({ email: email }, (err, foundUser) => {
		if (err) {
			console.log(err);
			res.redirect('/signup')
		} else {
			if (!foundUser) {
				userModel.register(newUserObj, password, (err, user) => {
					if (err) {
						console.log(`i am from auth js line 41 --${err}`);
						return res.render('/signup');
					} else {
						user.friends.push(user._id);
						user.save();
						console.log('user created');

						passport.authenticate('local')(req, res, function() {
							res.redirect('/home');
						});
					}
				});
			} else {
				res.render('signup.ejs', { msg: 'this email is exit' });
			}
		}
	});
});

router.get('/signout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
