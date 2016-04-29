/**
 * @todo Сейчас тесты запускаются только при загрузке страницы
 *       и на изменение в селекте.
 *       Причем написаны они только для первоначального запуска
 *       на загрузке страницы.
 *       Поскольку запуск на select.onchange :) я реализовала
 *       почти в самом конце, то исправлять сейчас уже не буду.
 *       Потом. Вместе с Кармой, возможно.
 *       Война с перфекционизмом: 1:0 в мою пользу :)
 */

describe( 'Тестируем Приложение...', function() {

	var testApp = playShortcats();

	it( 'Приложение определено.', function() {
		assert.isDefined( testApp, 'Приложение в отпуске' );
	});

	it( 'Это - объект...', function() {
		assert.isObject( testApp, 'Приложение не объект, а черт знает что :)' );
	});

	it( '...и он - не NULL...', function() {
		assert.isNotNull( testApp, 'У приложения низкая самооценка' );
	});

	describe( 'Тестируем IDE...', function() {

		it( 'Общий массив с IDE есть...', function() {
			assert.isArray( testApp.editors, 'Массивы украдены инопланетянами o_0' );
		});

		it( 'Массивы с отдельной IDE внутри общего тоже есть...', function() {
			assert.isArray( testApp.editors[ 0 ],
								 'Внутренние массивы украдены инопланетянами o_0' );
		});

		it( 'Внутри внутренних массивов есть внутренние объекты с шорткатами...', function() {
			assert.isObject( testApp.editors[ 0 ][ 0 ], 'Шорткаты спрятались' );
		});

		it( 'У внутренних объектов с шорткатами таки есть свойство description', function() {
			assert.property( testApp.editors[ 0 ][ 0 ], 'description');
		});

		it( '...со строковым описанием для шортката.', function() {
			assert.isString(testApp.editors[ 0 ][ 0 ].description, 'Есть контакт!');
		});

		it( '... и keys. Это для сканкодов.', function() {
			assert.property( testApp.editors[ 0 ][ 0 ], 'keys');
		});

		it( 'Оно тоже массив,..', function() {
			assert.isArray( testApp.editors[ 0 ][ 0 ].keys, 'кАк не массив o_0' );
		});

		it( 'каждый элемент которого - это цифра-код клавиши в строковом формате', function() {
			assert.isString(testApp.editors[ 0 ][ 0 ].keys[ 1 ], 'Есть контакт!');
		});
	});

	describe( 'Хоть это и полная ерунда, но все-таки хоть как-то протестируем app...', function() {

		describe( 'Quiz - это конструктор.', function() {

			//var testQuiz = testApp.quiz;
			var testQuiz = new testApp.quiz();

			it('Так получилось, что он создает сложные объекты при запуске приложения и при смене IDE в селекте...', function() {
				assert.instanceOf( testQuiz, testApp.quiz, 'quiz не экземпляр Quiz');
			});

			describe( '...с кучей свойств, которые действительны для текущей IDE', function() {

				it( 'Свойство gameStatus отвечает за состояние игры.', function() {
					assert.property( testQuiz, 'gameStatus');
				});

				it( '... оно true пока игра продолжается.', function() {
					assert.isTrue( testQuiz.gameStatus, 'Игра продолжается!');
				});

				it( '... или false, если пользователь нажмет Enter.', function() {
					assert.isFalse( testQuiz.gameStatus,
						'И совсем это не error ни разу :) \n\tЯ здесь потом допишу чего-нить умное с Селениумом, к примеру...');
				});

				it( 'В свойство currentIde запоминается IDE, которая в данный момент выбрана в селекте...', function() {
					assert.property( testQuiz, 'currentIde');
				});

				it( 'randomShortcat, соответственно, для шортката, который проверяется прямо сейчас', function() {
					assert.property( testQuiz, 'randomShortcat');
				});

				it( 'currentResult запоминает количество верных ответов...', function() {
					assert.property( testQuiz, 'currentResult');
				});

				it( '...и totalResult - количество ответов вообще.', function() {
					assert.property( testQuiz, 'totalResult');
				});
			});

			describe( 'Теперь методы...', function() {

				describe( 'setCurrentIde...', function() {

					it( 'setCurrentIde проверяет селект и запоминает в свойство выбранную там IDE', function() {
						assert.isFunction( testQuiz.setCurrentIde, 'чет не получилось :(');
					});

				});

				describe( 'setRandomShortkat...', function() {

					it( 'setRandomShortkat ищет случайный шорткат, достает из editors и устанавливает его в соответствующее свойство.', function() {
						assert.isFunction( testQuiz.setRandomShortkat, 'чет не получилось :(' );
					});

					it( 'Таким образом получается, что в randomShortcat всегда установлено что-нибудь из currentIde', function() {
						testQuiz.setCurrentIde();
						testQuiz.setRandomShortkat();
						assert.include( testQuiz.currentIde, testQuiz.randomShortcat, '...а вот здесь засада :(' );
					});

					it( 'Таким образом получается, что в randomShortcat всегда установлено что-нибудь из currentIde', function() {
						testQuiz.setCurrentIde();
						testQuiz.setRandomShortkat();
						assert.include( testQuiz.currentIde, testQuiz.randomShortcat, '...а вот здесь засада :(' );
					});

					it( 'Таким образом получается, что в randomShortcat всегда установлено что-нибудь из currentIde', function() {
						testQuiz.setCurrentIde();
						testQuiz.setRandomShortkat();
						assert.include( testQuiz.currentIde, testQuiz.randomShortcat, '...а вот здесь засада :(' );
					});
				});

				describe( 'showQuestion...', function() {

					it( 'showQuestion выводит описание случайного шортката в HTML', function() {
						assert.isFunction( testQuiz.showQuestion, 'Все сломалось :(');
					});

					it( 'Это значит, что описание выбранного шортката всегда строго равно содержимому quizArea', function() {

						var elem = document.getElementById('quiz-box');
						testQuiz.setCurrentIde();
						testQuiz.setRandomShortkat();
						testQuiz.showQuestion( elem );
						assert.strictEqual( testQuiz.randomShortcat.description, elem.value, 'Таки добралась, блин...');

						testQuiz.setCurrentIde();
						testQuiz.setRandomShortkat();
						testQuiz.showQuestion( elem );
						assert.strictEqual( testQuiz.randomShortcat.description, elem.value, 'Таки добралась, блин...');

						testQuiz.setCurrentIde();
						testQuiz.setRandomShortkat();
						testQuiz.showQuestion( elem );
						assert.strictEqual( testQuiz.randomShortcat.description, elem.value, 'Таки добралась, блин...');

					});
				});

				describe( 'clearQuiz - здесь все просто ...', function() {

					it( 'После окончания проверки текущего шортката...', function() {
						assert.isFunction( testQuiz.clearQuiz, 'Никогда не выполнится' );
					});

					it( '...нужно вернуть дефолтные значения нескольким переменным для проверки следующего', function() {
						testQuiz.clearQuiz();

						assert.isTrue( yes, 'дефолт - нажата верная клавиша');
						assert.strictEqual( testApp.app.counter, 0, 'Счетчик нажатых клавиш, вроде бы...');
						assert.strictEqual( testQuiz.userInput, '', 'Строчка для запоминания нажатых пользователем клавиш');
					});
				});

				describe( 'checkShortcаt - с богом...', function() {

					it( 'testQuiz.checkShortcat - функция, а нижний тест все врет!!!...', function() {
						assert.isFunction( testQuiz.checkShortcat, 'Никогда не выполнится' );
					});

					it( 'При ее запуске, инкрементируем счетчик ответов', function() {
						/* Чет я никак не могу въехать в логику этот increases, но все-таки я его как-то поломала... */
						var evt = {};
						evt.keyCode = 17;

						assert.increases( function() { testQuiz.checkShortcat(evt); }, testApp.app, 'counter' );
					});

					it( 'Потихоньку пробираемся дальше... user.input по идее должен быть строкой...', function() {
						assert.isString( testQuiz.userInput, '...молчание - золото...');
					});

					it( '...и он должен быть равен фейковой 17. Не строго. Я не помню точно, что туда присваивается...', function() {
						assert.equal( testQuiz.userInput, '17', '...все здорово, если этой фразы не видно :)');
					});
				});
			});
		});
	});
});
