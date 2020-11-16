const hideBtn = document.querySelectorAll('.forJsHide');

for (i = 0; i < hideBtn.length; i++) {
	hideBtn[i].addEventListener('click', (e) => {
		const card = e.target.parentElement.parentElement.parentElement;
		// console.log(card);
		card.classList.add('customCardForFqandOptacity');
		// card.style.opacity = 0;
		setTimeout(() => {
			card.style.display = 'none';
		}, 800);
	});
}
