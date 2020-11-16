const userModel=require('../models/user')
const _=require('underscore')


const funForSoket = {
	//finding user In Array
	forUserTotalMsgArray: (arr, id) => {
		for (i = 0; i < arr.length; i++) {
			if (arr[i]._id == id) {
				// console.log(true);
				return arr[i];
			}
		}
	}
	,
	forCheckFriends:(activeId,receverId)=>{
	 
		
		let check =userModel.findById(activeId,(err,foundUser)=>{

			if(err){
				console.log(err)
			}else{
				
				
				return foundUser.friends.includes(receverId)
				
			}
		})

		console.log(check)
		

	}
};

module.exports = funForSoket;
