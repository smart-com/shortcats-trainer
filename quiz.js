/*
 * Lydia: Скрипт для викторины.
 *
 * Предполагается, что данный скрипт будет
 * расширять две главные функции основного скритпа (script.js):
 *
 * 1) общую проверку (расширить проверкой рабиобаттонов)
 * 2) переход от одного вопроса к другому
 *    (расширить переключением между карточками с вопросами).
 *
 * Пока что это не так. Сейчас этот файл используется
 * для поиска решений по реализации той или иной функции.
 */



// Lydia: кок-то так сделала переход между вопросами

(function() {
	var quiz = document.querySelector(".quiz"),
			cards = quiz.querySelectorAll(".quiz__card"),
			currentCard = cards[0],
			nextCard = cards[1],
			step = 1;

	quiz.addEventListener("click", function(event) {
		var target = event.target;
		if (target.tagName != "BUTTON") {
			return;
		}

		if (step != cards.length) {
			currentCard.classList.remove("quiz__card--show");
			nextCard.classList.add("quiz__card--show");
			currentCard = nextCard;
			nextCard = cards[step + 1];
			step++;
		} else {
			currentCard.classList.remove("quiz__card--show");
			currentCard = cards[0];
			currentCard.classList.add("quiz__card--show");
			nextCard = cards[1];
			step = 1;
		}
	});
})();
