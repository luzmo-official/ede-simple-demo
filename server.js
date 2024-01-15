require('dotenv').config();
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const compression = require('compression'); 
const express = require('express');
const Luzmo = require('@luzmo/nodejs-sdk');

const client = new Luzmo({
  api_key: process.env.LUZMO_API_KEY,
  api_token: process.env.LUZMO_API_TOKEN
});

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app = express();
app.set('json spaces', 2);
app.set('x-powered-by', false);
app.use(compression());
app.use(connectLiveReload());
app.use((req, res, next) => {
  res.setHeader('Content-Language', 'en');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Content-Language, Accept');
  next();
});

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/@luzmo', express.static(__dirname + '/node_modules/@luzmo'));
app.use('/@fortawesome', express.static(__dirname + '/node_modules/@fortawesome'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));
app.use(express.static(__dirname + '/public'));
app.options('*', (req, res) => {
  res.status(204);  
});

app.get('/authorization', (req, res) => {
  client.create('authorization', {
    integration_id: process.env.INTEGRATION_ID,
    type: 'sso',
    expiry: '24 hours',
    inactivity_interval: '10 minutes',
    username: 'JohnDoe',
    name: 'John Doe',
    email: 'johndoe@luzmo.com',
    suborganization: 'Sample Integration',
    role: 'designer'
  })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error));
});

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(3000, () => console.log('[OK] - App listening on port 3000'));
