//import .env file and will use 'process.env.VARIABLE_NAME'
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const methodOverride = require('method-override');
const _ = require('underscore');
const passport = require('passport');
const passportLocal = require('passport-local');
const socket = require('socket.io');
const flash=require('connect-flash')
//importing session
const session = require('express-session');

// model files are importing
const homeModel = require('./models/home');
const userModel = require('./models/user');
const commentModel = require('./models/comment');
const msgModel = require('./models/message');
//routes are importing
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comment');
const frdRoutes = require('./routes/friends');
const messageRoutes = require('./routes/message');
const profileRoutes=require('./routes/profile')
//middlware importing
const { AuthMiddleWare,userDetials} = require('./middleware/middleware');

//for util
const { forUserTotalMsgArray } = require('./util/functionForSoket');



const mongoUrl=`mongodb://localhost:27017/Socialuser5`

//session o mongoose loction change korte hbe
mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => {
		console.log('mongodb connected');
	})
	

//this is multer part
//for multer set storage engine
// actually '.diskStorage' takes two argument 1. destination 2. filename
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		

				;
				console.log(__dirname)
				const dir = `${__dirname}/public/upload/${req.user._id}`;
				fs.stat(dir, (err,exist) => {
					if (!exist) {
						console.log('yes not exits')
						return fs.mkdir(dir, {recursive: true}, (error) => cb(error, dir));
					}
					return cb(null, dir);
				});
			
	},

	filename: function(req, file, callback) {
		let createdImageName;
		createdImageName = req.user._id + '-' + Date.now() + path.extname(file.originalname);
		
		callback(null, createdImageName);


	}
});
//--------------Initlize upload---------------------


const upload = multer({
	storage: storage,
	// limits:{fileSize:varforfile}
}).single('postImage');

//--------------------------------
const app = express();
//--------------------
const server = require('http').createServer(app);
//for express
app.use(express.urlencoded({ extended: true }));

//this is for body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
//this is use for axios because axios sent data in from of json
app.use(bodyParser.json());

//for method override
app.use(methodOverride('_method'));

//init express-session
//config session storage ====

const mongoStore = require('connect-mongo')(session);


const sessionStore = new mongoStore({
	url: mongoUrl,
	collection: 'sessions'
});

const secretOfcookie="zxxxyyyy"

app.use(
	session({
		secret:secretOfcookie ,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 12
		}
	})
);

//setup passport

//1. init passport
app.use(passport.initialize());
app.use(passport.session());

