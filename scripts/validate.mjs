// Validate data/components/*.json against data/schema.json, plus cross-file
// rules a schema can't express. No dependencies: implements the subset of
// JSON Schema the project uses (type, enum, required, properties,
// additionalProperties, items, pattern, minLength, minimum).
// Usage: node scripts/validate.mjs   (exit code 1 on any error)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const typeOf = v => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v);
const typeMatches = (v, t) => t === typeOf(v) || (t === 'number' && typeof v === 'number');

export function checkSchema(value, schema, path = '$', errors = []) {
  if (schema.type) {
    const types = [].concat(schema.type);
    if (!types.some(t => typeMatches(value, t))) { errors.push(`${path}: expected ${types.join('|')}, got ${typeOf(value)}`); return errors; }
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in ${JSON.stringify(schema.enum)}`);
  if (typeof value === 'string') {
    if (schema.minLength != null && value.length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: "${value}" does not match ${schema.pattern}`);
  }
  if (typeof value === 'number' && schema.minimum != null && value < schema.minimum) errors.push(`${path}: below ${schema.minimum}`);
  if (typeOf(value) === 'object') {
    for (const key of schema.required || []) if (!(key in value)) errors.push(`${path}: missing "${key}"`);
    for (const [key, v] of Object.entries(value)) {
      if (schema.properties?.[key]) checkSchema(v, schema.properties[key], `${path}.${key}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected "${key}"`);
      else if (typeof schema.additionalProperties === 'object') checkSchema(v, schema.additionalProperties, `${path}.${key}`, errors);
    }
  }
  if (Array.isArray(value) && schema.items) value.forEach((v, i) => checkSchema(v, schema.items, `${path}[${i}]`, errors));
  return errors;
}

export function loadComponents(root = process.cwd()) {
  const dir = join(root, 'data/components');
  return readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(file => ({ file, data: JSON.parse(readFileSync(join(dir, file), 'utf8')) }));
}

export function validate(root = process.cwd()) {
  const schema = JSON.parse(readFileSync(join(root, 'data/schema.json'), 'utf8'));
  const components = loadComponents(root);
  const errors = [];
  const seen = { slug: new Map(), name: new Map(), order: new Map() };
  for (const { file, data } of components) {
    for (const e of checkSchema(data, schema)) errors.push(`${file} ${e}`);
    if (file !== `${data.slug}.json`) errors.push(`${file}: slug "${data.slug}" does not match file name`);
    for (const key of Object.keys(seen)) {
      if (data[key] == null) continue;
      const k = String(data[key]).toLowerCase();
      if (seen[key].has(k)) errors.push(`${file}: duplicate ${key} "${data[key]}" (also in ${seen[key].get(k)})`);
      else seen[key].set(k, file);
    }
    const files = [data.wireframe, data.thumbnail, ...(data.variants || []).map(v => v.wireframe), ...(data.collections || []).map(c => c.wireframe)].filter(Boolean);
    for (const f of files) if (!existsSync(join(root, f))) errors.push(`${file}: missing wireframe file ${f}`);
  }
  // Each alias belongs to one component and never shadows a canonical name.
  const names = new Map(components.map(c => [c.data.name.toLowerCase(), c.data.name]));
  const aliasOwner = new Map();
  for (const { data } of components) {
    for (const alias of data.aliases || []) {
      const k = alias.toLowerCase();
      if (names.has(k) && names.get(k) !== data.name) errors.push(`${data.slug}.json: alias "${alias}" is the name of another component`);
      if (aliasOwner.has(k) && aliasOwner.get(k) !== data.name) errors.push(`${data.slug}.json: alias "${alias}" is also an alias of ${aliasOwner.get(k)}`);
      aliasOwner.set(k, data.name);
    }
  }
  // Stable pages need content; drafts must not pretend to have it.
  const bySlug = new Map(components.map(c => [c.data.slug, c.data]));
  for (const { data } of components) {
    if (data.status === 'stable') {
      if (!data.description) errors.push(`${data.slug}.json: stable component needs a description`);
      if (!data.wireframe || !data.thumbnail) errors.push(`${data.slug}.json: stable component needs a wireframe and thumbnail`);
    }
    (data.variants || []).forEach((v, i) => {
      if (('htmlOutline' in v) === ('sameMarkup' in v)) errors.push(`${data.slug}.json: variants[${i}] ("${v.caption}") needs exactly one of htmlOutline or sameMarkup`);
      else if (v.htmlOutline && v.htmlOutline.trim() === data.htmlOutline?.trim()) errors.push(`${data.slug}.json: variants[${i}] htmlOutline repeats the default; use sameMarkup`);
    });
    if (data.status === 'draft' && (data.wireframe || data.thumbnail || data.variants?.length || data.collections?.length)) {
      errors.push(`${data.slug}.json: draft components carry no wireframes`);
    }
    // Parent/child data must be symmetric and point at real components.
    for (const p of data.parents || []) {
      if (!bySlug.has(p)) errors.push(`${data.slug}.json: parent "${p}" is not a component`);
      else if (!(bySlug.get(p).children || []).includes(data.slug)) errors.push(`${data.slug}.json: lists ${p} as a parent, but ${p} does not list it as a child`);
    }
    for (const ch of data.children || []) {
      if (!bySlug.has(ch)) errors.push(`${data.slug}.json: child "${ch}" is not a component`);
      else if (!(bySlug.get(ch).parents || []).includes(data.slug)) errors.push(`${data.slug}.json: lists ${ch} as a child, but ${ch} does not list it as a parent`);
    }
  }
  // Survey cells: "none" means checked-and-absent; "unchecked" means never checked.
  // frameworkSource "none" must not claim a checked absence. Legacy pages only
  // surveyed Bootstrap, MUI, Ant Design, Apple HIG and shadcn/ui.
  const legacySystems = new Set(['Bootstrap', 'MUI', 'Ant Design', 'Apple HIG', 'shadcn/ui']);
  for (const { data } of components) {
    const names = data.frameworkNames || {};
    for (const [system, v] of Object.entries(names)) {
      const hasName = Object.prototype.hasOwnProperty.call(v, 'name');
      if (v.match === 'none' || v.match === 'unchecked') {
        if (hasName) errors.push(`${data.slug}.json: frameworkNames["${system}"] with match "${v.match}" must not include a name`);
      } else if (!hasName) {
        errors.push(`${data.slug}.json: frameworkNames["${system}"] with match "${v.match}" needs a name`);
      }
    }
    if (data.frameworkSource === 'none') {
      for (const [system, v] of Object.entries(names)) {
        if (v.match === 'none') errors.push(`${data.slug}.json: frameworkSource "none" cannot use match "none" for "${system}" (use "unchecked")`);
        else if (v.match !== 'unchecked') errors.push(`${data.slug}.json: frameworkSource "none" must use match "unchecked" for every system (got "${v.match}" for "${system}")`);
      }
    }
    if (data.frameworkSource === 'legacy') {
      for (const [system, v] of Object.entries(names)) {
        if (!legacySystems.has(system) && v.match === 'none') {
          errors.push(`${data.slug}.json: legacy survey did not cover "${system}"; use match "unchecked" instead of "none"`);
        }
      }
    }
  }
  const orders = components.map(c => c.data.order).sort((a, b) => a - b);
  orders.forEach((o, i) => { if (o !== i + 1) errors.push(`order values are not 1..${orders.length} without gaps (found ${o} at position ${i + 1})`); });
  return { count: components.length, errors: [...new Set(errors)] };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { count, errors } = validate();
  if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} error(s) in ${count} components`); process.exit(1); }
  console.log(`${count} components valid`);
}
