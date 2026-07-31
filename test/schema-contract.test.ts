import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildSchema, parse, validate } from 'graphql';
import { Storentia } from '../src/client';

// Contract test: every GraphQL document the SDK emits must validate against the
// live storefront schema. This is what catches SDK/schema drift (bad scalar
// types, renamed fields, wrong response shapes) before it ships.
const SCHEMA_DIR = path.resolve(
  __dirname,
  '../../../backend/storentia-storefront/internal/gql/schema'
);

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.graphql') ? [p] : [];
  });
}

const RESOURCES = [
  'auth', 'products', 'blogs', 'pages', 'collections', 'media',
  'contacts', 'newsletter', 'linksets', 'carts', 'orders',
  'metafields', 'metaobjects',
] as const;

const DUMMY_ID = '00000000-0000-0000-0000-000000000000';

// ponytail: schema lives in the monorepo. When the SDK is consumed standalone
// there is nothing to validate against, so skip rather than fail.
const hasSchema = fs.existsSync(SCHEMA_DIR);

describe.skipIf(!hasSchema)('GraphQL schema contract', () => {
  it('every SDK query validates against the storefront schema', async () => {
    const schema = buildSchema(
      walk(SCHEMA_DIR).map((f) => fs.readFileSync(f, 'utf8')).join('\n')
    );

    const sdk = new Storentia({ clientId: 'x', clientSecret: 'y' });
    const client = (sdk as any).client;
    const captured: { resource: string; method: string; query: string }[] = [];

    let current = { resource: '', method: '' };
    client.graphql = async (query: string) => {
      captured.push({ ...current, query });
      return {};
    };
    client.request = async () => ({});

    for (const rname of RESOURCES) {
      const res = (sdk as any)[rname];
      const proto = Object.getPrototypeOf(res);
      for (const m of Object.getOwnPropertyNames(proto)) {
        if (m === 'constructor' || typeof proto[m] !== 'function') continue;
        client.setCustomerJWT('dummy.jwt'); // auth.logout() clears it mid-loop
        current = { resource: rname, method: m };
        const args = Array.from(
          { length: res[m].length || 2 },
          (_: unknown, i: number) => (i === 0 ? DUMMY_ID : {})
        );
        try { await res[m](...args); } catch { /* arg-shape errors are fine; we only need the doc */ }
      }
    }

    expect(captured.length).toBeGreaterThan(50);

    const failures = captured.flatMap(({ resource, method, query }) => {
      const errors = validate(schema, parse(query)).map((e) => e.message);
      return errors.length ? [`${resource}.${method}: ${errors.join('; ')}`] : [];
    });

    expect(failures).toEqual([]);
  });
});
