// Cloudflare Pages Function: proxy semua /api/* ke backend Hostinger via subdomain origin.
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = 'https://origin.tradesignalpro.web.id' + url.pathname + url.search;

  // Salin header secara eksplisit, pertahankan Authorization
  const headers = new Headers();
  for (const [key, value] of request.headers) {
    const k = key.toLowerCase();
    if (k === 'host' || k === 'cf-connecting-ip' || k === 'cf-ipcountry' || k.startsWith('cf-')) continue;
    headers.set(key, value);
  }

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  try {
    const resp = await fetch(targetUrl, init);
    const respHeaders = new Headers(resp.headers);
    respHeaders.set('Access-Control-Allow-Origin', '*');
    respHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    respHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    const body = await resp.arrayBuffer();
    return new Response(body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: respHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: 'Backend tidak terjangkau', error: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
