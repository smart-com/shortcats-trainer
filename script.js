window.onload = function () {

	var playArea = document.getElementById('sandbox');

	playArea.onkeydown = function (evt) {

		//evt = evt || window.event;
		alert(event.keyCode);
	};
};