//2.
passport.use(new passportLocal({ usernameField: 'email' }, userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());



//from middleWare js
app.use(userDetials)

//for connct-flash
app.use(flash());


//routing middlware
app.use('/', authRoutes);
app.use('/home', commentRoutes);
app.use('/home', frdRoutes);
app.use('/home', messageRoutes);
app.use('/home',profileRoutes)




//Route starts from here
app.get('/', (req, res) => {
	res.render('landing.ejs');
});

app.get('/home', AuthMiddleWare, (req, res) => {
	//.populate khub usefull
	//populate('comments') er vetor j 'comments' a6e seta 'post' model er property
	//.populate.exec()-- use kora hoi kono post e jodi ref.type model thake take show  koranor jnno & populate model tar jnno amra ref model er vetor kaj korte parbo
	homeModel.find({}).populate({path:'author'}).populate({ path:'comments',populate:{path:"author",model:'user'}}).exec((err, allPosts) => {
		if (err) {
			console.log(err);
		} else {
			userModel.findOne({ email: req.session.passport.user }, (err, activeUser) => {
				if (err) {
					console.log(err);
				} else {
					// console.log(allPosts[0].comments);

					userModel.find({}, (err, users) => {
						if (err) {
							console.log(err);
						} else {
							// console.log(allPosts[0])
							res.render('home.ejs', { allPosts: allPosts, activeUser: activeUser, allUser: users });
						}
					});
				}
			});
		}
	});
});

app.post('/home', AuthMiddleWare, upload, (req, res) => {
			// console.log(req.body);
		
			 console.log(req.body)
			 console.log(req.file)
			 
			 
			let data
			 

			if(req.file){

				data = {
				   image:req.file.filename,
				   postDescription: req.body.postDescription,
				   author:  req.user._id,
			   };

			}else{

				data = {
					postDescription: req.body.postDescription,
					author:  req.user._id,
				};
				
			}
			 
	
			

			homeModel.create(data, (err, postDetails) => {
				if (err) {
					// throw new Error(err);
					console.log(`i am from line 155 ${err}`);
				} else {
					console.log('a new post is created');
					
					req.user.postCount++
					req.user.save((err,savedcount)=>{
						if(err){
							console.log(req.user.name+'post count didnot increase')
						}else{
							console.log(req.user.name+'post count INCREASED')
						}
					})
					res.redirect('/home');
				}
			});

});


app.delete('/home/:postId/delete/:imgName',AuthMiddleWare,(req,res)=>{

const dir = `${__dirname}/public/upload/${req.user._id}/${req.params.imgName}`

fs.stat(dir, (err,exist) => {
	if (exist) {
		
		//console.log('yes exits the file')
		fs.unlink(dir,(error)=>{
			if(!error){
				console.log('the image is deleted')	
				
			}
		})
	}
	
});

homeModel.deleteOne({_id:req.params.postId},(err,deletephoto)=>{
	if(err){
	}else{
		console.log('deleted document')

		req.user.postCount--
		req.user.save((err,savedcount)=>{
											if(err){
												console.log(req.user.name+'post count didnot increase')
											}else{
												console.log(req.user.name+'post count DECREASED')
											}
					  				})



		res.redirect('/home')

	}
})

})



app.delete('/home/:postId/delete',AuthMiddleWare,(req,res)=>{
	homeModel.deleteOne({_id:req.params.postId},(err,deletephoto)=>{
		if(err){
		}else{
			console.log('deleted document')

			req.user.postCount--
			req.user.save((err,savedcount)=>{

						if(err){
								console.log(req.user.name+' post count didnot decrease')
						}else{
							console.log(req.user.name+' post count DECREASED')
							}
					  	})


			res.redirect('/home')
	
		}
	})

})




app.post('/likeDislike', AuthMiddleWare, (req, res) => {
	
	const { like, dislike, postId } = req.body;
	let realActiveUser;
	userModel.findOne({ email: req.session.passport.user }, (err, activeUser) => {
		if (err) {
			console.log(err);
		} else {
			realActiveUser = activeUser._id;
		}
	});

	homeModel.findById(postId, (err, foundedPost) => {
		if (err) {
			console.log(err);
		} else {
			let likeArr = foundedPost.like;
			let dislikeArr = foundedPost.disLike;

			if (like) {
				if (likeArr.includes(realActiveUser)) {
					
					likeArr = _.filter(likeArr, (item) => {
						return item != realActiveUser;
					});
					
					foundedPost.like = likeArr;
				} else {
					if (dislikeArr.includes(realActiveUser)) {
						dislikeArr = _.filter(dislikeArr, (item) => {
							return item != realActiveUser;
						});
						foundedPost.disLike = dislikeArr;
					}

					likeArr.push(realActiveUser);
					foundedPost.like = likeArr;
				}

				foundedPost.save();
			}

			if (dislike) {
				if (dislikeArr.includes(realActiveUser)) {
					dislikeArr = _.filter(dislikeArr, (item) => {
						return item != realActiveUser; //'!=' sob kaj
					});

					foundedPost.disLike = dislikeArr;
				} else {
					if (likeArr.includes(realActiveUser)) {
						likeArr = _.filter(likeArr, (item) => {
							return item != realActiveUser;
						});
						foundedPost.like = likeArr;
					}
					dislikeArr.push(realActiveUser);
					foundedPost.disLike = dislikeArr;
				}

				foundedPost.save();
			}

			
		}
	});

	return res.json({ msg: 'okk' });
});

const port=5000

server.listen(port, () => {
	console.log('server started at '+port);
});

let userForSocket = [];
//setup socket.io

const io = socket(server);

//2. when a connect will made then this will fire
io.on('connection', (socket) => {
	console.log('made a socket connection');

	socket.on('for-sendingDetails', (userDeatials) => {
		

		if (_.findWhere(userForSocket, { activeId: userDeatials.activeId }) === undefined) {
			userForSocket.push(userDeatials);
			console.log('push is done');
		}

		if (_.findWhere(userForSocket, { activeId: userDeatials.activeId })) {
			_.findWhere(userForSocket, { activeId: userDeatials.activeId }).activeUserSocketId =
				userDeatials.activeUserSocketId;
		}

		
	});

	socket.on('message', (data) => {
		console.log(data);

		
		userModel.findById(data.receverId,(err,rUserFound)=>{
			if(err){

			}else{

				console.log(rUserFound.friends.includes(data.activeId))

			if(rUserFound.friends.includes(data.activeId)){
				
			



			if (_.findWhere(userForSocket, { activeId: data.receverId })) {

			
			

			console.log('reciver id--   ' + data.receverId);
			const receverObjDetails = _.findWhere(userForSocket, { activeId: data.receverId });
			
			//msg store starting from here
			const senderMsg = new msgModel({
				text: data.msg,
				authorId: data.activeId
			});

			

			
			senderMsg.save((err,sendMsavedIntoMsgDb)=>{
				if(err){
					console.log('saved')
	
					}else{

							userModel.findById(data.activeId, (err, activeUser) => {
								if (err) {
									console.log(err);
								} else {
									console.log('i am active USER');
				
									userModel.findById(data.receverId, (err, receverUser) => {
										if (err) {
											console.log(err);
										} else {
											console.log('i am recever USER');
											
											//1. This is 'Active User' For pusing recever_Id in totalMsg
								
											if (!forUserTotalMsgArray(activeUser.totalMsg, data.receverId)) {
												activeUser.totalMsg.push(data.receverId);
												activeUser.save();
												console.log(activeUser.totalMsg);
											}
				
											//2.This is 'Recever User' For pusing active_Id in totalMsg
											
											if (!forUserTotalMsgArray(receverUser.totalMsg, data.activeId)) {
												receverUser.totalMsg.push(data.activeId);
												receverUser.save();
												console.log(receverUser.totalMsg);
											}
											//3.
											if (forUserTotalMsgArray(activeUser.totalMsg, data.receverId)) {
												const particularAuser = forUserTotalMsgArray(activeUser.totalMsg, data.receverId);
				
												console.log(particularAuser);
												particularAuser.msg.push(sendMsavedIntoMsgDb);
												// particularAuser.msg.push(receiveMsavedIntoMsgDb);
												activeUser.save((err,savedAuser)=>{
													if(err){
														console.log(`find ${err} to save active User`)
													}else{
														console.log('active saved pushed user')
													}
												});
												
											}
											//4.
											if (forUserTotalMsgArray(receverUser.totalMsg, data.activeId)) {
												const partcularRuser = forUserTotalMsgArray(receverUser.totalMsg, data.activeId);
												partcularRuser.msg.push(sendMsavedIntoMsgDb);
												receverUser.save((err,savedReceveuser)=>{
													if(err){
														console.log(`found ${err} to save receve user`)
													}else{
														console.log('recieve saved after push recieve')
													}
												});
												
											}
										}
									});
								}
							});

						

				}
			})




			

			io
				.to(receverObjDetails.activeUserSocketId)
				// .emit('receive-msg', { msg: data.msg, receverId: data.receverId, activeId: data.activeId });
				.emit('receive-msg', { msg: data.msg, activeId: data.activeId });
		} else {
			
			console.log('your FRIEND  is offline');
			io.sockets.emit('offline-user',{msg:'Your Friends is Offline',data})
		}
	 }else{
		
		 io.sockets.emit('not-follow-frineds',{msg:'Your friend is not following you . Message is not Send !!!',data})

		console.log('your friends is NOT Follow you')
	 }
	}
})
		
	});

	socket.on('disconnect', (data) => {
		if (_.findWhere(userForSocket, { activeUserSocketId: socket.id })) {
			const exactElement = _.findWhere(userForSocket, { activeUserSocketId: socket.id });
			userForSocket = userForSocket.filter((item) => item !== exactElement);
		}
		console.log('poped the element');
		

		console.log('user disconnected');
	});
});


