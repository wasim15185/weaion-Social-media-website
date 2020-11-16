const userModel = require('../models/user');



let middleware = {
	AuthMiddleWare: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/signin');
	},

	userDetials:(req,res,next)=>{
		res.locals.currentUser=req.user
		next()
	}
	
};


module.exports = middleware;
