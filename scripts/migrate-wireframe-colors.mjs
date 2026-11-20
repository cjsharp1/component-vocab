#!/usr/bin/env node
// One-shot: replace hard-coded fill/stroke hex colors in wireframes/*.svg with
// theme classes / CSS variables. Keeps deliberate #fff exceptions (text and
// glyphs on filled shapes). Run from repo root:
//   node scripts/migrate-wireframe-colors.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ACCENT = new Set(['#4a90d9', '#0066cc', '#4caf50', '#0a0', '#f5a623']);
const TRACK_FILL = new Set(['#e0e0e0', '#ddd', '#ccc', '#f5f5f5', '#aaa']);
const BORDER = new Set(['#999', '#ccc', '#ddd', '#e0e0e0', '#aaa']);
const DARK_FILL = new Set(['#333', '#666', '#999']);
const INK = new Set(['#333', '#666', '#999', '#ccc', '#0a0', '#f5a623', '#0066cc', '#4a90d9']);
const KEEP_HEX = new Set(['#fff', '#ffffff']);

const norm = c => c.toLowerCase();

function addClass(attrs, cls) {
  const m = attrs.match(/\bclass="([^"]*)"/);
  if (m) {
    const parts = new Set(m[1].split(/\s+/).filter(Boolean));
    parts.add(cls);
    return attrs.replace(/\bclass="[^"]*"/, `class="${[...parts].join(' ')}"`);
  }
  return ` class="${cls}"` + attrs;
}

function dropAttr(attrs, name) {
  return attrs.replace(new RegExp(`\\s*${name}="[^"]*"`, 'g'), '');
}

function rewriteStyle(style) {
  let s = style;
  s = s.replace(/fill\s*:\s*#0066cc\b/gi, 'fill: var(--wireframe-interactive)');
  s = s.replace(/fill\s*:\s*#4a90d9\b/gi, 'fill: var(--wireframe-interactive)');
  s = s.replace(/fill\s*:\s*#4caf50\b/gi, 'fill: var(--wireframe-interactive)');
  s = s.replace(/stroke\s*:\s*#0066cc\b/gi, 'stroke: var(--wireframe-interactive)');
  s = s.replace(/stroke\s*:\s*#4a90d9\b/gi, 'stroke: var(--wireframe-interactive)');
  s = s.replace(/stroke\s*:\s*#fff\b/gi, 'stroke: var(--wireframe-label-text)');
  s = s.replace(/stroke\s*:\s*#333\b/gi, 'stroke: var(--wireframe-interactive)');
  s = s.replace(/stroke\s*:\s*#666\b/gi, 'stroke: var(--wireframe-interactive)');
  return s;
}

function transformOpenTag(full, tag, attrs) {
  let a = attrs;
  const styleM = a.match(/\bstyle="([^"]*)"/);
  if (styleM) {
    const next = rewriteStyle(styleM[1]);
    if (next !== styleM[1]) a = a.replace(styleM[0], `style="${next}"`);
  }

  // rgba overlays → scrim (keep very faint panels as region-ish track)
  if (/\bfill="rgba\(0,\s*0,\s*0,\s*0\.0[2-5]\)"/i.test(a)) {
    a = dropAttr(a, 'fill');
    a = addClass(a, 'track');
    if (/\bstroke="#(ccc|ddd|999|e0e0e0)"/i.test(a)) a = dropAttr(a, 'stroke');
  } else if (/\bfill="rgba\(0,\s*0,\s*0,\s*0\.[2-6]\)"/i.test(a)) {
    a = dropAttr(a, 'fill');
    a = addClass(a, 'scrim');
  } else if (/\bfill="rgba\(255,\s*255,\s*255,\s*0\.[1-4]\)"/i.test(a)) {
    a = dropAttr(a, 'fill');
    a = a.replace(/\bstyle="([^"]*)"/, (_, s) => `style="${s}; fill: var(--wireframe-label-text); fill-opacity: 0.25"`);
    if (!/\bstyle=/.test(a)) a += ' style="fill: var(--wireframe-label-text); fill-opacity: 0.25"';
  }

  const fillM = a.match(/\bfill="(#[0-9a-fA-F]{3,8})"/);
  const strokeM = a.match(/\bstroke="(#[0-9a-fA-F]{3,8})"/);
  const fill = fillM ? norm(fillM[1]) : null;
  const stroke = strokeM ? norm(strokeM[1]) : null;

  if (tag === 'text') {
    if (fill && !KEEP_HEX.has(fill)) a = dropAttr(a, 'fill');
    // keep #fff
    return `<${tag}${a}>`;
  }

  // Fills
  if (fill && KEEP_HEX.has(fill)) {
    // deliberate white fill on shapes — keep
  } else if (fill && ACCENT.has(fill)) {
    a = dropAttr(a, 'fill');
    a = addClass(a, 'filled');
    if (stroke && KEEP_HEX.has(stroke)) {
      // status dot with white ring: keep stroke="#fff"
    } else if (stroke && BORDER.has(stroke)) {
      a = dropAttr(a, 'stroke');
    }
  } else if (fill && TRACK_FILL.has(fill)) {
    a = dropAttr(a, 'fill');
    a = addClass(a, 'track');
    if (stroke && BORDER.has(stroke)) a = dropAttr(a, 'stroke');
  } else if (fill && DARK_FILL.has(fill)) {
    a = dropAttr(a, 'fill');
    a = addClass(a, 'inverse');
    if (stroke && BORDER.has(stroke)) a = dropAttr(a, 'stroke');
  }

  // Strokes (after fill handling; re-read). Keep #fff as a deliberate exception
  // (glyphs / rings on filled shapes), same as fill="#fff" on text.
  const strokeM2 = a.match(/\bstroke="(#[0-9a-fA-F]{3,8})"/);
  const stroke2 = strokeM2 ? norm(strokeM2[1]) : null;
  if (stroke2 && KEEP_HEX.has(stroke2)) {
    // leave stroke="#fff"
  } else if (stroke2 && ACCENT.has(stroke2)) {
    a = dropAttr(a, 'stroke');
    a = addClass(a, 'interactive');
  } else if (stroke2 && (stroke2 === '#333' || stroke2 === '#666')) {
    // Dark ink strokes (pagination arrows, etc.) → interactive for contrast
    a = dropAttr(a, 'stroke');
    a = addClass(a, 'interactive');
  } else if (stroke2 && BORDER.has(stroke2)) {
    a = a.replace(/\bstroke="#[^"]*"/, 'stroke="var(--wireframe-border)"');
  }

  return `<${tag}${a}>`;
}

function transformSvg(text) {
  return text.replace(/<(rect|circle|ellipse|line|path|polyline|polygon|text)(\s[^>]*)?(\/?)>/g, (full, tag, attrs = '', close = '') => {
    if (!attrs) return full;
    if (!/#|rgba\(/i.test(attrs)) return full;
    // attrs may include a trailing " /" from self-closing tags matched loosely
    const cleaned = attrs.replace(/\s*\/$/, '');
    const out = transformOpenTag(full, tag, cleaned);
    if (close === '/' && !out.endsWith('/>')) return out.replace(/>$/, ' />');
    return out;
  });
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.svg')) out.push(p);
  }
  return out;
}

const files = walk('wireframes');
let changed = 0;
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = transformSvg(before);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`Updated ${changed} of ${files.length} SVGs`);
