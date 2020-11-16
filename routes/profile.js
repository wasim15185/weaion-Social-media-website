const router = require('express').Router();

const flash=require('connect-flash')

//models
const homeModel=require('../models/home')
const userModel=require('../models/user')

//middleware
const { AuthMiddleWare} = require('../middleware/middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createCustomFile(string){
   fs.stat(string,(err,exist)=>{
      console.log(string)
      if (!exist) {
          fs.mkdir(string,{recursive: true}, (error) => {
             if(error){
                
                console.log(`file note created ${error}`)
             }else{
                console.log('file created')
             }
            
         });
      }else{

         console.log(string+'file is in our directory')
      }
      //return cb(null, dirProfile);
   })
}


class multerStorage{

   constructor(fileName){
     this.destination=(req,file,cb)=>{
        //1.
         const dirProfile=`./public/upload/${fileName}`
         createCustomFile(dirProfile)
         
         //2.
         const dir=`./public/upload/${fileName}/${req.user._id}`
         fs.stat(dir,(err,exist)=>{
            if (!exist) {
               return fs.mkdir(dir, (error) => cb(error, dir));
            }
            return cb(null, dir);
         })

   
      };


   }

   filename=function(req, file, callback){
      let createdImageName = req.user._id + '-' + Date.now() + path.extname(file.originalname);
		callback(null, createdImageName);
   }


}


router.get('/profile/:id',AuthMiddleWare,(req,res)=>{

   userModel.findById(req.params.id,(err,profileUserDetail)=>{

      if(err){
         console.log('err is from /profile/:id')
      }else{
         // for all post 
         homeModel.find({}).populate({path:'author'}).populate({path:'comments',populate:{path:"author",model:'user'}}).exec((err,allPosts)=>{
            if(err){
               console.log('i got a error')
            }else{
               
               res.render('profile.ejs',{proFileUserId:req.params.id,allPosts,profileUserDetail,message:req.flash('msg')})
            }
         })

       }

   })

})


const proFilePicStoreage=multer.diskStorage(new multerStorage('profile'))
const profilePicUpload=multer({
   storage:proFilePicStoreage,
   //1000000=1mb
   limits:{fileSize:2000000}
  }).single('profilePic')

router.post('/profile/:id/profilePhoto',AuthMiddleWare,(req,res)=>{


// console.log(req.file)


   profilePicUpload(req,res,(err)=>{
      if(err){
         //console.log(err)
         req.flash('msg',`Cannot Upload Pic ${err.message}.File Size Must be below 2Mb `)
         res.redirect(`/home/profile/${req.params.id}`)
      }else{
         if(!req.file){
            req.flash('msg',`You did Not Select a Image please Selete a image `)
            res.redirect(`/home/profile/${req.params.id}`)
         }else{
            userModel.findByIdAndUpdate(req.user._id,{profilePhoto:req.file.filename},(err,updatePropic)=>{
               if(err){
                  console.log(`${err} and this error in profilepic routes`)
               }else{
                  console.log(`${req.user.name} is changed a profile Pic`)
                  res.redirect(`/home/profile/${req.params.id}`)
               }
            })
            console.log(req.file.filename)
         }

         
      }
   })


})


const coverPicStoreage=multer.diskStorage(new multerStorage('cover'))
const coverPicUpload=multer({
   storage:coverPicStoreage,
   //1000000=1mb
   limits:{fileSize:2000000}
}).single('coverPic')


router.post('/profile/:id/coverPhoto',AuthMiddleWare,(req,res)=>{

   coverPicUpload(req,res,(err)=>{
      if(err){
         //console.log(err)
         console.log(err)
         req.flash('msg',`Cannot Upload CoverPic ${err.message}.File Size Must be below 10Mb `)
         res.redirect(`/home/profile/${req.params.id}`)
      }else{

         if(!req.file){

            req.flash('msg',`You did Not Select a Image please Selete a image `)
            res.redirect(`/home/profile/${req.params.id}`)

         }else{


            console.log(req.file.filename)

            userModel.findByIdAndUpdate(req.user._id,{coverPhoto:req.file.filename},(err,updateCoverpic)=>{
               if(err){
                  console.log(`${err} and this error in profilepic routes`)
               }else{
                  console.log(`${req.user.name} is changed a cover Pic`)
                  res.redirect(`/home/profile/${req.params.id}`)
               }
            })

            

         }
      }
   })


})






module.exports = router;