// One-off migration (Phase 7).
//   node scripts/legacy/properties.mjs --fill       add research fields (native HTML,
//                                                   ARIA, note, framework notes) to existing pages
//   node scripts/legacy/properties.mjs --batch N    add draft batch N (1-based, ~10 each)
// Drafts carry only facts from the research list and the CSV: no description,
// wireframe or usage notes are invented. Re-orders all components afterwards.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dir = join(root, 'data/components');
const args = process.argv.slice(2);
const csvText = readFileSync(join(root, 'docs/research/framework-alignment.csv'), 'utf8');

function parseCsv(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (ch === '"') q = false; else field += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(field); field = ''; if (row.some(Boolean)) rows.push(row); row = []; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [h, ...b] = rows;
  return b.map(r => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}
const csv = parseCsv(csvText);
const SYSTEMS = JSON.parse(readFileSync(join(root, 'data/systems.json'), 'utf8'));
const MATCH = { '●': 'same', '◐': 'alias', '○': 'different' };
const groups = JSON.parse(readFileSync(join(root, 'data/groups.json'), 'utf8'));
const letterToGroup = Object.fromEntries(groups.map(g => [g.letter, g.slug]));

// Research section 4 rows, in order.
const research = readFileSync(join(root, 'docs/research/component-vocabulary-and-page-structure.md'), 'utf8');
const s4 = research.split('## 4.')[1].split('## 5.')[0];
const rows = [];
let letter = null;
for (const line of s4.split('\n')) {
  const g = line.match(/^### ([A-I])\. /);
  if (g) { letter = g[1]; continue; }
  const cells = line.split('|').slice(1, -1).map(s => s.trim());
  if (!letter || cells.length < 6 || cells[0] === 'Canonical' || cells[0].startsWith('---')) continue;
  const raw = cells[0].replace(/\*/g, '');
  if (raw === 'Container') continue; // retired (render detail of Section)
  const isSlot = raw.startsWith('Column');
  rows.push({
    name: isSlot ? 'Slot' : raw,
    csvName: raw,
    aliases: [...(isSlot ? ['Column'] : []), ...cells[1].split(',').map(s => s.trim()).filter(Boolean)],
    nativeHtml: cells[3] === '—' ? '' : cells[3],
    aria: cells[4] === '—' ? '' : cells[4],
    note: cells[5],
    group: letterToGroup[letter],
  });
}
const slugify = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const csvFor = name => csv.find(r => r.Canonical.toLowerCase() === name.toLowerCase());
const frameworks = row => Object.fromEntries(SYSTEMS.map(s => {
  const cell = (row?.[s] || '—').trim();
  return [s, cell === '—' || !cell ? { match: 'none' } : { match: MATCH[cell[0]] ?? 'same', name: cell.slice(1).trim() }];
}));
const coverage = row => (row ? SYSTEMS.filter(s => (row[s] || '—').trim() !== '—').length : -1);

const load = () => readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(join(dir, f), 'utf8')));
const save = c => writeFileSync(join(dir, `${c.slug}.json`), JSON.stringify(c, null, 2) + '\n');
const existing = load();
const have = new Set(existing.map(c => c.name.toLowerCase()));

if (args.includes('--fill')) {
  for (const c of existing) {
    const r = rows.find(x => x.name.toLowerCase() === c.name.toLowerCase());
    const cr = csvFor(r?.csvName ?? c.name);
    c.nativeHtml = r?.nativeHtml ?? '';
    c.aria = r?.aria ?? '';
    c.researchNote = r?.note ?? '';
    c.frameworkNotes = cr?.Notes ?? '';
    save(c);
  }
  console.log(`filled research fields for ${existing.length} components`);
}

const missing = rows.filter(r => !have.has(r.name.toLowerCase()));
const first = ['Slot', 'Disclosure'];
const queue = [
  ...first.map(n => missing.find(r => r.name === n)).filter(Boolean),
  ...missing.filter(r => !first.includes(r.name)).sort((a, b) => coverage(csvFor(b.csvName)) - coverage(csvFor(a.csvName))),
];
const bi = args.indexOf('--batch');
if (bi !== -1) {
  const n = Number(args[bi + 1]);
  const all = rows.filter(r => !existing.some(c => c.name.toLowerCase() === r.name.toLowerCase()) || true);
  // Batches are cut from the queue of components that had no page before Phase 7.
  const created = existing.filter(c => c.status === 'draft').length;
  const batch = queue.slice(0, 10);
  for (const r of batch) {
    const cr = csvFor(r.csvName);
    save({
      slug: slugify(r.name),
      name: r.name,
      order: 9999,
      status: 'draft',
      group: r.group,
      description: r.note,
      summary: r.note || 'Draft entry',
      htmlElement: '',
      nativeHtml: r.nativeHtml,
      aria: r.aria,
      researchNote: r.note,
      elements: [],
      configOptions: [],
      variants: [],
      collections: [],
      usageNotes: [],
      related: [],
      aliases: r.aliases.filter(a => a.toLowerCase() !== r.name.toLowerCase()),
      frameworkSource: cr ? 'csv' : 'none',
      frameworkNames: frameworks(cr),
      frameworkNotes: cr?.Notes ?? '',
      parents: [],
      children: [],
    });
  }
  console.log(`batch ${n}: added ${batch.length} drafts (${created} drafts existed): ${batch.map(r => r.name).join(', ')}; ${queue.length - batch.length} still missing`);
}

// Re-order everything: group order, then research order, then additions and group J.
const all = load();
const gi = Object.fromEntries(groups.map((g, i) => [g.slug, i]));
const ri = name => { const i = rows.findIndex(r => r.name.toLowerCase() === name.toLowerCase()); return i === -1 ? 1000 : i; };
const extra = ['description list', 'embed', 'feature', 'testimonial', 'stats', 'logo cloud', 'call to action', 'pricing table'];
const key = c => [gi[c.group], ri(c.name) === 1000 ? 1000 + extra.indexOf(c.name.toLowerCase()) : ri(c.name)];
all.sort((a, b) => { const [ga, ra] = key(a), [gb, rb] = key(b); return ga - gb || ra - rb; });
all.forEach((c, i) => { c.order = i + 1; save(c); });
