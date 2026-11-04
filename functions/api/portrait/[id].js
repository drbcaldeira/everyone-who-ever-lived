// The portrait of one drawn life, painted by an image model on Cloudflare Workers AI.
// GET /api/portrait/<life id>, where the id is the page's link after the '#' (e.g. 2.all.s100.0a1b2c3d).
// The server recomputes the life from the id with the page's own model (lib/model.js, cut from site/index.html
// by publish.py), so the prompt is always the one the page shows and nobody can send a prompt of their own.
// Each portrait is painted once and kept in KV (binding PORTRAITS) under 'v<PORTRAIT_VERSION>/<id>'.
// A daily cap counted in D1 (table portrait_days) bounds the spend; past it the page shows the seal instead.
import { parseLifeId, drawLife, lifeId, portraitPrompt, PORTRAIT_VERSION } from "../../../lib/model.js";

const MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
const W = 768, H = 1024;      // 3:4, three 512x512 output tiles
const DAILY_CAP = 120;        // ~78 neurons a portrait: 120 a day stays inside the free 10,000 neurons
const KEEP = { "Cache-Control": "public, max-age=31536000, immutable" };

const fail = (status, error) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

function sniff(b) {
  if (b[0] === 0xff && b[1] === 0xd8) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[8] === 0x57) return "image/webp";
  return null;
}

export async function onRequestGet({ params, env, waitUntil }) {
  const p = parseLifeId(params.id);
  if (!p) return fail(400, "not a life id");
  const L = drawLife(p.seed, p.mode, p.s);
  const key = "v" + PORTRAIT_VERSION + "/" + lifeId(L);

  const kept = await env.PORTRAITS.getWithMetadata(key, { type: "arrayBuffer" });
  if (kept.value) {
    const m = kept.metadata || {};
    return new Response(kept.value, { headers: { ...KEEP, "Content-Type": m.type || "image/jpeg", "X-Portrait": "kept", "X-Portrait-Soft": m.soft ? "1" : "0" } });
  }

  const day = new Date().toISOString().slice(0, 10);
  const row = await env.DB.prepare("INSERT INTO portrait_days (day, n) VALUES (?1, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1 RETURNING n").bind(day).first();
  if (row && row.n > DAILY_CAP) return fail(429, "daily limit reached");

  // Workers AI filters outputs and now and then flags a sick or starving child (error 3030), not always the same one.
  // Then it paints once more from the soft prompt, the same picture without illness, hunger and grime.
  let out, soft = false;
  try {
    out = await paint(env, portraitPrompt(L), L.seed);
  } catch (e) {
    const msg = String((e && e.message) || e);
    if (/4006|daily free allocation/i.test(msg)) return fail(429, "the account's daily Workers AI allowance is used up");   // free plan: 10,000 neurons a day, shared by every use of the account
    if (!/3030|flagged/i.test(msg)) { console.log("portrait: model error", key, msg.slice(0, 300)); return fail(503, "the image model is unavailable"); }
    try { soft = true; out = await paint(env, portraitPrompt(L, true), L.seed); }
    catch (e2) { console.log("portrait: flagged twice", key, String((e2 && e2.message) || e2).slice(0, 300)); return fail(503, "the image model would not paint this life"); }
  }
  if (!out || typeof out.image !== "string") return fail(503, "the image model returned nothing");
  const bin = atob(out.image), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const type = sniff(bytes);
  if (!type) return fail(503, "the image model returned something that is not an image");
  waitUntil(env.PORTRAITS.put(key, bytes, { metadata: { type, day, soft } }));
  return new Response(bytes, { headers: { ...KEEP, "Content-Type": type, "X-Portrait": "new", "X-Portrait-Soft": soft ? "1" : "0" } });
}

async function paint(env, prompt, seed) {
  const form = new FormData();
  form.append("prompt", prompt);
  form.append("width", String(W));
  form.append("height", String(H));
  form.append("seed", String(seed % 2147483647));
  const body = new Response(form);
  return env.AI.run(MODEL, { multipart: { body: body.body, contentType: body.headers.get("content-type") } });
}
