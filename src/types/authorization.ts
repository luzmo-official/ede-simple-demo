/** Payload for createAuthorization with `type: 'embed'` (see Luzmo API). */
export interface CollectionAccess {
  id: string;
  inheritRights: 'modify' | 'read' | 'use';
}

export interface EmbedAuthorizationPayload {
  type: 'embed';
  username: string;
  name: string;
  email: string;
  suborganization: string;
  role: string;
  expiry: string;
  inactivity_interval: number;
  access: {
    collections: CollectionAccess[];
  };
}

/** Successful embed token response (id + token passed to the frontend). */
export interface EmbedAuthorizationResult {
  id: string;
  token: string;
}

/** Error shape sometimes returned by the Luzmo API on failure. */
export interface LuzmoApiErrorBody {
  status?: number;
  message?: string;
  [key: string]: unknown;
}
