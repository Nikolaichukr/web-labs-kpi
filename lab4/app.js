// Server side

// Імпорт бібліотек
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Відображення головної сторінки
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Обробник події - надходжнння вхідного з'єдання
io.on('connection', function(socket) {
  console.log('a user connected');

  // Обробник події - надходження повідомлення від користувача
  socket.on('chat message', function(data) {
    // Відправка отриманих даних (повідомлення) для всіх інших користувачів
    io.emit('chat message', data); 
  });

  // Обробник події - відключення користувача
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

// Запуск сервера
http.listen(3000, function() {
  console.log('listening on localhost:3000');
});
