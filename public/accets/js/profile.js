
const inputForImg=document.querySelector('.inputForProfileSector')

// for icon
const profileLikeIcon=document.querySelectorAll('.profileLikeIcon')
const profileDisLikeIcon=document.querySelectorAll('.profileDisLikeIcon')
//for icon div

const divForLike=document.querySelectorAll('.divForLike')
const divForDisLike=document.querySelectorAll('.divForDislike')


// for inside icon text
const profileLikeIconText=document.querySelectorAll('.likeText')
const profileDisLikeIconText=document.querySelectorAll('.disLikeText')



//for like 

for(let i=0;i<divForLike.length;i++){
    divForLike[i].addEventListener('click',()=>{
        const postId=document.querySelectorAll('.toGraveProfileUserId')[i].id
        //console.log(postId)
        if(profileLikeIcon[i].style.color===color.green.rgb){
            profileLikeIcon[i].style.color = color.normalColor.hex;
            profileLikeIconText[i].innerHTML--
            sendDataToServer({ like: true, postId: postId });
        }else{

            if (profileDisLikeIcon[i].style.color === color.red.rgb){

                profileDisLikeIconText[i].innerHTML--
                profileDisLikeIcon[i].style.color=color.normalColor.hex;
            }
            sendDataToServer({ like: true, postId: postId });
            profileLikeIcon[i].style.color = color.green.rgb;
            profileLikeIconText[i].innerHTML++
        }
    })
}

//for dislike

for(let i=0;i<divForDisLike.length;i++){
    divForDisLike[i].addEventListener('click',()=>{
        const postId=document.querySelectorAll('.toGraveProfileUserId')[i].id

        if(profileDisLikeIcon[i].style.color===color.red.rgb){
            profileDisLikeIcon[i].style.color=color.normalColor.hex;
            profileDisLikeIconText[i].innerHTML--
            sendDataToServer({ dislike: true, postId: postId });

        }else{
            if(profileLikeIcon[i].style.color===color.green.rgb){
                profileLikeIconText[i].innerHTML--
                profileLikeIcon[i].style.color=color.normalColor.hex
            }

            sendDataToServer({ dislike: true, postId: postId });
            profileDisLikeIconText[i].innerHTML++
            profileDisLikeIcon[i].style.color=color.red.hex;

        }

    })


}





const commentIconDiv=document.querySelectorAll('.commentIcon-div-js')
const commentShowDivs=document.querySelectorAll('.commentDiv-js')
const profileCommentIcon=document.querySelectorAll('.profileCommentIcon')



 for(let i=0;i<commentIconDiv.length;i++){
     commentIconDiv[i].addEventListener('click',()=>{
         for( let j=0;j<commentShowDivs.length;j++){
             if(i==j){
                 if(commentShowDivs[j].style.display=='none'){
                    commentShowDivs[j].style.display='block'
                    profileCommentIcon[j].style.color=color.blue.rgb
                 }else{
                    commentShowDivs[j].style.display='none'
                    profileCommentIcon[j].style.color=color.normalColor.rgb

                 }
                
             }
         }
     })
 }


// for commend



//for profilepic form selecting

$('.propicSelect-js').on({
    mouseenter: function () {
        $('.cameraIconDiv').slideDown( "fast")
    },
    mouseleave: function () {
        //stuff to do on mouse leave
        $('.cameraIconDiv').slideUp( "fast")
    }
})

