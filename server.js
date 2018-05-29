const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
mongoose.Promise = global.Promise;
// const PORT = process.env.PORT || 3000;

const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');
const { PORT, DATABASE_URL } = require('./config');
const { Items } = require('./models');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));
app.use(morgan('common'));


app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};