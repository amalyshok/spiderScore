let Data;

let stats = {
    common: [],
    home: [],
    guest: [],
    now: []
}

let descript = {
    0: 'Матчи',
    1: 'Победы',
    2: 'Ничьи',
    3: 'Проигрыши',
    4: 'Забитo',
    5: 'Пропущено',
    6: 'Очки',
    7: 'Желтые карточки',
    8: 'Kрасные карточки'
}

function ajaxStart() {
    $('#progress').show();
}
// загрузку выкл
function ajaxStop() {
    $('#progress').hide();
    $('#starter').hide();
    $('#testButton').show();
}
// запуск парсера
function parserGo() {
    // цепочка промисов 
    var promise = new Promise(function(resolve, reject) {
        var b1 = $.ajax('https://www.sports.ru/stat/football/russia/');
        resolve(b1);
    });
    var promise2 = new Promise(function(resolve, reject) {
        var b2 = $.ajax('https://www.sports.ru/rfpl/fouls/?s=yellow_cards');
        resolve(b2);
    });
    var promise3 = new Promise(function(resolve, reject) {
        var b3 = $.ajax('https://www.sports.ru/rfpl/fouls/?p=2&s=yellow_cards&d=1&season=6886');
        resolve(b3);
    });

    ajaxStart();
    promise.then(d => {
            analysScores(d);
            checkScores();
            return promise2;
        },
        error => alert('Ошибка загрузки')).then(d => {
        analysCards(d);
        checkCards();
        return promise3;
    }, error => alert('Ошибка загрузки')).then(d => {
        analysCards(d);
        checkCards();
        ajaxStop();
    });
}

// функция обработки полученного результата
function analysScores(data) {
    let result = data.slice(data.match(/Следующие/i).index + 13, data.match(/Тренды/i).index);
    Data = result;
    $('#temp').html(result);
    $('#temp').hide();
}

function analysCards(data) {
    let result = data.slice(data.match(/следующие/i).index + 12, data.match(/Тренды/i).index);
    Data = result;
    $('#temp').html(Data);
    $('#temp').hide();
    //$('#resultbox').html(Data);
}

// срабатывает при запуске расширения
$(function() {
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
    constructor(name) {
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


function checkCards() {
    let table = document.body.querySelector('tbody');
    let team = stats.common;
    /*table.rows[0].cells[2].querySelector('a').text; // команда
    table.rows[0].cells[4].textContent; // ЖК
    table.rows[0].cells[5].textContent; // КК */
    for (let i = 0; i < table.rows.length; i++) {
        addCards($.trim(table.rows[i].cells[2].textContent), $.trim(table.rows[i].cells[4].textContent), $.trim(table.rows[i].cells[5].textContent));
    }
    console.log('я выполнилась');
}

// выводит в консоль всю статистику по имени команды и таблице common, home, guest, now
// заебался учитывать регистр. теперь имя не учитывает регистр
function showStats(name, loc = 'common') {
    name = name.toLowerCase();
    if (name == 'ЦСКА') name = name.toUpperCase();
    else name = name[0].toUpperCase() + name.slice(1);

    if (checkIndex(name, loc) != -1) {
        let team = stats[loc][checkIndex(name, loc)];
        for (let i = 0; i < team.length; i++) {
            console.log(`${descript[i]} : ${team[i]} ;`); // перебор значений. сюда пихать их обработчик
        }
    } else
        console.log('Команды с данным именем не найдено');
}

// поиск индекса массива в таблице common, home, guest, now по названию команды
function checkIndex(name, loc = 'common') {
    for (let i = 0; i <= 15; i++) {
        if (stats[loc][i].name == name) return i;
    }
    return -1;
}
// добавляет новый параметр в статистику коллекции по имени команды и таблице
function addStats(name, stat, loc = 'common') {
    stats[loc][checkIndex(name, loc)][stats[loc][checkIndex(name, loc)].length] = stat;
    stats[loc][checkIndex(name, loc)].length++;
}
// добавлялка карточек
function addCards(name, yelCards, redCards, loc = 'common') {
    if (yelCards == '–') yelCards = 0;
    if (redCards == '–') redCards = 0;
    if (stats[loc][checkIndex(name, loc)].length <= 8) {
        stats[loc][checkIndex(name, loc)][stats[loc][checkIndex(name, loc)].length] = +yelCards;
        stats[loc][checkIndex(name, loc)].length++;
        stats[loc][checkIndex(name, loc)][stats[loc][checkIndex(name, loc)].length] = +redCards;
        stats[loc][checkIndex(name, loc)].length++;
    } else {
        stats[loc][checkIndex(name, loc)][stats[loc][checkIndex(name, loc)].length - 2] += +yelCards;
        stats[loc][checkIndex(name, loc)][stats[loc][checkIndex(name, loc)].length - 1] += +redCards;
    }
}


/*
let chain = Promise.resolve();
while (Data.search(/Следующие 50/i)) {
  chain = chain
    .then(() => new Promise ((resolve, reject) => { 
								var b = $.ajax(ссылка на /Следующие 50/);
								resolve(b); } ))
    .then((data) => {
      analysCards(data); checkCards(); return new Promise ((resolve, reject) => { 
								var b = $.ajax(новая ссылка на /Следующие 50/);
								resolve(b); } ))
    });

}
*/