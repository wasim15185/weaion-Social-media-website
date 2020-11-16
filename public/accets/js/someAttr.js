//---------------------color-------------------------------

//green--#0ff10b, rgb(15, 241, 11)
//red--#f10b0b ,rgb(241, 11, 11)
//actual color--#9c9b9b, rgb(156, 155, 155)

const color = {
	green: {
		rgb: `rgb(15, 241, 11)`,
		hex: '#0ff10b'
	},
	normalColor: {
		rgb: 'rgb(156, 155, 155)',
		hex: '#9c9b9b'
	},
	red: {
		rgb: 'rgb(241, 11, 11)',
		hex: '#f10b0b'
	},
	blue:{
		rgb:'rgb(52, 128, 235)'
	}
};



//-----------------for axios---------------------
// here data argument always Object
const sendDataToServer = (data) => {
	axios
		.post('/likeDislike', data)
		.then((res) => {
			// console.log();
		})
		.catch((reject) => {
			console.log(reject);
		});
};

//data obj for axios
const data = {
	like: {
		increment: true,
		decrement: true
	},
	disLike: {
		increment: true,
		decrement: true
	}
};
