var api_url = 'https://randomuser.me/api';
var button = document.getElementById('button');
var request_status = document.getElementById('status');

function display(data) {
    
    // Виокремимо лише корисні дані
    useful = data['results'][0];

    // Створимо div для зберігання інформації про людей
    profile = document.createElement('div');
    profile.setAttribute('id', 'profile');

    // Додамо картинку
    let pic = document.createElement('img');
    pic.src= useful['picture']['large'];
    pic.alt = 'Profile picture';
    profile.appendChild(pic);

    // Додамо номер телефону
    let cell = document.createElement('p');
    cell.innerText = `Cell: ${useful['cell']}`;
    profile.appendChild(cell);

    // Додамо місто
    let city = document.createElement('p')
    city.innerText = `City: ${useful['location']['city']}`;
    profile.appendChild(city);

    // Додамо E-mail
    let email = document.createElement('p');
    email.innerText = `E-mail: ${useful['email']}`;
    profile.appendChild(email);

    // Додамо координати
    let coords = document.createElement('p');
    coords.innerText = `Coordinates: ${useful['location']['coordinates']['latitude']}, ${useful['location']['coordinates']['longitude']}`;
    profile.appendChild(coords);

    // Додамо профіль людини на сторінку
    document.getElementById('results').appendChild(profile);
    request_status.innerText = 'Success!'
};

// Додаємо людину при натисканні на кнопку
button.addEventListener('click', () => {
    fetch(api_url)
    .then((response) => response.json())
    .then((data) => display(data)).catch(error => request_status.innerText = error);
});