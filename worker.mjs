/**
 * Cloudflare Worker for Our Little Home
 * Proxies /ws to the Node.js backend (e.g. Render / Fly / VPS)
 * while serving or passing static assets.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle WebSocket endpoint proxying
    if (url.pathname === '/ws') {
      const backend = env.BACKEND_URL || 'https://our-little-home.onrender.com';
      const backendUrl = new URL(backend);
      backendUrl.pathname = '/ws';
      backendUrl.protocol = backendUrl.protocol === 'http:' ? 'ws:' : 'wss:';

      const newHeaders = new Headers(request.headers);
      newHeaders.set('Host', backendUrl.host);

      return fetch(backendUrl.toString(), {
        headers: newHeaders,
        method: request.method,
      });
    }

    // Serve static assets via Cloudflare Assets if configured
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Our Little Home Worker is active. Use /ws for multiplayer or configure ASSETS for static files.', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
