import type { IncomingMessage, ServerResponse } from 'node:http';
import app from '../server';

type VercelLikeRequest = IncomingMessage & {
  body?: unknown;
  _body?: boolean;
  rawBody?: Buffer;
};

/**
 * Vercel Serverless Function entrypoint for all `/api/*` routes.
 * Delegates to the canonical Express `app` defined in `/server.ts` with zero route duplication.
 */
export default function handler(req: VercelLikeRequest, res: ServerResponse) {
  // Vercel's Node runtime may pre-parse JSON into `req.body` and drain the request stream
  // without setting `req._body = true`, which would cause Express's body-parser to stall.
  if (req.body !== undefined && req.readableEnded && !req._body) {
    req._body = true;
    if (!req.rawBody) {
      try {
        req.rawBody =
          typeof req.body === 'string'
            ? Buffer.from(req.body, 'utf-8')
            : Buffer.from(JSON.stringify(req.body), 'utf-8');
      } catch {
        // Ignore rawBody fallback serialization failure
      }
    }
  }

  return app(req as any, res as any);
}
