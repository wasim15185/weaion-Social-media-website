//----------------for IconDiv----------------------

const likeDiv = document.querySelectorAll('.like');
const commentDiv = document.querySelectorAll('.comment');
const dislikeDiv = document.querySelectorAll('.dislike');

//-----------------for Icon------------------------

const likeIcon = document.querySelectorAll('.likeIcon');
const commentIcon = document.querySelectorAll('.commentIcon');
const dislikeIcon = document.querySelectorAll('.dislikeIcon');

//--------------------for Inner Text of Like,dislike-----------------------

const likeCountSpan = document.querySelectorAll('.showLike > span');
const disLikeCountSpan = document.querySelectorAll('.showDislike > span');

//----------------------------------------------------
const commentBox = document.querySelectorAll('.forCommentJs');

//-------------for like -----------------------------
let likeCount;
let disLikeCount;

for (let i = 0; i < likeDiv.length; i++) {
	likeDiv[i].addEventListener('click', () => {
		const postId = likeCountSpan[i].id;

		if (likeIcon[i].style.color === color.green.rgb) {
			//count --
			//like decreament koro
			likeIcon[i].style.color = color.normalColor.hex; //then icon remove green
			likeCountSpan[i].innerHTML--;
			likeCount = likeCountSpan[i].innerHTML;
			sendDataToServer({ like: true, postId: postId });
			
		} else {
			//count ++
			if (dislikeIcon[i].style.color === color.red.rgb) {
				//remove  disLike count --
				//like increment  and dislike decremnt
				

				disLikeCountSpan[i].innerHTML--;
				dislikeCount = disLikeCountSpan[i].innerHTML;
				dislikeIcon[i].style.color = color.normalColor.hex;
			}

			//like count increment koro
			sendDataToServer({ like: true, postId: postId });

			likeIcon[i].style.color = color.green.rgb;
			likeCountSpan[i].innerHTML++;
			likeCount = likeCountSpan[i].innerHTML;
		}
	});
}

//------------------------for Dislike--------------------------------

for (let i = 0; i < dislikeDiv.length; i++) {
	dislikeDiv[i].addEventListener('click', () => {
		
		const postId = likeCountSpan[i].id;
		

		if (dislikeIcon[i].style.color === color.red.rgb) {
			//dislike decreament 
			sendDataToServer({ dislike: true, postId: postId });

			dislikeIcon[i].style.color = color.normalColor.hex;
			disLikeCountSpan[i].innerHTML--;
			dislikeCount = disLikeCountSpan[i].innerHTML;
		} else {
			if (likeIcon[i].style.color === color.green.rgb) {
				//like decreament and disLike increment 

				likeCountSpan[i].innerHTML--;
				likeCount = likeCountSpan[i].innerHTML;

				likeIcon[i].style.color = color.normalColor.hex;
			}
			//disLiked increment 
			sendDataToServer({ dislike: true, postId: postId });

			disLikeCountSpan[i].innerHTML++;
			disLikeCount = disLikeCountSpan[i].innerHTML;

			dislikeIcon[i].style.color = color.red.hex;
		}
	});
}
//---------------------------for comment------------------------------------------
for (let i = 0; i < commentDiv.length; i++) {
	commentDiv[i].addEventListener('click', () => {
		for (let j = 0; j < commentBox.length; j++) {
			if (i === j) {
				if (commentBox[j].style.display === 'none') {
					commentBox[j].style.display = 'block';
				} else {
					commentBox[j].style.display = 'none';
				}
				break;
			}
		}
	});
}


//-------------------------------------------------------------

//-------------------------for comment Edit button-------------------------------------

const commentEditBtns = document.querySelectorAll('.for-per-com-js');

for (i = 0; i < commentEditBtns.length; i++) {
	commentEditBtns[i].addEventListener('click', (e) => {
		let id = e.target.id;
		const dropDownBtn = document.querySelector(`.dropDown${id}`);
		const commentPara = document.getElementById(`commentPara${id}`);
		const editCommentForm = document.getElementById(`editCommentPara${id}`);

		commentPara.style.display = 'none';
		editCommentForm.style.display = 'block';
		dropDownBtn.style.display = 'none';
	});
}

//-------------------------for comment cancel Edit button-------------------------------------

const cancelBtns = document.querySelectorAll('.for-js-cancel');
for (i = 0; i < cancelBtns.length; i++) {
	cancelBtns[i].addEventListener('click', (e) => {
		
		const id = e.target.classList[3].split('-')[1];

		const dropDownBtn = document.querySelector(`.dropDown${id}`);
		const commentPara = document.getElementById(`commentPara${id}`);
		const editCommentForm = document.getElementById(`editCommentPara${id}`);
		// const deleteBtn = document.getElementsByClassName(`delete${id}`)[0];

		commentPara.style.display = 'block';
		editCommentForm.style.display = 'none';
		
		dropDownBtn.style.display = 'block';
	});
}

//frind request anchor tab
const anchorFq = document.querySelectorAll('.forJsFq');
for (i = 0; i < anchorFq.length; i++) {
	if (anchorFq[i].innerText.length > 10) {
		const text = anchorFq[i].innerText;
		const updatedStr = text.substring(0, 7);
		anchorFq[i].innerText = updatedStr + ' ...';
	}
}



const preload=document.getElementById('preloader')

const load=()=>{
	preload.style.display='none'
}


window.onload=load