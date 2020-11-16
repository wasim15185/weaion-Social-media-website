

const sentBtn = document.querySelector('.messageSendBtn-js');
const msgInput = document.querySelector('.msgInput-js');
const commonClassForDisconnetSocket = document.querySelectorAll('.common-For-msg-js');

const msgShowPart = document.querySelector('.totalMsgShowpart-js');
const forActiveId = document.querySelector('.aUserFormsgSend11').id;//eta a6e header.ejs e


const offlineAlertDiv=document.querySelector('.js-errorOf-offline')





const particularUserId = window.location.pathname.split('/').pop();

let socket = io.connect();

socket.on('connect', () => {
	// console.log('i ssss---  ' + socket.id);
	socket.emit('for-sendingDetails', { activeId: forActiveId, activeUserSocketId: socket.id });
});



$('.common-For-msg-js').click(function() {
	socket.disconnect();
});

//msg send logic
sentBtn.addEventListener('click', (e) => {
	console.log('click on me');
	e.preventDefault();


	socket.emit('message', { msg: msgInput.value.trim(), receverId: particularUserId, activeId: forActiveId });
	const paragraphElement = document.createElement('p');

	paragraphElement.innerText = msgInput.value.trim();
	paragraphElement.classList.add('forOwnUserDiv');
	
	msgShowPart.appendChild(paragraphElement);
	msgInput.value = ' ';
});

socket.on('receive-msg', (receivedData) => {
	

	
	if(offlineAlertDiv.style.display=='block'){
		offlineAlertDiv.style.display='none'
		socket=io.connect()
	}



	if (receivedData.activeId === particularUserId) {
		
		
		const paragraphElement = document.createElement('p');
		paragraphElement.innerText = receivedData.msg;
		paragraphElement.classList.add('forAnotherUserDiv');
		msgShowPart.appendChild(paragraphElement);
	}
});

socket.on('not-follow-frineds',(msgForNotFollow)=>{
	

	if(msgForNotFollow.data.receverId==particularUserId &&  msgForNotFollow.data.activeId==forActiveId){
		
		const alertFormsgNotFollowDiv=document.querySelector('.js-errorOf-notFollowing')
		
		alertFormsgNotFollowDiv.style.display='block'
		alertFormsgNotFollowDiv.innerText=msgForNotFollow.msg

		socket=null
	}
})

socket.on('offline-user',(offlinedata)=>{
	

	if(offlinedata.data.receverId==particularUserId && offlinedata.data.activeId==forActiveId){
		offlineAlertDiv.style.display='block'
		offlineAlertDiv.innerText=offlinedata.msg
		socket=null
	}

})




