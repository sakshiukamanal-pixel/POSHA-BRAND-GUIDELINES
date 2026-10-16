// Poshword gate (Vercel Routing Middleware): runs on Vercel's servers before any file is sent.
// Without the unlock cookie, pages show the gate (code/gate/) and every other file is refused,
// so the guidelines can't be read by fetching database/ or code/ files directly.
//
// The Poshword itself is never stored here (the repository is public). Only two one-way values are:
//   CHECK      — first half of PBKDF2(Poshword) → confirms the Poshword typed into the gate
//   TOKEN_SHA  — SHA-256 of the second half     → the cookie holds that second half, and only someone
//                who knew the Poshword could have produced it
// To change the Poshword: python3 code/tools/set-poshword.py "new word", paste its output below, deploy.
//
// Media on Cloudflare R2 (images, icons, video) is loaded straight from R2 and isn't covered by this gate.

const SALT = '18acb6478ee9d2ae8f2c73a0fccfb7de';
const ITER = 20000;
const CHECK = 'a66d63e10d5dc37cff85070c8fa1f06a';
const TOKEN_SHA = '6b15e2f03ce7642d730c889c9d7527547930abb2246ae744c58ef18fc7824b29';

const COOKIE = 'posha_gate';
const MAX_AGE = 60 * 60 * 24 * 30; // stay unlocked for 30 days

// Reachable without the Poshword: the gate itself, the fonts and line icons it uses, and the link-preview image
const OPEN = [/^\/code\/gate\//, /^\/assets\/fonts\//, /^\/code\/img\/line-icons\//, /^\/code\/og-image\.png$/, /^\/favicon\.ico$/, /^\/robots\.txt$/];

export const config = { matcher: '/:path*' };

const next = () => new Response(null, { headers: { 'x-middleware-next': '1' } });
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (h) => new Uint8Array((h.match(/../g) || []).map((x) => parseInt(x, 16)));

async function derive(word) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(word), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(SALT), iterations: ITER }, key, 256);
  const all = hex(bits);
  return { check: all.slice(0, 32), token: all.slice(32) };
}

async function hasPass(request) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([0-9a-f]{32})`));
  if (!m) return false;
  return hex(await crypto.subtle.digest('SHA-256', unhex(m[1]))) === TOKEN_SHA;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // The gate posts the Poshword here
  if (path === '/__unlock') {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    let word = '';
    try { word = String((await request.json()).word || '').trim().toLowerCase().slice(0, 200); } catch (e) { /* empty */ }
    const { check, token } = await derive(word);
    if (check !== CHECK) return Response.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ ok: true }, {
      headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  if (OPEN.some((re) => re.test(path))) return next();
  if (await hasPass(request)) return next();

  // Pages get the gate (the address stays the same, so a reload after unlocking lands where you were going)
  const isPage = path === '/' || path.endsWith('/') || path.endsWith('.html');
  if (isPage) {
    return new Response(null, { headers: { 'x-middleware-rewrite': new URL('/code/gate/index.html', url).toString(), 'Cache-Control': 'no-store' } });
  }
  return new Response('Locked. Open the site and enter the Poshword.', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}
