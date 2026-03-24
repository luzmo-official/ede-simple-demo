import type {
  EmbedAuthorizationPayload,
  EmbedAuthorizationResult,
} from './authorization';

declare module '@luzmo/nodejs-sdk' {
  interface LuzmoClientOptions {
    api_key: string;
    api_token: string;
    host: string;
  }

  class Luzmo {
    constructor(options: LuzmoClientOptions);
    create(
      resource: 'authorization',
      body: EmbedAuthorizationPayload
    ): Promise<EmbedAuthorizationResult>;
  }

  export = Luzmo;
}
