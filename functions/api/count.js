// Site counter: two anonymous totals, visits (one per browser session) and lives drawn.
// POST {visit: 0|1, lives: n} adds to them and returns both; GET only returns them.
// D1 database ewel-counter (binding DB, in wrangler.toml), table counter, one row with id 1.
// Only /api/* runs as a function (site/_routes.json); everything else stays static.
const clamp = (x, max) => Math.max(0, Math.min(max, Math.floor(Number(x) || 0)));
const read = env => env.DB.prepare("SELECT visits, lives FROM counter WHERE id = 1").first();

export async function onRequestPost({ request, env }) {
  let b = {};
  try { b = JSON.parse(await request.text()); } catch (e) {}
  const visit = clamp(b.visit, 1), lives = clamp(b.lives, 10000);   // one Deal is 100 lives; the cap only stops a forged request
  const r = visit || lives
    ? await env.DB.prepare("UPDATE counter SET visits = visits + ?1, lives = lives + ?2 WHERE id = 1 RETURNING visits, lives").bind(visit, lives).first()
    : await read(env);
  return Response.json(r || { visits: null, lives: null }, { headers: { "Cache-Control": "no-store" } });
}

export async function onRequestGet({ env }) {
  const r = await read(env);
  return Response.json(r || { visits: null, lives: null }, { headers: { "Cache-Control": "public, max-age=60" } });
}
