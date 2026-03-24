import path from 'path';
import dotenv from 'dotenv';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import compression from 'compression';
import express, { type Request, type Response, type NextFunction } from 'express';
import ejs from 'ejs';
import Luzmo from '@luzmo/nodejs-sdk';
import type {
  EmbedAuthorizationPayload,
  LuzmoApiErrorBody,
} from './types/authorization';

dotenv.config();

const projectRoot = path.join(__dirname, '..');

const apiKey = process.env.LUZMO_API_KEY ?? process.env.CUMULIO_API_KEY;
const apiToken = process.env.LUZMO_API_TOKEN ?? process.env.CUMULIO_API_TOKEN;
const collectionId = process.env.LUZMO_COLLECTION_ID;

if (!apiKey || !apiToken) {
  console.warn(
    '[warn] LUZMO_API_KEY / LUZMO_API_TOKEN (or CUMULIO_* fallbacks) should be set in .env'
  );
}

const client = new Luzmo({
  api_key: apiKey ?? '',
  api_token: apiToken ?? '',
  host: process.env.LUZMO_API_HOST ?? 'https://api.luzmo.com',
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
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Language', 'en');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Content-Language, Accept'
  );
  next();
});

app.set('views', path.join(projectRoot, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(
  '/@luzmo',
  express.static(path.join(projectRoot, 'node_modules', '@luzmo'))
);
app.use(
  '/@fortawesome',
  express.static(path.join(projectRoot, 'node_modules', '@fortawesome'))
);
app.use(
  '/bootstrap',
  express.static(path.join(projectRoot, 'node_modules', 'bootstrap'))
);
app.use(express.static(path.join(projectRoot, 'public')));
app.options('*', (_req: Request, res: Response) => {
  res.status(204).end();
});

function embedExpiryIso24h(): string {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d.toISOString();
}

app.get('/authorization', (_req: Request, res: Response) => {
  if (!collectionId) {
    return res.status(500).json({
      error: 'Missing LUZMO_COLLECTION_ID',
      hint:
        'Create a Collection in Luzmo, add your dashboards/datasets, and set LUZMO_COLLECTION_ID in .env',
    });
  }

  const payload: EmbedAuthorizationPayload = {
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
          inheritRights: 'modify',
        },
      ],
    },
  };

  client
    .create('authorization', payload)
    .then((result) => res.status(200).json(result))
    .catch((error: unknown) => {
      const body: LuzmoApiErrorBody =
        error !== null && typeof error === 'object'
          ? (error as LuzmoApiErrorBody)
          : { message: String(error) };
      res.status(400).json(body);
    });
});

app.get('/', (_req: Request, res: Response) => {
  res.render('index.html');
});

app.listen(3000, () => {
  console.log('[OK] - App listening on port 3000');
});
