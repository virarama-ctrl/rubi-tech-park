import { createRequire } from 'node:module';
import type { IncomingMessage, ServerResponse } from 'node:http';

type VercelLikeRequest = IncomingMessage & {
  body?: unknown;
  _body?: boolean;
  rawBody?: Buffer;
};

const require = createRequire(import.meta.url);
let cachedApp: ((req: any, res: any) => any) | null = null;

async function resolveExpressApp(): Promise<(req: any, res: any) => any> {
  if (cachedApp) return cachedApp;

  // Prefer the pre-bundled CJS server artifact generated during `npm run build`
  // so Node ESM (`"type": "module"`) never hits extensionless import or CJS/vite conflicts on Vercel.
  try {
    const bundlePath = './_server.cjs';
    const mod = require(bundlePath);
    cachedApp = mod.default || mod;
    if (cachedApp) return cachedApp;
  } catch {
    // Fallback to TypeScript source when running via `tsx` / `node:test`
  }

  const mod = await import('../server');
  cachedApp = mod.default;
  return cachedApp;
}

/**
 * Vercel Serverless Function entrypoint for remaining `/api/*` routes.
 * Delegates to the Express `app` defined in `/server.ts` and guarantees valid JSON errors.
 */
export default async function handler(req: VercelLikeRequest, res: ServerResponse) {
  try {
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

    const app = await resolveExpressApp();
    return app(req as any, res as any);
  } catch (err: any) {
    console.error('Unhandled /api/index invocation error:', err?.message || err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(
        JSON.stringify({
          success: false,
          error: 'API Server Error',
          message: err?.message || 'Unable to process API request.'
        })
      );
    }
  }
}
