const path = require('path');
const mongoose = require('mongoose');
// const result = require('dotenv').config({
//   path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`),
// });

// const result = require('dotenv').config({
//   path: path.join(__dirname, `./.env`),
// });

// // const result = require('dotenv').config({ silent: true });

// if (result.error) {
//   throw new Error(result.error);
// }

const express = require('express');
// const pino = require('pino-http');
const cors = require('cors');
// const { postgrator } = require('./lib/db');
const { uploadedFilesFolderName } = require('./middlewares/multipart');

const app = express();
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.json());
app.use(cors());
// app.use(pino({ level: process.env.LOG_LEVEL }));

app.use('/' + uploadedFilesFolderName, express.static(uploadedFilesFolderName));

app.use('/users', require('./routes/users'));
app.use('/trips', require('./routes/trips'));
app.use('/notes', require('./routes/notes'));
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/search', require('./routes/search'));

const host = process.env.HOST;
const port = +process.env.PORT || 4000;

// postgrator
//   .migrate()
//   .then((result) => {
//     console.log(`migrated db successfully:`, result);
//     app.listen(port, host, () => {
//       console.log(`server is listening at http://${host}:${port}`);
//     });
//   })
//   .catch((error) => console.error(error));

const url = process.env.MONGO_URL;

console.log(host, port, url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Server is listening at http://${host}:${port}`);
      console.log('MongoDB connected');
    });
  })
  .catch(() => {
    console.log('Fail to connect to DB!!!!');
  });
