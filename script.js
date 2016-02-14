window.onload = function () {

	var playArea = document.getElementById('sandbox');

	var shortcats = {

		"escape" : 27,
		"shift" : 16,
		"alt" : 18
	}

	playArea.onkeydown = function (evt) {

	/** Проверяем alt + shift */
	if(evt.keyCode === shortcats.shift)
		playArea.value += 'shift';
	if(evt.keyCode === shortcats.alt)
		playArea.value += 'alt';
	};

	/** Показываем результат */
	if(playArea.value === 'shiftalt' || playArea.value === 'altshift') {
		playArea.value = 'You win';
	} else playArea.value = 'Try another one...';
};
