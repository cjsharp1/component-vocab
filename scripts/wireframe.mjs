// Draw wireframe SVGs from a compact spec. No dependencies.
//
//   node scripts/wireframe.mjs <slug> [<slug> ...]
//
// Reads wireframes/<slug>/spec.json and writes default.svg, thumbnail.svg and
// variation-N.svg beside it, using the wireframe classes in css/site.css.
// Shapes with a "label" get a hover target and a label group directly after
// it (the contract js/main.js relies on). Labels are placed above or below
// the shape and kept inside the viewBox.
//
// spec.json:
// {
//   "default":    { "height": 350, "shapes": [ ... ] },        // 800 wide
//   "thumbnail":  { "shapes": [ ... ] },                         // 250 x 80, no labels
//   "variations": [ { "height": 200, "shapes": [ ... ] }, ... ] // 400 wide
// }
// Shapes:
//   { "type": "region" | "media" | "interactive" | "optional" | "filled", "x", "y", "w", "h", "rx"?, "label"?, "at"? }
//   { "type": "circle", "cx", "cy", "r", "style"?: "interactive"|"media"|"region"|"filled", "label"?, "at"? }
//   { "type": "chevron", "x", "y", "w", "h", "dir"?: "right"|"down"|"left"|"up", "label"?, "at"? }
//                                                                          disclosure chevron in an interactive stroke
//   { "type": "path", "x", "y", "w", "h", "d", "style"?: "interactive"|"region"|"media", "label"?, "at"? }
//                                                                          small icon glyph; x/y/w/h is its hover box
//   { "type": "line", "x", "y", "w", "weight"?: 1|2, "label"?, "at"? }      text placeholder
//   { "type": "lines", "x", "y", "w", "count", "gap"?: 15, "label"? }       stacked text lines (last one shorter)
//   { "type": "text", "x", "y", "value", "size"?: 12, "anchor"?: "start"|"middle"|"end" }
// "at": "above" (default) or "below" places the label. "filled" draws an
// interactive-colored solid shape (a selected state).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const r = n => Math.round(n * 10) / 10;
const attrs = o => Object.entries(o).filter(([, v]) => v != null).map(([k, v]) => `${k}="${v}"`).join(' ');

function bbox(s) {
  switch (s.type) {
    case 'circle': return { x: s.cx - s.r, y: s.cy - s.r, w: 2 * s.r, h: 2 * s.r };
    case 'line': return { x: s.x, y: s.y - 6, w: s.w, h: 12 };
    case 'lines': return { x: s.x, y: s.y - 6, w: s.w, h: (s.count - 1) * (s.gap ?? 15) + 12 };
    case 'text': return { x: s.x - 10, y: s.y - 12, w: 20, h: 16 };
    default: return { x: s.x, y: s.y, w: s.w, h: s.h };
  }
}

