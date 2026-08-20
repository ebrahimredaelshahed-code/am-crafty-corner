import { createFileRoute } from "@tanstack/react-router";
import { neon } from "@neondatabase/serverless";

import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, type Product, type Settings } from "@/lib/store";

type StoreRow = { key: string; value: Product[] | Settings };

function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

async function ensureDatabase(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS store_data (
      key TEXT PRIMARY KEY NOT NULL,
      value JSONB NOT NULL
    )
  `;
}

async function readStore(sql: ReturnType<typeof neon>) {
  await ensureDatabase(sql);
  const rows = (await sql`SELECT key, value FROM store_data`) as StoreRow[];
  const data = Object.fromEntries(rows.map((row) => [row.key, row.value])) as {
    products?: Product[];
    settings?: Settings;
  };

  if (!data.products) await writeValue(sql, "products", DEFAULT_PRODUCTS);
  if (!data.settings) await writeValue(sql, "settings", DEFAULT_SETTINGS);

  return {
    products: data.products ?? DEFAULT_PRODUCTS,
    settings: data.settings ?? DEFAULT_SETTINGS,
  };
}

async function writeValue(sql: ReturnType<typeof neon>, key: string, value: unknown) {
  await sql`
    INSERT INTO store_data (key, value)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/store")({
  server: {
    handlers: {
      GET: async () => {
        const databaseUrl = getDatabaseUrl();
        if (!databaseUrl) return Response.json({ error: "Database is not configured" }, { status: 503 });
        const sql = neon(databaseUrl);
        return Response.json(await readStore(sql), {
          headers: { "cache-control": "no-store" },
        });
      },
      PUT: async ({ request }) => {
        const databaseUrl = getDatabaseUrl();
        if (!databaseUrl) return Response.json({ error: "Database is not configured" }, { status: 503 });
        const sql = neon(databaseUrl);
        const body = (await parseJson(request)) as { products?: Product[]; settings?: Settings } | null;
        if (!body || (!body.products && !body.settings)) {
          return Response.json({ error: "Invalid store payload" }, { status: 400 });
        }
        await ensureDatabase(sql);
        if (body.products) await writeValue(sql, "products", body.products);
        if (body.settings) await writeValue(sql, "settings", body.settings);
        return Response.json({ ok: true });
      },
    },
  },
});

