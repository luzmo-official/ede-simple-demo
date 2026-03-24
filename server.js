require('dotenv').config();
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const compression = require('compression');
const express = require('express');
const Luzmo = require('@luzmo/nodejs-sdk');

const apiKey = process.env.LUZMO_API_KEY || process.env.CUMULIO_API_KEY;
const apiToken = process.env.LUZMO_API_TOKEN || process.env.CUMULIO_API_TOKEN;
const collectionId = process.env.LUZMO_COLLECTION_ID;

const client = new Luzmo({
  api_key: apiKey,
  api_token: apiToken,
  host: process.env.LUZMO_API_HOST || 'https://api.luzmo.com'
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

function embedExpiryIso24h() {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d.toISOString();
}

app.get('/authorization', (req, res) => {
  if (!collectionId) {
    return res.status(500).json({
      error: 'Missing LUZMO_COLLECTION_ID',
      hint: 'Create a Collection in Luzmo, add your dashboards/datasets, and set LUZMO_COLLECTION_ID in .env'
    });
  }

  client.create('authorization', {
    type: 'embed',
    username: 'JohnDoe',
    name: 'John Doe',
    email: 'johndoe@example.com',
    suborganization: 'Sample Demo',
    role: 'designer',
    expiry: embedExpiryIso24h(),
    inactivity_interval: 600,
    access: {
      collections: [
        {
          id: collectionId,
          inheritRights: 'modify'
        }
      ]
    }
  })
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json(error));
});

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(3000, () => console.log('[OK] - App listening on port 3000'));
