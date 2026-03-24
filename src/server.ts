import path from 'path';

import dotenv from 'dotenv';
import express from 'express';
import Luzmo from '@luzmo/nodejs-sdk';

import type { Request, Response } from 'express';
import type {
  EmbedAuthorizationPayload,
  LuzmoApiErrorBody,
} from './types/authorization';

dotenv.config();

const PROJECT_ROOT = path.join(__dirname, '..');

const apiKey = process.env.LUZMO_API_KEY ?? process.env.CUMULIO_API_KEY;
const apiToken = process.env.LUZMO_API_TOKEN ?? process.env.CUMULIO_API_TOKEN;
const collectionId = process.env.LUZMO_COLLECTION_ID;

if (!apiKey || !apiToken) {
  console.warn(
    '[warn] LUZMO_API_KEY / LUZMO_API_TOKEN must be set in .env'
  );
}

const client = new Luzmo({
  api_key: apiKey ?? '',
  api_token: apiToken ?? '',
  host: process.env.LUZMO_API_HOST ?? 'https://api.luzmo.com',
});

const app = express();
app.disable('x-powered-by');

app.use(
  '/@luzmo',
  express.static(path.join(PROJECT_ROOT, 'node_modules', '@luzmo'))
);
app.use(express.static(path.join(PROJECT_ROOT, 'public')));

/** Returns an ISO timestamp 24 h from now. */
function embedExpiryIso24h(): string {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d.toISOString();
}

app.get('/authorization', (_req: Request, res: Response) => {
  if (!collectionId) {
    res.status(500).json({
      error: 'Missing LUZMO_COLLECTION_ID',
      hint: 'Create a Collection in Luzmo, add your dashboards/datasets, and set LUZMO_COLLECTION_ID in .env',
    });
    return;
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
      console.error('[authorization] Luzmo API error', body);
      res.status(400).json(body);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.warn(`[OK] App listening on http://localhost:${PORT}`);
});
