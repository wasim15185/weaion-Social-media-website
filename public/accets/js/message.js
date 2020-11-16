const userNames = document.querySelectorAll('.userName-js');

for (i = 0; i < userNames.length; i++) {
	// const text = userNames[i].innerText;
	if (userNames[i].innerText.length > 18) {
		userNames[i].innerText = `${userNames[i].innerText.substring(0, 15)}...`;
	}
}
