window.onload = function () {

	var playArea = document.getElementById('sandbox');

	var shortcats = {

		"escape": '27',
		"shift": '16',
		"alt": '18'
	}

	var counter = 0;
	var result = '';

	playArea.onkeydown = function (evt) {

		// Считаем количество запусков скрипта
		++counter;

		// Записываем нажатые клавиши
		result += evt.keyCode;

		if (counter === 2) {

			// Проверяем alt + shift
			if (result === shortcats.alt + shortcats.shift && counter === 2) {
				playArea.value = 'You win';
				// Обнуляемся для следующей проверки
				result = '';
				counter = 0;
			} else {
				playArea.value = 'You loose...';

				// Обнуляемся для следующей проверки
				result = '';
				counter = 0;
			}
		}
	};
};
