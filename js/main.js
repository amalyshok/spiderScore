let Data;

let stats = {
	common: [],
	home: [],
	guest: [],
	now: []
}

let descript = {
	0 : 'Матчи',
	1 : 'Победы',
	2 : 'Ничьи',
	3 : 'Проигрыши',
	4 : 'Забитo',
	5 : 'Пропущено',
	6 : 'Очки',
	7 : 'Желтые карточки',
	8 : 'Kрасные карточки'
}

function ajaxStart(){
  $('#progress').show();
}
// загрузку выкл
function ajaxStop(){
  $('#progress').hide();
  $('#starter').hide();
  $('#testButton').show();
}
// запуск парсера
function parserGo(){
  ajaxStart();
  var b = $.ajax('https://www.sports.ru/stat/football/russia/'); 
    b.done(function (d) {
	//	Data = d;
	analysisSite(d);
	checkScores();
  });
  b.fail(function (e, g, f) {
    alert('Epic Fail');
    ajaxStop();
  })
}
// функция обработки полученного результата
function analysisSite(data){  
	console.log(typeof data);
    ajaxStop();
	let result = data.slice(data.match(/Следующие/i).index+13, data.match(/Тренды/i).index);
	Data = result;
	$('#temp').html(result);
	$('#temp').hide();
}
// срабатывает при запуске расширения
$(function(){
  $('#progress').hide();
  $('#testButton').hide();
  $('#starter').click(parserGo);
  $('#testButton').click(testFunction);
});
// обработчик тестовой кнопки
function testFunction() {
	console.log('im working');
	//checkScores();
}

class Teams {
	constructor (name) {
		this.name = name;
		this.length = 0;
}
	// свойства класса
}

function checkScores() {
	let locarr = [0, 'common', 'home', 'guest', 'now'];
	let tables = document.querySelectorAll('tbody');
	for (let i = 1; i <= 4; i++) {
		let tr = tables[i].querySelectorAll('tr');
			for (let j = 1; j <= 16; j++) {
				let td = tr[j].querySelectorAll('td');
				stats[locarr[i]].push(new Teams(td[1].querySelector('a').textContent));
				let num = stats[locarr[i]].length - 1;
				for (let g = 2; g <= 8; g++) {
					stats[locarr[i]][num][stats[locarr[i]][num].length] = td[g].innerHTML;
					stats[locarr[i]][num].length++;
				}
			}
	}
}

// выводит в консоль всю статистику по имени команды и таблице common, home, guest, now
function showStats(name, loc = 'common') {
	name = name.toLowerCase();
	if (name == 'ЦСКА') name = name.toUpperCase(); else name = name[0].toUpperCase() + name.slice(1)
	// заебался учитывать регистр. теперь имя не учитывает регистр 
	if (checkIndex(name, loc) != -1) {
		let team = stats[loc][checkIndex(name, loc)];
		for (let i = 0; i < team.length; i++) {
		console.log(`${descript[i]} : ${team[i]} ;`); // перебор значений. сюда пихать их обработчик
		}
	} else 
		console.log('Команды с данным именем не найдено');
}

// поиск индекса массива в таблице common, home, guest, now по названию команды
function checkIndex (name, loc = 'common') {
	for (let i = 0; i <= 15; i++) {
		if (stats[loc][i].name == name) return i;
	}
	return -1;
}












































/*
(function($){
function ajaxStart(){
  $('#progress').show();
}
function ajaxStop(){
  $('#progress').hide();
}
function parserGo(){
  ajaxStart();
  var b = $.ajax('https://www.myscore.ru/football/russia/premier-league/standings/#live');
  b.done(function (d) {
    analysisSite(d);
    ajaxStop();
  });
  b.fail(function (e, g, f) {
    alert('Epic Fail');
    ajaxStop();
  })
}
function analysisSite(data){
  var res = '';
  $(data).find('a').each(function(){
    res+=$(this).text()+'=>'+$(this).attr('href')+'';
  })
  $('#resultbox').html(res);
}
$(function(){
  $('#progress').hide();
  $('#starter').click(parserGo);
});
})(jQuery);

*/