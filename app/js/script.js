/**
 * @namespace playShortcats
 * @summary Пространство имен для приложения
 * @listen window:onload
 * See {@tutorial readMe}
 * @return { Object } Пока что эта штука используется только для тестов...
 */
var playShortcats = function() {

	// Чтобы добавить IDE, нужно просто добавить
	// название вашей IDE в HTML-селект,
	// описания и сканкоды клавиш в hotkeys,
	// сам объект IDE и проинициализировать его
	// при помощи {@link: app.editorsInit();}

	/**
	 * @summary  Хранит клавиши и сканкоды к ним
	 * @name     hotkeys
	 * @type     {Object}
	 */
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

	/**
	 * @summary Сканкоды и описания для atom
	 * @name                     atom
	 * @type     {Array<Object>}
	 * @property {String}        description  Описание шортката
	 * @property {Array<Object>} keys         Сканкоды к шорткатам
	 * @borrows                  hotkeys as keys
	 */
	var atom = [{
		'description': 'Ctrl + C',
		'keys': [ hotkeys.ctrl, hotkeys.c ]
	}, {
		'description': 'Ctrl + V',
		'keys': [ hotkeys.ctrl, hotkeys.v ]
	}, {
		'description': 'Ctrl + Alt + C',
		'keys': [ hotkeys.ctrl, hotkeys.alt, hotkeys.c ]
	}];

	/**
	 * @summary Сканкоды и описания для sublime
	 * @name                      sublime
	 * @type     {Array<Object>}
	 * @property {String}         description  Описание шортката
	 * @property {Array<Object>}  keys         Сканкоды к шорткатам
	 * @borrows                   hotkeys as keys
	 */
	var sublime = [{
		'description': 'Ctrl + S',
		'keys': [ hotkeys.ctrl, hotkeys.s ]
	},{
		'description': 'Ctrl + \\',
		'keys': [ hotkeys.ctrl, hotkeys.backSlash ]
	}];

	/**
	 * @summary Управляет приложением
	 * @name              app
	 * @type     {Object}
	 * @property {Number} counter     Количество нажатых клавиш в текущей проверке
	 * @description  counter запоминается здесь, так как quiz полностью очищается
	 *               после нажатия каждой клавиши.
	 *               Таким образом получается проверять отдельно каждое нажатие,
	 *               что даст возможность подсветки верно нажатых клавиш в HTML
	 * @property {Method} editorsInit Добавляет все IDE в общий массив
	 * @property {Method} htmlInit    Инициализирует html-элементы приложения
	 * @property {Method} quizInit    Создает экземпляр викторины
	 *                                и инициализирует его значениями
	 * @property {Method} quizOver    Выход из игры
	 * @property {Method} clearQuiz   Очищает результаты перед следующей проверкой
	 */
	var app = {

		counter: 0,

		/**
		 * @method editorsInit
		 * @param  {...Object}     ide    Все имеющиеся в приложении
		 *                                объекты IDE через запятую
		 * @return {Array<Object>}        Массив из IDE, переданных в параметры
		 */
		editorsInit: function( ide ) {

			/**
			 * @summary Временный массив
			 * @type {Array<Object>}
			 * @private
			 */
			var editors = [];

			// Берем все аргументы из arguments
			for( var i = 0; i < arguments.length; i++ ) {
				editors.push( arguments[ i ] );
			}

			return editors;
		},

		/**
		 * @method htmlInit
		 * @param  {String} select_id      Идентификатор селекта для выбора IDE
		 * @param  {String} quizArea_id    Идентификатор поля для вывода описаний шорткатов
		 * @param  {String} resultArea_id  Идентификатор вывода результатов тестирования
		 * @return {Object}                Объект со свойствами, каждое из которых
		 *                                 отдельный HTML-элемент
		 */
		htmlInit: function( select_id, quizArea_id, resultArea_id ) {

			return {
				/** @property {Object} select       Селект для выбора IDE */
				select: document.getElementById( select_id ),
				/** @property {Object} quizArea     Поле для вывода описания для шорткатов */
				quizArea: document.getElementById( quizArea_id ),
				/** @property {Object} resultArea   Поле для вывода результатов тестирования */
				resultArea: document.getElementById( resultArea_id ),
			};
		},

		/**
		 * @method quizInit
		 * @return {Object} Новая проверка
		 */
		quizInit: function() {
			quiz = new Quiz();
			// Устанавливаем текущую IDE
			quiz.setCurrentIde();
			// Выбираем и устанавливаем текущий шорткат
			quiz.setRandomShortkat();
			// Выводим его описание
			quiz.showQuestion( html.quizArea );
			// Очищаем поле, если там остались результаты прошлой проверки
			html.resultArea.value = '';
			return quiz;
		},

		/**
		 * @method quizOver
		 * @param  {Object}          event  Событие нажатия клавиш
		 * @listen                   keyboard:onkeydown
		 */
		quizOver: function( event ) {

			/** Была ли нажата Enter */
			if ( event.keyCode === +hotkeys.enter) {
				// Прощаемся
				html.quizArea.value = "Thanks. Bye!";
				// Выводим результаты общей проверки
				quiz.showTotal();
				// Меняем статус игры / Снимаем все обработчики
				quiz.gameStatus = false;
			}
		},

		// Лида, 2016.05.03: метод clearQuiz из Quiz перенесен в app
		clearQuiz: function() {
			// Игра продолжается
			yes = true;
			app.counter = 0;
			// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
			this.userInput = [];
			// Лида, 2016.05.19: реализована подсветка клавиш при ошибочном нажатии.
			html.quizArea.innerHTML = "";
		}
	};

	/**
	 * @class  Quiz
	 * @classdesc Создает объект проверки и заполняет его свойствами
	 * @type     {Function}
	 * @property {Boolean}   gameStatus            Состояние игры
	 * @property {Object}    currentIde            Текущая IDE
	 * @property {String}    randomShortcat        Проверяемый шорткат,
	 *                                             преобразованный в строку
	 * @property {String}    userInput             Клавиши, набранные пользователем
	 * @property {Number}    totalResult           Все ответы по выбранной IDE
	 * @property {Number}    currentResult         Только правильные ответы
	 * @property {Method}    setCurrentIde         Устанавливает текущую IDE
	 * @property {Method}    setRandomShortkat     Устанавливает случайный шорткат
	 * @property {Method}    showQuestion          Выводим описание случайного шортката в HTML
	 * @property {Method}    showWin               Выводит в HTML положительный результат проверки
	 *                                             и изменяет значения счетчиков
	 * @property {Method}    showLoose             Выводит в HTML отрицательный результат
	 *                                             и изменяет значение общего счетчика проверок
	 * @property {Method}    showLoose             Выводит в HTML отрицательный результат
	 *                                             и изменяет значение общего счетчика проверок
	 * @property {Method}    showTotal             После нажатия Enter выводим результат проверок
	 *                                             по текущей IDE
	 * @property {Method}    checkShortcat         Проверяет шорткат, введенный пользователем
	 * @return   {Object} Проверяет текущий шорткат
	 */
	var Quiz = function() {
		this.gameStatus = true;
		this.currentIde = {};
		this.randomShortcat = '';
		// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
		this.userInput = [];
		this.totalResult = 0;
		this.currentResult = 0;

		this.setCurrentIde = function() {
			// Отнимаем единичку, чтобы не выходить за пределы массива с IDE
			this.currentIde = editors[ html.select.selectedIndex - 1 ];
		};

		this.setRandomShortkat = function() {

			/**
			 * @summary Получает случайное число из заданного диапазона
			 * @type {Function}
			 * @private
			 * @param  {Number} arrayLength Максимальная граница диапазона
			 * @return {Number}             Случайное число
			 */
			function getRand( arrayLength ) {
				// Минимальная граница диапазона
				var min = 0;
				return Math.floor( Math.random() * ( arrayLength - min + 1 ) ) + min;
			}

			// Случайный индекс для выбора шортката
			var randomIndex = getRand( this.currentIde.length - 1 );

			// Устанавливаем случайный шорткат при помощи случайного индекса
			this.randomShortcat = this.currentIde[ randomIndex ];

			//return randomIndex;
		};

		/**
		 * @param    {Object} htmlOutput  Поле для вывода описания шортката
		 * @property {Array}  description Массив с клавишами вроде ["Ctrl", "S"]
		 * @property {Method} createSpan  Создает тег span, кладет в него содержимое
		 *                                элемента массива и возвращает этот тег
		 * @todo  Извлечь метод и перенести его в html или в app?..
		 */
		this.showQuestion = function( htmlOutput ) {
			// Лида, 2016.05.19: реализована подсветка клавиш при ошибочном нажатии.

			// массив с клавишами вроде ["Ctrl", "S"]
			var description = this.randomShortcat.description.split(" + ");

			// каждую клавишу обернуть span'ом и положить в output.quiz-area
			description.forEach(function(key) {
				htmlOutput.appendChild(createSpan(key));
			});

			// создает тег span, кладет в него содержимое элемента массива и возвращает этот тег
			function createSpan(key) {
				var span = document.createElement("span");
				span.innerHTML = key;
				return span;
			}
		};

		/** @todo  Извлечь метод и перенести его в app */
		// Лида, 2016.05.03: метод clearQuiz из Quiz перенесен в app

		/**
		 * @param  {Object} event Событие нажатия клавиши
		 * @todo Хоть эта функция и лучше, чем была, но она мне все равно не нравится
		 *       Она какая-то кривая, много всего проверяет и под тесты не ложится...
		 */
		this.checkShortcat = function( event ) {
			// Еще одна проверка
			app.counter++;
			// Запоминаем нажатую клавишу
			// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
			this.userInput.push( event.keyCode );

			// Преобразовываем в строку массив случайного шортката и запоминаем
			var randomShortcat = this.randomShortcat.keys.join( '' );
			// Предполагаем, что проверка не прошла
			var checkResult = false;

			// Если в строке случайного шортката есть нажатая клавиша ...
			// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
			if ( this.userInput[app.counter - 1] === +this.randomShortcat.keys[app.counter - 1] ) {
				// Значит нажата верная клавиша
				checkResult = true;
				// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
				html.quizArea.children[app.counter - 1].className = 'success';
			}
			else {
				/**
				 * @todo  Подсветить нажатую клавишу в описании шортката,
				 *        чтобы было видно сколько клавиш нажал пользователь
				 */
				 // Лида, 2016.05.19: реализована подсветка клавиш при ошибочном нажатии.
				html.quizArea.children[app.counter - 1].className = 'error';
			}

			// Если было нажато столько же клавиш, сколько есть в проверяемом шорткате ...
			if( app.counter === this.randomShortcat.keys.length ) {

				// ...и если последняя нажатая клавиша есть в случайном шорткате ...
				// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
				if( this.userInput.join( '' ) === this.randomShortcat.keys.join( '' ) ) {
					// ... значит шорткат верен
					if( checkResult === true ) {
						// Показываем пользователю положительный результат
						this.showWin( checkResult );
					}
				} else {

					// Иначе показываем ошибку
					this.showLoose();
				}
				// Очищаем результаты перед проверкой следующего шортката
				// Лида, 2016.05.03: метод clearQuiz из Quiz перенесен в app
				app.clearQuiz.call(this);
				// Устанавливаем следующий случайный шорткат
				quiz.setRandomShortkat();
				// Вывадим его описание в HTML
				quiz.showQuestion( html.quizArea );
			}
		},

		// Выводим в HTML положительный результат проверки
		// и инкрементируем счетчики правильных ответов и общий
		/** @todo  Извлечь метод и перенести его в html или в app?.. */
		this.showWin = function() {
			html.resultArea.value = 'You win!!! Your results : ' +
										++this.currentResult + ' / ' +
										++this.totalResult;
		},

		// Выводим в HTML отрицательный результат проверки
		// и инкрементируем только общий счетчик
		/** @todo  Извлечь метод и перенести его в html или в app?.. */
		this.showLoose = function() {
			html.resultArea.value = 'You loose!!! Your results : ' +
									this.currentResult + ' / ' +
									++this.totalResult;
		},

		// Выводим общие результаты по текущей IDE
		/** @todo  Извлечь метод и перенести его в html или в app?.. */
		this.showTotal = function() {
			// Если правильных ответов меньше, чем общий результат просто выводим общие результаты
			if ( this.currentResult < this.totalResult && this.currentResult > 0 ) {
				html.resultArea.value = "Your results : " + this.currentResult + " / " + this.totalResult;

			// Если не было ни одного неверного ответа ...
			} else if ( this.currentResult === this.totalResult ) {
				html.resultArea.value = "You are the best : " + this.currentResult + " / " + this.totalResult;

			// Если не было ни одного верного ответа ...
			} else if (this.currentResult === 0) {
				html.resultArea.value = 'Oooops :(';
			}
		};
	};

	// Запуск приложения

	/**
	 * @summary Массив с IDE
	 * @type {Array}
	 */
	var editors = app.editorsInit( atom, sublime );

	/**
	 * @summary Инициализируем HTML
	 * @type {Object}
	 */
	var html = app.htmlInit( 'ide-selection', 'quiz-box', 'result-box' );

	/**
	 * @summary Запускаем первую проверку вручную,
	 *          так как событие нажатия на клавиатуру еще не произошло
	 * @type {Quiz}
	 */
	var quiz = app.quizInit();

	// ===========================================================

	/**
	 * @summary Инициализирует собственное событие на основе стандартного keydown
	 * @name initKeyDown
	 * @event window#keydown
	 * @type {Function}
	 * @fires keydown
	 * @property {boolean} isRepeat Автоповтор нажатия клавиши
	 * @description  Иначе не удается отменить автоповтор у keydown
	 *               а keyup некорректно ловит зажатые клавиши:
	 *               Если пользователь отпускает одну, а не все сразу,
	 *               то проверка возвращает ошибочный результат
	 * @param {Object} event Стандартное keydown
	 */
	function InitKeyDown ( event ) {
		// Для FF
		if( window.KeyEvent ) {
			var event = document.createEvent( 'KeyEvents' );
			event.initKeyEvent( 'keyup', true, true, window, false, false, false, false, 13, 0 );
			window.dispatchEvent( event );
		} // Для остальных браузеров
		else {
			var event = document.createEvent( 'UIEvents' );
			event.initUIEvent( 'keyup', true, true, window, 1 );
			// Указываем дополнительный параметр, так как initUIEvent его не принимает
			event.keyCode = 13;
			// Отправляет событие в общую систему событий
			window.dispatchEvent( event );
		}
	}

	/**
	 * @summary Запрещает автоповтор события
	 * @name  forbidRepetition
	 * @type   {Function}
	 * @param  {Object}    event Событие для которого нужно запретить автоповтор
	 * @return {Boolean}         Если событие повторяется, возвращаем false
	 */
	function forbidRepetition ( event ) {
		// В IE9 event.repeat всегда false
		if( window.event && 'repeat' in window.event ) {
			if( window.event.repeat ) {
				return false;
			}
		}
		//else {
			//alert ("Чтобы продолжить игру, обновите, пожалуйста, браузер...");
			// Закомментировано, потому что срабатывает в FF,
			// при этом после закрытия alert-а все нормально работает
		//}

		// Запускаем обработчик keydown
		keyDownHandler( event );
		// Инициализируем собственное событие
		InitKeyDown ( event );
		// Запускаем событие
		return true;
	}

	/**
	 * @summary Запускает следующую проверку шорткатов,
	 *          если не был выполнен выход из игры
	 * @name            keyDownHandler
	 * @type {Function}
	 * @listens         window:keydown
	 * @param  {Object} event Событие нажатия на клавиатуру
	 * @return                 Простой выход до следующего нажатия на клавишу
	 */
	var keyDownHandler = function ( event ) {

		// Если была нажата Enter ...
		if ( event.keyCode === +hotkeys.enter ) {
			// Игра окончена
			app.quizOver( event );
		}
		// Если игра продолжается ...
		if ( quiz.gameStatus ) {
			// Проверяем текущий шорткат
			quiz.checkShortcat( event );
			// Запускаем тесты
			runTests();
		// Иначе просто выходим ( ждем следующего нажатия )
		} else {
			return;
		}
	};

	var runTests = function() {
		var mochaDiv = document.getElementById( 'mocha');
		mochaDiv.innerHTML = '';
		mocha.run();
	};

	// keydown с запрещенным автоповтором
	// 05.28
	// window.document.addEventListener( 'keydown', forbidRepetition );
	window.document.addEventListener( 'keydown', onKeydown );
	function onKeydown( event ) {
		// полифилл пока подключен в head
		if ( ideAdditionPanel.contains( event.target ) ) return true;
		else forbidRepetition( event );
	}

	// Реализация выхода из игры
	// window.document.addEventListener( 'keydown', forbidRepetition );

	// Смена текущей IDE
	html.select.addEventListener( 'change', function( event ) {
		// Лида, 2016.05.23: реализована подсветка клавиш при правильном нажатии.
		app.clearQuiz.call(Quiz);
		quiz = app.quizInit();
		runTests();
	});



	// 05.29
	// поместила именно сюда просто чтобы работало
	var ideAdditionPanel = document.getElementById( 'ide-addition-panel' );
	var ideNameInput = ideAdditionPanel.querySelector( '[name="ide-name"]' );
	var keyInputs = ideAdditionPanel.querySelectorAll( '.key-input' );
	var addKeyBtn = ideAdditionPanel.querySelector( '.btn-add-key' );
	var addIdeBtn = ideAdditionPanel.querySelector( '.btn-add-ide' );

	ideAdditionPanel.onclick = function( event ) {
		if ( event.target === addKeyBtn ) {
			addInput();
		} else if ( event.target === addIdeBtn ) {
			if ( ideNameInput.value && checkKeyInputs() ) createUserIde();
			else highlightEmptyInputs();
		}
	};

	ideAdditionPanel.addEventListener( 'focus', function( event ) {
		if ( event.target.classList.contains( 'empty' ) )
			event.target.classList.remove( 'empty' );
	}, true );

	function addInput () {
		var input = document.createElement( 'input' );
		input.className = 'key-input';

		var inputNumber = keyInputs.length + 1;
		input.setAttribute( 'id', 'key-' + inputNumber );
		input.setAttribute( 'name', 'key-' + inputNumber );

		input.setAttribute( 'type', 'text' );
		input.setAttribute( 'list', 'key-list' );

		var lastInput = keyInputs[keyInputs.length - 1];
		// полифилл пока подключен в head
		lastInput.after( input );

		keyInputs = ideAdditionPanel.querySelectorAll( '.key-input' );
	}

	function pickIdeData() {
		// получить название IDE
		var ideName = ideNameInput.value.toLowerCase();

		// получить клавиши
		var keys = [];
		Array.prototype.forEach.call( keyInputs, function( keyInput ) {
			keys.push( keyInput.value.toLowerCase() );
		} );

		var ideData = [ideName, keys];
		return ideData;
	}

	function checkKeyInputs() {
		var check = Array.prototype.every.call( keyInputs, function( keyInput ) {
			if ( keyInput.value ) return true;
		} );

		return check ? true : false;
	}

	function highlightEmptyInputs() {
		var allInputs = ideAdditionPanel.getElementsByTagName( "INPUT" );
		var emptyInputs = Array.prototype.filter.call( allInputs, function( keyInput ) {
			if ( !keyInput.value ) return true;
		} );
		Array.prototype.forEach.call( emptyInputs, function( emptyInput ) {
			emptyInput.classList.add( "empty" );
		} );
	}

	function createUserIde() {
		var ideData = pickIdeData();
		var ideName = ideData[0];
		var ideKeys = ideData[1];

		var description = '';
		ideKeys.map( function( key ) {
			var subString = key.slice( 0, 1 ).toUpperCase() + key.slice( 1 );
			if ( description === '' ) {
				description += subString;
			} else {
				description += ' + ' + subString;
			}
		} );

		var keys = [];
		ideKeys.map( function( key ) {
			keys.push( hotkeys[key] );
		} );

		var value = [{
			'description': description,
			'keys': keys
		}];
		value = JSON.stringify( value );

		localStorage.setItem( ideName, value );
		editors.push( JSON.parse( localStorage.getItem( ideName ) ) );
		addSelectOption( ideName );
	}

	function addSelectOption(ideName) {
		var option = document.createElement( 'option' );
		option.innerHTML = ideName.slice( 0, 1 ).toUpperCase() + ideName.slice( 1 );
		option.setAttribute( 'value', ideName );
		html.select.appendChild( option );
	}



	/**
	 * @summary Фейковый объект для тестов
	 * @type {Object}
	 */
	return {
		app: app,
		html: app.htmlInit( 'ide-selection', 'quiz-box', 'result-box' ),
		editors: app.editorsInit( atom, sublime ),
		//quiz: new Quiz()
		quiz: Quiz
	};
};

// Запуск приложения
window.onload = playShortcats;
