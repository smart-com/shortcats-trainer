/*
 * Lydia: Скрипт для викторины.
 *
 * Предполагается, что данный скрипт будет
 * расширять две главные функции основного скритпа (script.js):
 *
 * 1) общую проверку (расширить проверкой рабиобаттонов)
 * 2) переход от одного вопроса к другому.
 *    (реализовать через переключение между карточками
 *    с вопросами и выбором ответа).
 *
 * Пока что это не так. Сейчас этот файл используется
 * для поиска решений по реализации той или иной функции.
 *
 * TODO:
 * 1) починить скрипт;
 * 2) добавить звуковое сопровождение и конфети.
 */



// Lydia: кок-то так сделала переход между вопросами

(function() {
	if (!document.querySelector(".quiz")) {
		return;
	}

	var quiz = document.querySelector(".quiz"),
      cards = quiz.querySelectorAll(".quiz__card");

  quiz.addEventListener("click", function(event) {
    // Сохраняем в переменную элемент, по которому кликнули.
    var target = event.target,
				// Сохраняем в переменную шаг.
				step = 1,
				// Сохраняем в переменную текущую карточку
				currentCard = cards[step - 1];

    // Проверяем: если этот элемент не кнопка, то не реагировать.
    if (target.tagName != "BUTTON") {
      return;
    }

  	// Иначе - перейти к следующей карточке.
    showNextCard(cards, "quiz__card--show", step);

    // Сохраняем в переменную текущую карточку и шаг
		if (step == arr.length) {
			step = 1;
			currentCard = cards[step - 1];
		} else {
			currentCard = cards[step];
			++step;
		}
  });


	function showNextCard(arr, elemClass, step) {
    // Скрыть текущую карточку
    currentCard.classList.remove(elemClass);

		// Если это последняя карточка, перейти к самой первой.
		if (step == arr.length) {
			arr[0].classList.add(elemClass);
		} else {
			// Иначе - показать следующую.
			cards[step].classList.add(elemClass);
		}
	}
})();
