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
  if (kept.value) return new Response(kept.value, { headers: { ...KEEP, "Content-Type": (kept.metadata && kept.metadata.type) || "image/jpeg", "X-Portrait": "kept" } });

  const day = new Date().toISOString().slice(0, 10);
  const row = await env.DB.prepare("INSERT INTO portrait_days (day, n) VALUES (?1, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1 RETURNING n").bind(day).first();
  if (row && row.n > DAILY_CAP) return fail(429, "daily limit reached");

  let out;
  try {
    const form = new FormData();
    form.append("prompt", portraitPrompt(L));
    form.append("width", String(W));
    form.append("height", String(H));
    form.append("seed", String(L.seed % 2147483647));
    const body = new Response(form);
    out = await env.AI.run(MODEL, { multipart: { body: body.body, contentType: body.headers.get("content-type") } });
  } catch (e) {
    console.log("portrait: model error", key, String((e && e.message) || e).slice(0, 300));
    return fail(503, "the image model is unavailable");
  }
  if (!out || typeof out.image !== "string") return fail(503, "the image model returned nothing");
  const bin = atob(out.image), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const type = sniff(bytes);
  if (!type) return fail(503, "the image model returned something that is not an image");
  waitUntil(env.PORTRAITS.put(key, bytes, { metadata: { type, day } }));
  return new Response(bytes, { headers: { ...KEEP, "Content-Type": type, "X-Portrait": "new" } });
}
