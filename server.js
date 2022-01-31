require('dotenv').config();
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const compression = require('compression'); 
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { join } = require('path');
const Cumulio = require('cumulio');
const authConfig = require('./auth_config.json');
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

const client = new Cumulio({
  api_key: process.env.CUMULIO_API_KEY,
  api_token: process.env.CUMULIO_API_TOKEN
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
app.use('/@cumul.io', express.static(__dirname + '/node_modules/@cumul.io'));
app.use('/@fortawesome', express.static(__dirname + '/node_modules/@fortawesome'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap'));
app.use(express.static(__dirname + '/public'));
app.options('*', (req, res) => {
  res.status(204);  
});

app.get('/authorization',checkJwt, (req, res) => {
  const authNamespace = 'https://cumulio/';
  client.create('authorization', {
    integration_id: process.env.INTEGRATION_ID,
    type: 'sso',
    expiry: '24 hours',
    inactivity_interval: '24 hours',
    role: req.user[authNamespace + 'role'],
    name: req.user[authNamespace + 'name'],
    username: req.user[authNamespace + 'username'],
    email: req.user[authNamespace + 'email'],
    suborganization: req.user[authNamespace + 'department'],
    feature_overrides: ['!flag_disable_helios']
  })
    .then(result => res.status(200).json(result))
    .catch(error =>{
      console.log('API Error: ' + JSON.stringify(error));
    });
});

// Endpoint to serve the configuration file
app.get('/auth_config.json', (req, res) => {
  res.sendFile(join(__dirname, 'auth_config.json'));
});

// Serve the index page for all other requests
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});


app.listen(3000, () => console.log('[OK] - App listening on port 3000'));