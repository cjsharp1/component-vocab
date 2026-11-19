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
  const orders = components.map(c => c.data.order).sort((a, b) => a - b);
  orders.forEach((o, i) => { if (o !== i + 1) errors.push(`order values are not 1..${orders.length} without gaps (found ${o} at position ${i + 1})`); });
  return { count: components.length, errors: [...new Set(errors)] };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { count, errors } = validate();
  if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} error(s) in ${count} components`); process.exit(1); }
  console.log(`${count} components valid`);
}
