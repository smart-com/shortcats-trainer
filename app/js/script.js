/**
 * @namespace playShortcuts
 * @summary Пространство имен для приложения
 * @listen window:onload
 * See {@tutorial readMe}
 * @return { Object } Пока что эта штука используется только для тестов...
 */
var playShortcuts = function() {

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
		'm': '77',
		'v': '86',
		's': '83',
		'openBracket': '219',
		'backSlash': '220',
		'closeBracket': '221',
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
		'description': 'Toggle tree view',
		'keys': {
			// TODO: words больше не нужны,
			'words': [ 'Ctrl', '\\' ],
			'codes': [ hotkeys.ctrl, hotkeys.backSlash ]
		}
	}, {
		'description': 'Fold',
		'keys': {
			'words': [ 'Alt', 'Ctrl', '[' ],
			'codes': [ hotkeys.alt, hotkeys.ctrl, hotkeys.openBracket ]
		}
	}, {
		'description': 'Unfold',
		'keys': {
			'words': [ 'Alt', 'Ctrl', ']' ],
			'codes': [ hotkeys.alt, hotkeys.ctrl, hotkeys.closeBracket ]
		}
	}, {
		'description': 'Toggle markdown preview',
		'keys': {
			'words': ['Ctrl', 'M'],
			'codes': [ hotkeys.ctrl, hotkeys.m ]
		}
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
		'description': 'Save',
		'keys': {
			'words': [ 'Ctrl', 'S' ],
			'codes': [ hotkeys.ctrl, hotkeys.s ]
		}
	},{
		'description': 'Toggle tree view (?)',
		'keys': {
			'words': [ 'Ctrl', '\\' ],
			'codes': [ hotkeys.ctrl, hotkeys.backSlash ]
		}
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
		 * @param  {String} editorForm_id  Идентификатор формы добавления редактора
		 * @return {Object}                Объект со свойствами, каждое из которых
		 *                                 отдельный HTML-элемент
		 */
		htmlInit: function( select_id, quizArea_id, resultArea_id, editorForm_id ) {

			return {
				/** @property {Object} select         Селект для выбора IDE */
				select: {
					element: document.getElementById( select_id ),
					// Добавляет в селект опцию
					addOption: function( ideName ) {
						var option = document.createElement( 'option' );
						option.innerHTML = ideName.slice( 0, 1 ).toUpperCase() + ideName.slice( 1 );
						option.setAttribute( 'value', ideName );
						this.element.appendChild( option );
					},
				},
				/** @property {Object} quizArea       Поле для вывода описания для шорткатов */
				quizArea: document.getElementById( quizArea_id ),
				/** @property {Object} resultArea     Поле для вывода результатов тестирования */
				resultArea: document.getElementById( resultArea_id ),
				/** @property {Object} editorForm_id  Форма добавления редактора */
				editorForm: document.getElementById( editorForm_id ),
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

		clearQuiz: function() {
			// Игра продолжается
			yes = true;
			app.counter = 0;
			this.userInput = [];
			this.matchedKeys = 0;
			html.quizArea.innerHTML = "";
		}
	};

	/**
	 * @class  Quiz
	 * @classdesc Создает объект проверки и заполняет его свойствами
	 * @type     {Function}
	 * @property {Boolean}   gameStatus            Состояние игры
	 * @property {Object}    currentIde            Текущая IDE
	 * @property {String}    randomShortcut        Проверяемый шорткат,
	 *                                             преобразованный в строку
	 * @property {String}    userInput             Клавиша, нажатая пользователем
	 * @property {Number}    matchedKeys           Количество правильно нажатых клавиш
	 * @property {Number}    totalResult           Все ответы по выбранной IDE
	 * @property {Number}    currentResult         Только правильные ответы
	 * @property {Method}    setCurrentIde         Устанавливает текущую IDE
	 * @property {Method}    setRandomShortkat     Устанавливает случайный шорткат
	 * @property {Method}    showQuestion          Выводим описание случайного шортката в HTML
	 * @property {Method}    showPressedKey        Вставляет в output.quiz-area нажатые клавиши
	 * @property {Method}    showWin               Выводит в HTML положительный результат проверки
	 *                                             и изменяет значения счетчиков
	 * @property {Method}    showLoose             Выводит в HTML отрицательный результат
	 *                                             и изменяет значение общего счетчика проверок
	 * @property {Method}    showTotal             После нажатия Enter выводим результат проверок
	 *                                             по текущей IDE
	 * @property {Method}    checkShortcut         Проверяет шорткат, введенный пользователем
	 * @return   {Object} Проверяет текущий шорткат
	 */
	var Quiz = function() {
		this.gameStatus = true;
		this.currentIde = [];
		this.randomShortcut = {};
		this.userInput = '';
		this.matchedKeys = 0;
		this.totalResult = 0;
		this.currentResult = 0;

		this.setCurrentIde = function() {
			// Отнимаем единичку, чтобы не выходить за пределы массива с IDE
			this.currentIde = editors[ html.select.element.selectedIndex - 1 ];
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
			this.randomShortcut = {
				'description': this.currentIde[ randomIndex ].description,
				/**
				 * Понадобится отдельный массив,
				 * чтобы можно было "вычеркивать" из него нажатые клавиши
				 */
				'keys': this.currentIde[ randomIndex ].keys.codes.slice(),
				/**
				 * Количество клавиш в шорткате. Нужно сразу сохранить это число, пока
				 * мы еще не начали "вычеркивать" клавиши при проверке
				 */
				'amountOfKeys': this.currentIde[ randomIndex ].keys.codes.length,
			};

			//return randomIndex;
		};

		/**
		 * @param {Object} htmlOutput  Поле для вывода описания шортката
		 * @todo  Извлечь метод и перенести его в html или в app?..
		 */
		this.showQuestion = function( htmlOutput ) {
			var question = document.createElement( 'span' );
			question.innerHTML = this.randomShortcut.description;
			question.className = 'descr';
			htmlOutput.appendChild( question );
		};

		/**
		 * @param  {Object} event Событие нажатия клавиши
		 * @todo Хоть эта функция и лучше, чем была, но она мне все равно не нравится
		 *       Она какая-то кривая, много всего проверяет и под тесты не ложится...
		 */
		this.checkShortcut = function( event ) {
			// Еще одна проверка
			app.counter++;
			// Запоминаем нажатую клавишу
			this.userInput = event.keyCode;

			// Запоминаем массив из кодов клавиш случайного шортката
			var randomShortcut = this.randomShortcut;

			// Предполагаем, что проверка не прошла
			var checkResult = false;

			// Показываем, какая клавиша была нажата
			this.showPressedKey( html.quizArea );

			// Проверяем, есть ли в шорткате нажатая клавиша
			for ( var i = 0; i < randomShortcut.keys.length; i++ ) {
				// Если есть...
				if ( +randomShortcut.keys[i] === this.userInput ) {
					// ... "вычеркиваем" ее из шортката
					randomShortcut.keys.splice( i, 1 );
					// Отмечаем, что совпадение было
					this.matchedKeys++;
					checkResult = true;
					// Подсвечиваем клавишу зеленым
					html.quizArea.querySelectorAll( '.key' )[app.counter - 1].classList.add( 'success' );
					break;
				}
			}

			// Если клавиша нажата неправильная...
			if ( !checkResult )
				// ... подсвечиваем клавишу красным
				html.quizArea.querySelectorAll( '.key' )[app.counter - 1].classList.add( 'error' );

			// Если было нажато столько же клавиш, сколько есть в проверяемом шорткате ...
			if( app.counter === this.randomShortcut.amountOfKeys ) {
				// ...и если все клавиши совпали...
				if ( this.matchedKeys === this.randomShortcut.amountOfKeys ) {
					// ...показываем сообщение об успехе
					this.showWin( checkResult );
				} else {
					// ...иначе показываем сообщение о неудаче
					this.showLoose();
				}

				// Очищаем результаты перед проверкой следующего шортката
				app.clearQuiz.call( this );
				// Устанавливаем следующий случайный шорткат
				quiz.setRandomShortkat();
				// Выводим его описание в HTML
				quiz.showQuestion( html.quizArea );
			}
		},

		// Вставляет в output.quiz-area нажатые клавиши
		this.showPressedKey = function( htmlOutput ) {
			var pressedKey = document.createElement( 'span' );

			// Проверяем, есть ли в объекте hotkeys нажатая клавиша
			var word = '';
			for (var keyName in hotkeys) {
				if (+hotkeys[keyName] === event.keyCode) {
					word = keyName[0].toUpperCase() + keyName.slice(1);
					break;
				}
			}

			pressedKey.innerHTML = word || 'No such key in the list';
			pressedKey.className = 'key';
			htmlOutput.appendChild( pressedKey );
		};

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
			html.resultArea.value = 'You lose!!! Your results : ' +
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

	/**
	 * @summary Управляет формой добавления редактора
	 * @name                 editorFormManager
	 * @type     {Object}
	 * @dunno    {dunno}     onClick
	 * @dunno    {dunno}     onFocus
	 * @dunno    {dunno}     addKeyInput           Cоздает новый инпут для ввода клавиши
	 *                                             и добавляет его в div.group
	 * @dunno    {Function}  removeKeyInput        Удаляет крайний правый инпут в div.group
	 * @dunno    {Function}  addGroup              Создает новую группу инпутов
	 *                                             и вставляет в div.groups
	 * @dunno    {Function}  removeGroup           Удаляет указанную групу в div.groups
	 * @dunno    {Function}  addDescrInput         Создает инпут для ввода описания шортката
	 * @dunno    {Function}  addBtn                Создает новую кнопку и добавляет в div.group
	 * @dunno    {Function}  highlightEmptyInputs  Подсвечивает незаполненные поля
	 * @dunno    {Function}  resetInputs           Сбрасывает значения всех инпутов
	 * @dunno    {Function}  checkInputs           Проверяет заполненность полей
	 * @dunno    {Function}  addEditor             Cоздает новый редактор, кладет в хранилище
	 *                                             и добавляет в игру
	 * @dunno    {Function}  pickData              Cобирает значения полей и возвращает объект
	 *                                             с данными для добавляемого редактора
	 * @dunno    {Function}  proccessKeys          Принимает массив из клавиш, обрабатывает
	 *                                             и возвращает объект с названиями клавиш и их кодами
	 * @property {Method}    fillDatalist          Заполняет datalist опциями
	 * @dunno    {Function}  addDatalistOption     Добавляет в datalist опцию
	 * @dunno    {Function}  showMessage           Выводит сообщение в output.form-feedback
	 * @property {Method}    startTrackingActions  Запускает отслеживание событий формы
	 */
	var editorFormManager = function() {

		// Обработчики формы

		function onClick( event ) {
			var target = event.target;

			// Если кликнули по кнопке '+' - добавить поле ввода клавиши в соответствующую группу
			if ( target.classList.contains( 'add-key' ) )
				// полифилл пока подключен в head
				addKeyInput( target.closest( '.group' ) );
			// Если кликнули по кнопке '-' - удалить поле ввода клавиши в соответствующей группе
			if ( target.classList.contains( 'remove-key' ) )
				removeKeyInput( target.closest( '.group' ) );

			// Если кликнули по кнопке 'Add shortcut' - добавить группу с инпутами
			if ( target.classList.contains( 'add-shortcut' ) )
				addGroup();
			// Если кликнули по кнопке '×' - удалить соответствующую группу с инпутами
			if ( target.classList.contains( 'remove-group' ) )
				removeGroup( target.closest( '.group' ) );

			// Если кликнули по кнопке 'Add editor'...
			if ( target.classList.contains( 'add-editor' ) ) {
				// ...если все поля заполнены - сохранить редактор в хранилище и добавить в игру...
				if ( checkInputs() ) addEditor();
				// ...иначе подсветить незаполненные поля
				else highlightEmptyInputs();
			}
		}

		// Убирает подсветку незаполненного инпута
		function onFocus( event ) {
			if ( event.target.classList.contains( 'empty' ) )
				event.target.classList.remove( 'empty' );
		}



		// Все, что связано с HTML формы

		// Создает новый инпут для ввода клавиши и добавляет его в div.group
		function addKeyInput( group ) {
			var newInput = document.createElement( 'input' );
			newInput.className = 'key-input';

			var allInputs = group.getElementsByClassName( 'key-input' );
			var newInputNumber = allInputs.length + 1;

			newInput.setAttribute( 'name', 'key-' + newInputNumber );
			newInput.setAttribute( 'type', 'text' );
			newInput.setAttribute( 'list', 'key-list' );
			newInput.setAttribute( 'placeholder', 'Key' );

			// Получаем последний инпут для клавиши в группе
			var lastInput = allInputs[allInputs.length - 1];
			/*
			 * Если в группе есть хотя бы 1 инпут для клавиши, вставляем новый после него.
			 * Полифилл пока подключен в head
			 */
			if ( lastInput ) lastInput.after( newInput );
			/**
			 * Если в группе нет ни 1-о инпута,
			 * (например, при создании группы инпутов)
			 * просто добавляем его в конец родительского контейнера
			 */
			else group.appendChild( newInput );

			// Если это 4-й по счету инпут, блокируем кнопку .add-key
			var addKeyBtn = group.querySelector( '.add-key' );
			if ( newInputNumber === 4 ) addKeyBtn.disabled = true;
			// Если кнопка .remove-key есть и она заблокирована - разблокировать
			var removeKeyBtn = group.querySelector( '.remove-key' );
			if ( removeKeyBtn && removeKeyBtn.disabled === true ) removeKeyBtn.disabled = false;
		}

		// Удаляет крайний правый инпут в div.group
		function removeKeyInput( group ) {
			var allInputs = group.getElementsByClassName( 'key-input' );
			var addKeyBtn = group.querySelector( '.add-key' );
			var removeKeyBtn = group.querySelector( '.remove-key' );

			/*
			 * Если в группе 3 и > инпутов, удалить последний
			 * и разблокировать кнопку .add-key, если она заблокирована.
			 * Если в группе 2 инпута - удалить последний и заблокировать кнопку .remove-key.
			 * Иначе ничего не делать
			 */
			if ( allInputs.length > 2 ) {
				group.removeChild( allInputs[allInputs.length - 1] );
				if ( addKeyBtn.disabled === true ) addKeyBtn.disabled = false;
			} else if ( allInputs.length == 2 ) {
				group.removeChild( allInputs[allInputs.length - 1] );
				removeKeyBtn.disabled = true;
			}
		}

		// Создает новую группу инпутов и вставляет в div.groups
		function addGroup() {
			var newGroup = document.createElement( 'div' );
			newGroup.className = "group";

			// Наполняем группу инпутами и кнопками
			addDescrInput( newGroup );
			addKeyInput( newGroup );
			addKeyInput( newGroup );
			addBtn( newGroup, 'btn remove-key', 'Remove key' );
			addBtn( newGroup, 'btn add-key', 'Add key' );
			addBtn( newGroup, 'btn remove-group', 'Remove shortcut' );

			// Вставляем группу в div.groups
			var groupsContainer = html.editorForm.querySelector( '.groups' );
			groupsContainer.appendChild( newGroup );

			// Если в 1-й группе кнопка .remove-group заблокирована - разблокировать
			var groups = groupsContainer.children;
			var removeGroupBtn = groups[0].querySelector( '.remove-group' );
			if ( removeGroupBtn.disabled === true ) removeGroupBtn.disabled = false;
		}

		// Удаляет указанную групу в div.groups
		function removeGroup( group ) {
			/*
			 * Если в div.groups 3 и > групп, просто удалить переданную группу.
			 * Если в div.groups 2 группы, удалить переданную
			 * и заблокировать кнопку .remove-group в последней оставшейся.
			 * Иначе ничего не делать
			 */
			var groupsContainer = html.editorForm.querySelector( '.groups' );
			if ( group.parentNode.children.length > 2 ) {
				groupsContainer.removeChild( group );
			} else if ( group.parentNode.children.length === 2 ) {
				groupsContainer.removeChild( group );
				groupsContainer.children[0].querySelector( '.remove-group' ).disabled = true;
			}
		}

		// Создает поле ввода описания шортката
		function addDescrInput( group ) {
			var descrInput = document.createElement( 'input' );
			descrInput.className = "descr-input";

			// Определяем номер инпута, чтобы указать его в аттрибуте name
			var descrInputNumber = html.editorForm.querySelectorAll( '.group' ).length + 1;
			descrInput.setAttribute( 'name', 'shortcut-descr-' + descrInputNumber );

			descrInput.setAttribute( 'type', 'text' );
			descrInput.setAttribute( 'placeholder', 'Description' );

			group.appendChild( descrInput );
		}

		// Создает новую кнопку и добавляет в div.group
		function addBtn( group, btnClass, text ) {
			var newBtn = document.createElement( 'button' );
			newBtn.className = btnClass;
			newBtn.setAttribute( 'type', 'button' );
			newBtn.innerHTML = text;
			group.appendChild( newBtn );
		}

		// Подсвечивает незаполненные поля
		function highlightEmptyInputs() {
			var allInputs = html.editorForm.getElementsByTagName( "INPUT" );
			// Получаем все незаполненные поля
			var emptyInputs = Array.prototype.filter.call( allInputs, function( input ) {
				if ( !input.value ) return true;
			});
			// Добавляем незаполненным полям класс "empty"
			Array.prototype.forEach.call( emptyInputs, function( emptyInput ) {
				emptyInput.classList.add( "empty" );
			});
			showMessage( 'Please fill in all fields.' );
		}

		// Сбрасывает значения всех инпутов
		function resetInputs() {
			var allInputs = html.editorForm.getElementsByTagName( 'INPUT' );
			Array.prototype.forEach.call( allInputs, function( input ) {
				input.value = "";
			});
		}



		// Все, что связано с добавлением редактора

		// Проверяет заполненность полей
		function checkInputs() {
			var allInputs = html.editorForm.getElementsByTagName( 'INPUT' );
			/*
			 * checkResult присвоится true, если заполненно каждое поле,
			 * или false, если хотя бы одно не заполнено
			 */
			var checkResult = Array.prototype.every.call( allInputs, function( input ) {
				if ( input.value ) return true;
			});
			return checkResult;
		}

		// Создает новый редактор, кладет в хранилище и добавляет в игру
		function addEditor() {
			// Получаем значения полей
			var data = pickData();

			// Получаем название редактора
			var editorName = data.editorName;

			// Получаем список шорткатов
			var shortcuts = data.shortcuts;

			/*
			 * Проверяем: может, в хранилище уже есть такой редактор?
			 * Если есть - добавим/заменим шорткаты в имеющемся,
			 * если нет - добавим новый
			 */
			if ( localStorage[editorName] ) {
				// Добавляем или заменяем шорткаты в редакторе
				storedEditorsManager.update( editorName, shortcuts );
				showMessage( 'Editor "' + editorName[0].toUpperCase() + editorName.slice(1) + '" has been updated' );
			} else {
				// Добавляем редактор в хранилище и игру
				storedEditorsManager.store( editorName, shortcuts );
				showMessage( 'Editor "' + editorName[0].toUpperCase() + editorName.slice(1) + '" has been added to the quiz' );
			}

			// Сбрасываем значения всех полей
			resetInputs();
		}

		// Собирает значения полей и возвращает объект с данными формы
		function pickData() {
			var editorName = html.editorForm.querySelector( '[name="editor-name"]' ).value.toLowerCase();

			// Собираем шорткаты
			var shortcuts = [];
			var groups = html.editorForm.querySelectorAll( '.group' );
			Array.prototype.forEach.call( groups, function( group ) {
				// Получаем описание шортката
				var description = group.querySelector( '.descr-input' ).value;

				// Получаем поля ввода для клавиш в текущей группе
				var keyInputs = group.getElementsByClassName( 'key-input' );
				// Собираем клавиши в массив (получается ['ctrl', 'c'])
				var keys = [];
				Array.prototype.forEach.call( keyInputs, function( input ) {
					keys.push( input.value.toLowerCase() );
				});
				// Обрабатываем массив с клавишами, чтобы это был объект с названиями и кодами
				keys = proccessKeys( keys );

				/*
				 * Кладем шорткат в список шорткатов.
				 * Получается { 'description': 'Copy', 'keys': { 'words': ['ctrl', 'c'], 'codes': ['17', '67'] }  }
				 */
				var shortcut = {
					'description': description,
					'keys': keys
				};
				shortcuts.push( shortcut );
			});

			/*
			 * Кладем название редактора и список шорткатов в объект и возвращаем.
			 * Вернется { editorName: 'brackets', shortcuts: [ { 'description': 'Copy', 'keys': ['ctrl', 'c'] }, {...} ] }
			 */
			var data = {
				'editorName': editorName,
				'shortcuts': shortcuts
			};
			return data;
		}

		/*
		 * Принимает массив из клавиш, обрабатывает и возвращает объект с названиями клавиш и их кодами
		 * вроде { 'words': ['ctrl', 'c'], 'codes': ['17', '67'] }
		 */
		function proccessKeys( keys ) {
			var oldKeys = keys;
			keys = {};

			keys.words = oldKeys;

			keys.codes = oldKeys.map( function( key ) {
				return hotkeys[key];
			});

			return keys;
		}



		// Остальное

		// Заполняет datalist опциями
		function fillDatalist() {
			var datalist = document.getElementById( 'key-list' );

			// Если в datalist уже есть опции - уберем
			if ( datalist.innerHTML ) datalist.innerHTML = '';

			// Добавляем в datalist столько опций, сколько в объекте hotkeys клавиш
			for ( var key in hotkeys ) {
				addDatalistOption( key, datalist );
			}
		}

		// Добавляет в datalist опцию
		function addDatalistOption( key, datalist ) {
			var option = document.createElement( 'option' );
			option.innerHTML = key.slice( 0, 1 ).toUpperCase() + key.slice( 1 );
			datalist.appendChild( option );
		}

		// Выводит сообщение в output.form-feedback
		function showMessage( message ) {
			var formFeedback = document.getElementById( 'form-feedback' );
			formFeedback.innerHTML = message;
		}



		return {
			fillDatalist: fillDatalist,
			startTrackingActions: function() {
				html.editorForm.onclick = onClick;
				html.editorForm.addEventListener( 'focus', onFocus, true );
			},
		};
	}();

	/**
	 * @summary  Управляет добавлением редакторов в хранилище и
	 *					 добавлением редакторов из хранилища в игру
	 * @name              storedEditorsManager
	 * @type     {Object}
	 * @dunno    {Array}  editorsNames Список с названиями редакторов в хранилище
	 * @property {Method} applyAll     Добавляет в игру редакторы из хранилища
	 * @property {Method} store        Добавляет редактор в хранилище и игру
	 * @property {Method} update       Обновляет редактор в хранилище и игре
	 */
	var storedEditorsManager = function() {
		// Создаем список названий редакторов, лежащих в хранилище (['brackets', 'qwerty'])
		var editorsNames = Object.keys( localStorage );

		// Добавляет в игру редакторы, лежащие в хранилище
		function applyAll() {
			// перебираем названия редакторов в хранилище
			editorsNames.forEach( function( editorName ) {
				/**
				 * Достаем из хранилища по ключу editorName строку с шорткатами редактора.
				 * Преобразуем ее в массив и добавляем в игру
				 */
				editors.push( JSON.parse( localStorage[editorName] ) );
				// Добавляем в селект опцию с названием редактора
				html.select.addOption( editorName );
			});
		}

		// Добавляет редактор в хранилище и игру
		function store( editorName, shortcuts ) {
			// Сохраняем шорткаты в хранилище под ключом - названием редактора
			localStorage.setItem( editorName, JSON.stringify( shortcuts ) );

			// Добавляем шорткаты в игру
			editors.push( shortcuts );
			// Добавляем в селект опцию с названием редактора
			html.select.addOption( editorName );
		}

		/*
		 * Обновляет редактор в хранилище и в игре:
		 * добавляет новые шорткаты и/или заменяет имеющиеся
		 */
		function update ( editorName, newShortcuts ) {
			// Запоминаем текущие шорткаты редактора
			var storedShortcuts = JSON.parse( localStorage[editorName] );
			// Создаем список описаний текущих шорткатов редактора (['Save', 'Copy', 'Paste'])
			var descriptions = storedShortcuts.slice().map( function( shortcut ) {
				return shortcut.description.toLowerCase();
			});

			// Обновляем storedShortcuts...
			newShortcuts.forEach( function( newShortcut ) {
				// ...проверяем, есть ли такой шорткат в хранилище. Если есть - заменяем новым...
				var matchedShortcutIndex = descriptions.indexOf( newShortcut.description.toLowerCase() );
				if ( matchedShortcutIndex > -1 )
					storedShortcuts[matchedShortcutIndex] = newShortcut;
				// ...если нет - добавляем
				else storedShortcuts.push( newShortcut );
			});

			// Кладем в хранилище обновленный список шорткатов под ключом - названием редактора
			localStorage[editorName] = JSON.stringify( storedShortcuts );

			// // Обновляем список названий редакторов, лежащих в хранилище
			// editorsNames = Object.keys( localStorage );

			// Обновляем шорткаты в игре
			editors = [atom, sublime];
			editorsNames.forEach( function( editorName ) {
				editors.push( JSON.parse( localStorage[editorName] ) );
			});
		}

		return {
			applyAll: applyAll,
			store: store,
			update: update
		};
	}();

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
	var html = app.htmlInit( 'ide-selection', 'quiz-box', 'result-box', 'editor-form' );

	/**
	 * @summary Запускаем первую проверку вручную,
	 *          так как событие нажатия на клавиатуру еще не произошло
	 * @type {Quiz}
	 */
	var quiz = app.quizInit();

	// Добавляем в игру редакторы из хранилища
	storedEditorsManager.applyAll();
	// Заполняем datalist опцими
	editorFormManager.fillDatalist();
	// Запускаем отслеживание событий формы
	editorFormManager.startTrackingActions();

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
			quiz.checkShortcut( event );
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
	// window.document.addEventListener( 'keydown', forbidRepetition );
	window.document.addEventListener( 'keydown', onKeydown );
	function onKeydown( event ) {
		/**
		 * Отменяем действия по умолчанию после нажатия определенный клавиш
		 * (или средство от ухода фокуса после нажатия на Alt
		 * и от вызова окна "Сохранить как").
		 * Но сначала убедимся, что клавишу нажимают не над каким-нибудь полем
		 * формы добавления редактора (потому что отмена действия по умолчанию
		 * в этом случае приведет к тому, что ничего нельзя будет ввести в это поле)
		 */
		if ( !event.target.closest( '.editor-form' ) )
			event.preventDefault();

		/**
		 * Если нажали что-то на панели добавления редактора - ничего не делать.
		 * Полифилл пока подключен в head
		 */
		if ( html.editorForm.contains( event.target ) ) return;
		else forbidRepetition( event );
	}

	// Реализация выхода из игры
	// window.document.addEventListener( 'keydown', forbidRepetition );

	// Смена текущей IDE
	html.select.element.addEventListener( 'change', function( event ) {
		app.clearQuiz.call(Quiz);
		quiz = app.quizInit();
		runTests();
	});

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
window.onload = playShortcuts;
