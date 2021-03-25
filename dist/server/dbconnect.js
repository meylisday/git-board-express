const mongoose = require('mongoose');
// Установим подключение по умолчанию
const mongoDB = 'mongodb://127.0.0.1/git-board';
mongoose.connect(mongoDB);
console.log(mongoose.connection.readyState);
// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;
// Получение подключения по умолчанию
const db = mongoose.connection;
// Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//# sourceMappingURL=dbconnect.js.map