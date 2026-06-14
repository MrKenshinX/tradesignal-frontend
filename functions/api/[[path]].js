// Cloudflare Pages Function: teruskan semua /api/* ke backend Hostinger via subdomain origin.
// origin.tradesignalpro.web.id = DNS-only (langsung ke Hostinger, bypass Cloudflare, SSL benar).
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const targetUrl = 'https://origin.tradesignalpro.web.id' + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.delete('host'); // biar fetch set Host sesuai target

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  try {
    const resp = await fetch(targetUrl, init);
    const respHeaders = new Headers(resp.headers);
    respHeaders.set('Access-Control-Allow-Origin', '*');
    return new Response(resp.body, {
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