function shapeSvg(s, thumb) {
  const cls = { region: 'region', media: 'media-placeholder', interactive: 'interactive', optional: 'optional' };
  switch (s.type) {
    case 'region': case 'media': case 'interactive': case 'optional':
      return `<rect ${attrs({ class: cls[s.type], x: s.x, y: s.y, width: s.w, height: s.h, rx: s.rx })} />`;
    case 'filled':
      return `<rect ${attrs({ class: 'interactive', x: s.x, y: s.y, width: s.w, height: s.h, rx: s.rx, style: 'fill: var(--wireframe-interactive); fill-opacity: 0.85' })} />`;
    case 'chevron': {
      // Open polyline inside the w x h box; the box is the hover target.
      const { x, y, w, h } = s;
      const pts = {
        right: [[0.3, 0.15], [0.7, 0.5], [0.3, 0.85]],
        left: [[0.7, 0.15], [0.3, 0.5], [0.7, 0.85]],
        down: [[0.15, 0.3], [0.5, 0.7], [0.85, 0.3]],
        up: [[0.15, 0.7], [0.5, 0.3], [0.85, 0.7]],
      }[s.dir ?? 'right'];
      if (!pts) throw new Error(`unknown chevron dir ${s.dir}`);
      return `<polyline ${attrs({ class: 'interactive', points: pts.map(([px, py]) => `${r(x + px * w)},${r(y + py * h)}`).join(' '), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })} />`;
    }
    case 'path': {
      const style = s.style ?? 'interactive';
      return `<path ${attrs({ class: cls[style] ?? style, d: s.d, fill: style === 'interactive' ? null : 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })} />`;
    }
    case 'circle': {
      const style = s.style ?? 'interactive';
      if (style === 'filled') return `<circle ${attrs({ class: 'interactive', cx: s.cx, cy: s.cy, r: s.r, style: 'fill: var(--wireframe-interactive)' })} />`;
      return `<circle ${attrs({ class: cls[style] ?? style, cx: s.cx, cy: s.cy, r: s.r })} />`;
    }
    case 'line':
      return thumb
        ? `<rect ${attrs({ class: 'text-line', x: s.x, y: s.y - 2, width: s.w, height: s.weight === 1 ? 3 : 5 })} />`
        : `<line ${attrs({ class: 'text-line', x1: s.x, y1: s.y, x2: s.x + s.w, y2: s.y, 'stroke-width': s.weight === 1 ? 1 : null, opacity: s.weight === 1 ? 0.7 : null })} />`;
    case 'lines': {
      const gap = s.gap ?? 15;
      return Array.from({ length: s.count }, (_, i) => shapeSvg({ type: 'line', x: s.x, y: s.y + i * gap, w: i === s.count - 1 && s.count > 1 ? r(s.w * 0.7) : s.w }, thumb)).join('\n');
    }
    case 'text':
      return `<text ${attrs({ x: s.x, y: s.y, 'font-size': s.size ?? 12, 'text-anchor': s.anchor ?? 'middle' })}>${s.value}</text>`;
    default:
      throw new Error(`unknown shape type ${s.type}`);
  }
}

function labelSvg(s, width, height) {
  const b = bbox(s);
  const textW = Math.max(40, s.label.length * 7 + 16);
  const cx = b.x + b.w / 2;
  let below = s.at === 'below';
  // Keep the label inside the viewBox: flip side if there's no room.
  if (!below && b.y - 34 < 0) below = true;
  if (below && b.y + b.h + 34 > height) below = false;
  const lineFrom = below ? b.y + b.h + 2 : b.y - 2;
  const lineTo = below ? lineFrom + 12 : lineFrom - 12;
  const boxY = below ? lineTo : lineTo - 20;
  const boxX = Math.min(Math.max(2, cx - textW / 2), width - textW - 2);
  return [
    `<rect ${attrs({ class: 'hover-target', x: r(b.x), y: r(b.y), width: r(b.w), height: r(b.h), fill: 'none', stroke: 'none', style: 'cursor:pointer' })} />`,
    `<g class="label-group">`,
    `  <line ${attrs({ class: 'label-line', x1: r(cx), y1: r(lineFrom), x2: r(cx), y2: r(lineTo) })} />`,
    `  <rect ${attrs({ class: 'label-bg', x: r(boxX), y: r(boxY), width: textW, height: 20 })} />`,
    `  <text ${attrs({ class: 'label-text', x: r(boxX + textW / 2), y: r(boxY + 14), 'text-anchor': 'middle' })}>${s.label}</text>`,
    `</g>`,
  ].join('\n');
}

export function render(view, width, height, { thumb = false } = {}) {
  const body = view.shapes.flatMap(s => (s.label && !thumb ? [labelSvg(s, width, height), shapeSvg(s, thumb)] : [shapeSvg(s, thumb)]));
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n${body.join('\n').split('\n').map(l => '  ' + l).join('\n')}\n</svg>\n`;
}

export function drawComponent(root, slug) {
  const dir = join(root, 'wireframes', slug);
  const spec = JSON.parse(readFileSync(join(dir, 'spec.json'), 'utf8'));
  const written = [];
  const write = (name, svg) => { writeFileSync(join(dir, name), svg); written.push(`wireframes/${slug}/${name}`); };
  if (spec.default) write('default.svg', render(spec.default, 800, spec.default.height ?? 350));
  if (spec.thumbnail) write('thumbnail.svg', render(spec.thumbnail, 250, 80, { thumb: true }));
  (spec.variations || []).forEach((v, i) => write(`variation-${i + 1}.svg`, render(v, 400, v.height ?? 200)));
  return written;
}

const slugs = process.argv.slice(2);
if (slugs.length) for (const slug of slugs) console.log(drawComponent(process.cwd(), slug).join('\n'));
