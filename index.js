// index.js
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const connectDB = require('./mongoose');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();

// Подключаемся к MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
// Подключаем статическую папку для картинок
app.use('/static', express.static(path.join(__dirname, 'static')));
// Основные роуты
app.use('/api', router);

// Обработка ошибок (последний Middleware)
app.use(errorHandler);

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
