// Elena: исходный скрипт

window.onload = function () {

	/*
	 * Lydia: добавила проверку на наличие textarea
	 * (чтобы на других страницах не было ошибок,
   * если там не будет этого элемента).
	 */
	if (document.getElementById('sandbox')) {
		var playArea = document.getElementById('sandbox');
	}

	var shortcats = {

		"escape": '27',
		"shift": '16',
		"alt": '18',
		// Lydia: добавила код для Ctrl
		"ctrl": '17'
	};

	var counter = 0;
	var result = '';

	/*
	 * Lydia: добавила проверку на наличие переменной playArea
	 * (чтобы на других страницах не было ошибок,
   * если там не будет textarea с id="sandbox").
	 */
	if (playArea) {
		playArea.onkeydown = function (evt) {

			// Elena: Считаем количество запусков скрипта
			++counter;

			// Elena: Записываем нажатые клавиши
			result += evt.keyCode;

			if (counter === 2) {

				// Elena: Проверяем alt + shift
				if (result === shortcats.alt + shortcats.shift && counter === 2) {
					playArea.value = 'You win';
					// Elena: Обнуляемся для следующей проверки
					result = '';
					counter = 0;
				} else {
					playArea.value = 'You loose...';

					// Elena: Обнуляемся для следующей проверки
					result = '';
					counter = 0;
				}
			}
		};
	}
};



/*
 * Lydia: Atom Shortcuts Quiz
 * TODO:
 * 1) добавить проверку: если выбран прааильный радио-инпут
 * или нажата правильная комбинация клавиш, перейти к следующему вопросу
 * (сама врядли справлюсь, но пытаюсь разобраться, как это реализовать);
 * 2) добавить итоги теста (может даже, со звуковым сопровождением и конфети).
 */

(function() {
	if (!document.querySelector(".quiz")) {
		return;
	}

	var quiz = document.querySelector(".quiz"),
			cards = quiz.querySelectorAll(".quiz__card"),
			btns = quiz.querySelectorAll(".btn");

	for (var i = 0; i < btns.length; i++) {
		var btn = btns[i];
		watchClick(btn, i);
	}

	/*
	 * Lydia: Навешивает на кнопки "Дальше" слушатель события "клик",
	 * скрывает текущую карточку и показывает следующую.
	 */
	function watchClick(btn, i) {
		btn.addEventListener("click", function() {
			removeClass(cards, "quiz__card--show");
			addClass(cards, "quiz__card--show", i);
		});
	}

	// Lydia: Убирает у всех карточек класс elemClass
	function removeClass(arr, elemClass) {
		for (var i = 0; i < arr.length; i++) {
			var elem = arr[i];
			elem.classList.remove(elemClass);
		}
	}

	function addClass(arr, elemClass, i) {
		/*
		 * Lydia: Если это последняя карточка, перейти к самой первой.
		 * В этом есть немного смысла:
		 * хотя бы можно подправить анимацию появления/исчезания карточки.
		 * TODO: нужна другая реализация.
		 */
		if (i == arr.length - 1) {
			arr[0].classList.add(elemClass);
		} else {
			// Lydia: показать следующую карточку.
			arr[i + 1].classList.add(elemClass);
		}
	}
})();
