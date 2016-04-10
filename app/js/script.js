window.onload = function() {

	// Поле для вывода результатов тестирования
	var resultArea = document.getElementById('result-box');
	// Поле для вывода "вопросов"
	var quizArea = document.getElementById('quiz-box');

	// Объект для хранения
	// соответствий клавиш
	// цифровым кодам
	var hotkeys = {
		'alt': '18',
		'ctrl': '17',
		'enter': '13',
		'esc': '27',
		'shift': '16',
		'c': '67',
		'v': '86',
		's': '83',
		'backSlash': '220'
	};

	// Объект для хранения хоткеев c описаниями в конкретной ide
	// В качестве примера здесь выводятся сочетания клавиш
	// Вы можете самостоятельно заменить их в ide.description
	// на описания для вашей ide
	var ide_1 = [{
		'description': 'Ctrl + C',
		'shortcat': [hotkeys.ctrl, hotkeys.c]
	}, {
		'description': 'Ctrl + V',
		'shortcat': [hotkeys.ctrl, hotkeys.v]
	}, {
		'description': 'Ctrl + Alt + C',
		'shortcat': [hotkeys.ctrl, hotkeys.alt, hotkeys.c]
	}];

	// Л: другая IDE с другими шорткатами
	var ide_2 = [{
		'description': 'Ctrl + S',
		'shortcat': [hotkeys.ctrl, hotkeys.s]
	},{
		'description': 'Ctrl + \\',
		'shortcat': [hotkeys.ctrl, hotkeys.backSlash]
	}];

	// Л: селект, в котором выбирают IDE
	var select = document.getElementById("ide-selection");
	// Л: какую IDE выбрали (по умолчанию - ide_1)
	var selectedIde = ide_1;

	// Л: что делать, когда выбрали IDE
	select.onchange = function() {
		selectedIde = select.options[select.selectedIndex].value
		console.log(selectedIde);
	};

	// Переменная для реализации выхода из игры
	var play = '';
	// Счетчик запусков функции
	// равен количеству клавиш в тестируемом хоткее
	var counter = 0;
	// Строка запомнит нажатые клавиши
	var quiz = '';
	// Счетчик количества правильных ответов
	var result = 0;
	// Счетчик общего количества заданных вопросов
	var total = 0;

	// Получаем случайное число для выбора хоткея
	function getRand(max) {
		var min = 0;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Количество хоткеев в общем списке
	var hotkeyMax = selectedIde.length - 1;
	// Индекс случайного хоткея
	var hotkeyRand = getRand(hotkeyMax);
	// Количество клавиш в данном случайном хоткее.
	var keyMax = selectedIde[hotkeyRand].shortcat.length;
	// Выводим в html его описание (вопрос)
	quizArea.value = selectedIde[hotkeyRand].description;

	// Функция сокращает количество набираемого кода
	//
	// Обнуляем список набранных клавиш
	// И счетчик запусков проверки
	// Выбираем следующий случайный хоткей
	// И выводим его значение в html
	function cleanResults() {
		quiz = '';
		counter = 0;
		hotkeyRand = getRand(hotkeyMax);
		quizArea.value = selectedIde[hotkeyRand].description;
	}

	// Вешаем обработчик нажатия клавиш
	// Случайный шорткат уже выбран в стр.60
	// В html уже есть его описание
	window.document.onkeydown = checkShortcat;

	// Берет шорткат и проверяет его
	function checkShortcat(evt) {

		// Проверяем, не был ли выполнен выход из игры
		if (play === "finish") {
			return;
		}

		// Наращиваем количество запусков
		++counter;
		// Запоминаем код нажатой клавиши
		quiz += evt.keyCode;

		// Если счетчик запусков равен количеству клавиш в текущем хоткее
		// пора проверять, все ли правильно набрали,
		// т.к. очередность нажатия клавиш не важна
		if (counter === keyMax) {

			// Переменная для проверки наличия нажатой клавиши
			// в проверяемом хоткее
			var yes = true;

			// Ищем есть ли она в строчке с нажатыми клавишами
			for (var i = 0; i < keyMax; i++) {
				yes = ~quiz.indexOf(selectedIde[hotkeyRand].shortcat[i]);

				// Если клавиши нет, прекращаем проверку
				if (!yes) {
					break;
				}
			}

			// Обнуляемся для проверки следующих хоткеев
			cleanResults();

			// Если все клавиши присутствуют...
			if (yes) {
				resultArea.value = 'You win!!! Your results : ' + (++result) +
					' / ' + (++total);
			} else {
				resultArea.value = 'You loose!!! Your results : ' + result +
					' / ' + (++total);
			}
		}
	};

	// Реализация выхода из игры
	window.document.onkeyup = function gameOver(evt) {

		// Если нажата клавиша Enter
		if (evt.keyCode === +hotkeys.enter) {

			quizArea.value = "Thanks. Bye!";

			// Выводим общие результаты по игре
			if (result < total && result > 0) {
				resultArea.value = "Your results : " + result + " / " + total;
			} else if (result === total) {
				resultArea.value = "You are the best : " + result + " / " + total;
			} else if (result === 0) {
				resultArea.value = 'Oooops :(';
			}
			// Отменяем установку клавиатурных событий
			play = 'finish';
		}
	};
};
