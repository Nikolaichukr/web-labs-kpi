var form = document.getElementById('form');
var body = document.querySelector('body')
var summary = document.createElement('div')
summary.setAttribute('id', 'summary')
var allGood = true;
var badFields = [];
var goodFields = [];

// Скидання стану форми
function resetState() {
    // Видалення підсвічування полів червоним
    badFields.forEach(id => {
        let element = document.getElementById(id)
        element.style.border = '2px grey solid';
        element.style.backgroundColor = '#fff';
    });
    // Видалення коректно введених даних з підсумку
    while(summary.firstChild) {
        summary.removeChild(summary.firstChild)
    }
    // Скидання значень змінних
    allGood = true;
    badFields = [];
    goodFields = [];
};

// Валідація регулярних виразів
function isValid(id, regex, name) {
    let text = document.getElementById(id).value
    // Якщо валідацію пройдено - створюється елемент
    if (text.match(regex)) {
        let item = document.createElement('p');
        item.innerHTML = '<b>' + name + '</b>: ' + text;
        goodFields.push(item);
    }
    // Якщо валідація не пройдена - змінюємо значення змінної та додаємо поле до списку полів, що не пройшли валідацію
    else {
        allGood = false;
        badFields.push(id);
    }
};


function validate() {
    resetState();
    isValid('pib', /^[A-ZА-ЯІЇЄ][a-zA-ZА-ЯІЇЄа-яіїє]+ [A-ZА-ЯІЇЄ]\.[A-ZА-ЯІЇЄ]\.$/, 'ПІБ');
    isValid('group', /^[A-ZА-ЯІЇЄ]{2}-\d{2}$/, 'Факультет');
    isValid('faculty', /^[A-ZА-ЯІЇЄ]{3,7}$/, 'Факультет');
    isValid('address', /^м\.\s[А-ЯІЇЄ][а-яіїє]{1,15}$/, 'Адреса');
    isValid('telegram', /^@[a-zA-Z0-9_]{4,25}$/, 'Telegram');
    if (allGood) {
        let x = document.createElement('h3')
        x.innerHTML = 'Введені дані:'
        summary.appendChild(x)
        goodFields.forEach(item => {
            summary.appendChild(item);
        })
        body.appendChild(summary)
    }
    else {
        badFields.forEach(id => {
            let element = document.getElementById(id)
            element.style.border = '2px red solid';
            element.style.backgroundColor = '#ffcbc7';
        })
    }
};