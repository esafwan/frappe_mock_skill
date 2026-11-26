// Map view renderer: static tile background (deterministic SVG, no network) with markers from lat/lng or Geolocation rows, plus a popup.
// spec.data.rows: [{...}]. spec.view.map (all optional): { lat_field, lng_field, location_field, title_field, popup: <row index>, center:[lat,lng], zoom }.
// A Geolocation value is a GeoJSON FeatureCollection (string or object) with Point features [lng, lat]. Rows with no coordinates are skipped.
import { esc, hash } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { viewHead } from '../../kit-lib/viewhead.mjs';

const W = 1000, H = 560;
const num = (v) => { const n = typeof v === 'string' ? parseFloat(v) : v; return Number.isFinite(n) ? n : undefined; };
const pick = (r, names) => { for (const n of names) if (n && r[n] !== undefined && r[n] !== null && r[n] !== '') return r[n]; return undefined; };

function coords(r, cfg) {
  const lat = num(pick(r, [cfg.lat_field, 'latitude', 'lat'])), lng = num(pick(r, [cfg.lng_field, 'longitude', 'lng', 'lon']));
  if (lat !== undefined && lng !== undefined) return [lat, lng];
  let g = pick(r, [cfg.location_field, 'location', 'geolocation']);
  if (typeof g === 'string') { try { g = JSON.parse(g); } catch { g = undefined; } }
  const f = g?.type === 'FeatureCollection' ? g.features?.find((x) => x?.geometry?.type === 'Point') : g?.type === 'Feature' ? g : null;
  const c = f?.geometry?.coordinates || (g?.type === 'Point' ? g.coordinates : null);
  return c && num(c[0]) !== undefined && num(c[1]) !== undefined ? [num(c[1]), num(c[0])] : null;
}
const mx = (lng, z) => ((lng + 180) / 360) * 256 * 2 ** z;
const my = (lat, z) => { const s = Math.sin((Math.max(-85, Math.min(85, lat)) * Math.PI) / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 256 * 2 ** z; };

function tiles(seedKey, cx, cy, z) {
  // Pseudo map tiles: 256px cells with deterministic land/water tint and a few road lines, keyed on absolute tile coords.
  const t0x = Math.floor((cx - W / 2) / 256), t1x = Math.floor((cx + W / 2) / 256), t0y = Math.floor((cy - H / 2) / 256), t1y = Math.floor((cy + H / 2) / 256);
  let out = '';
  for (let tx = t0x; tx <= t1x; tx++) for (let ty = t0y; ty <= t1y; ty++) {
    const h = hash(`${z}/${tx}/${ty}`), x = tx * 256 - cx + W / 2, y = ty * 256 - cy + H / 2;
    const water = h % 7 === 0;
    out += `<rect x="${x}" y="${y}" width="256" height="256" fill="${water ? 'var(--kit-map-water)' : h % 3 === 0 ? 'var(--kit-map-land-a)' : 'var(--kit-map-land-b)'}" stroke="var(--kit-map-edge)" stroke-width="1"/>`;
    if (!water) {
      const a = 40 + (h % 170), b = 40 + ((h >> 4) % 170);
      out += `<path d="M${x} ${y + a}H${x + 256}M${x + b} ${y}V${y + 256}" stroke="var(--kit-map-road)" stroke-width="5" fill="none"/><path d="M${x} ${y + a}H${x + 256}M${x + b} ${y}V${y + 256}" stroke="var(--kit-map-road-edge)" stroke-width="1" fill="none" transform="translate(0 0)"/>`;
      if (h % 5 === 0) out += `<rect x="${x + b + 10}" y="${y + a + 10}" width="60" height="44" fill="var(--kit-map-park)"/>`;
    }
  }
  return out;
}

const CSS = `<style data-ui="map.layout">.map-view{padding-top:12px}.map-box{position:relative;width:100%;aspect-ratio:${W}/${H};max-height:600px;border:1px solid var(--outline-gray-1,var(--kit-border));border-radius:8px;overflow:hidden;background:var(--kit-map-land-b)}.map-box>svg.map-tiles{position:absolute;inset:0;width:100%;height:100%;display:block}.map-marker{position:absolute;width:24px;height:24px;margin:-24px 0 0 -12px;color:var(--kit-red)}.map-marker svg{width:24px;height:24px;fill:var(--kit-surface);stroke:currentColor;stroke-width:2.2}.map-popup{position:absolute;transform:translate(-50%,-100%);margin-top:-30px;min-width:140px;max-width:240px;padding:8px 12px;border-radius:8px;background:var(--surface-white,var(--kit-surface));box-shadow:0 2px 8px rgba(0,0,0,.2);font-size:12px;z-index:2}.map-popup .map-popup-title{font-weight:600}.map-zoom{position:absolute;left:10px;top:10px;display:flex;flex-direction:column;background:var(--surface-white,var(--kit-surface));border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.3)}.map-zoom span{width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:18px}.map-attrib{position:absolute;right:0;bottom:0;padding:1px 6px;font-size:10px;background:rgba(255,255,255,.7)}.map-empty{display:flex;align-items:center;justify-content:center;min-height:240px}</style>`;

export default function render(spec, ctx) {
  const cfg = spec.view?.map || {};
  const dt = typeof spec.meta?.doctype === 'string' ? spec.meta.doctype : spec.meta?.doctype?.name || 'Map';
  const title = cfg.title || dt;
  const rows = Array.isArray(spec.data?.rows) ? spec.data.rows : [];
  const pts = [];
  rows.forEach((r, i) => { const c = coords(r, cfg); if (c) pts.push({ i, r, lat: c[0], lng: c[1], label: String(pick(r, [cfg.title_field, 'title', 'subject', 'name']) ?? `Row ${i + 1}`) }); else ctx.warn?.(`map: row ${i} has no coordinates; skipped`); });
  let body;
  if (spec.view?.state === 'loading') body = `<div class="map-empty text-muted" data-ui="map.loading">Loading...</div>`;
  else if (!pts.length) body = `<div class="map-empty text-muted" data-ui="map.empty">No locations to show</div>`;
  else {
    let z = Number.isInteger(cfg.zoom) ? cfg.zoom : null, clat, clng;
    if (Array.isArray(cfg.center)) [clat, clng] = cfg.center;
    else { const la = pts.map((p) => p.lat), ln = pts.map((p) => p.lng); clat = (Math.min(...la) + Math.max(...la)) / 2; clng = (Math.min(...ln) + Math.max(...ln)) / 2; }
    if (z === null) { z = 13; for (; z > 2; z--) { const xs = pts.map((p) => mx(p.lng, z)), ys = pts.map((p) => my(p.lat, z)); if (Math.max(...xs) - Math.min(...xs) < W - 160 && Math.max(...ys) - Math.min(...ys) < H - 160) break; } }
    const cx = mx(clng, z), cy = my(clat, z);
    const at = (p) => [Math.round((mx(p.lng, z) - cx + W / 2) / W * 1000) / 10, Math.round((my(p.lat, z) - cy + H / 2) / H * 1000) / 10];
    const markers = pts.map((p) => { const [l, t] = at(p); return `<span class="map-marker" data-ui="map.marker.${p.i}" style="left:${l}%;top:${t}%" title="${esc(p.label)}">${icon('map-pin', 'md')}</span>`; }).join('');
    const pi = cfg.popup ?? spec.data?.popup;
    const pp = pi === undefined ? null : pts.find((p) => p.i === pi || p.label === pi);
    let popup = '';
    if (pp) {
      const [l, t] = at(pp);
      const sub = [pick(pp.r, [cfg.subtitle_field, 'address', 'description', 'status'])].filter((x) => x !== undefined).map((x) => `<div class="map-popup-sub text-muted">${esc(x)}</div>`).join('');
      popup = `<div class="map-popup" data-ui="map.popup" style="left:${l}%;top:${t}%"><div class="map-popup-title">${esc(pp.label)}</div>${sub}<div class="map-popup-coords text-muted"><bdi dir="ltr">${pp.lat.toFixed(4)}, ${pp.lng.toFixed(4)}</bdi></div></div>`;
    }
    body = `<div class="map-box" data-ui="map.canvas" data-zoom="${z}"><svg class="map-tiles" data-ui="map.tiles" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${tiles('t', cx, cy, z)}</svg><div class="map-zoom" data-ui="map.zoom"><span>+</span><span>−</span></div>${markers}${popup}<div class="map-attrib" data-ui="map.attrib">Map tiles</div></div>`;
  }
  const head = viewHead(spec, ctx, { view: 'map', label: cfg.title || undefined });
  return { head, main: `${CSS}<div class="desk-page map-view" data-ui="map.page">${body}</div>`, title };
}
