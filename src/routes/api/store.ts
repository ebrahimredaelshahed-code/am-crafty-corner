import { createFileRoute } from "@tanstack/react-router";

import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, type Product, type Settings } from "@/lib/store";

type D1Result = { results?: Record<string, unknown>[] };
type D1Database = {
  prepare: (query: string) => {
    bind: (...values: unknown[]) => {
      all: <T = D1Result>() => Promise<T>;
      run: () => Promise<unknown>;
    };
    all: <T = D1Result>() => Promise<T>;
    run: () => Promise<unknown>;
  };
};

async function getDatabase() {
  try {
    const cloudflare = await import("cloudflare:workers");
    return (cloudflare.env as { DB?: D1Database }).DB;
  } catch {
    return undefined;
  }
}

async function ensureDatabase(db: D1Database) {
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS store_data (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)",
    )
    .run();
}

async function readStore(db: D1Database) {
  await ensureDatabase(db);
  const result = await db.prepare("SELECT key, value FROM store_data").all<D1Result>();
  const data = Object.fromEntries(
    (result.results ?? []).map((row) => [row.key, JSON.parse(String(row.value))]),
  ) as { products?: Product[]; settings?: Settings };

  if (!data.products) await writeValue(db, "products", DEFAULT_PRODUCTS);
  if (!data.settings) await writeValue(db, "settings", DEFAULT_SETTINGS);

  return {
    products: data.products ?? DEFAULT_PRODUCTS,
    settings: data.settings ?? DEFAULT_SETTINGS,
  };
}

async function writeValue(db: D1Database, key: string, value: unknown) {
  await db
    .prepare(
      "INSERT INTO store_data (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    )
    .bind(key, JSON.stringify(value))
    .run();
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
        const db = await getDatabase();
        if (!db) return Response.json({ error: "Database is not configured" }, { status: 503 });
        return Response.json(await readStore(db), {
          headers: { "cache-control": "no-store" },
        });
      },
      PUT: async ({ request }) => {
        const db = await getDatabase();
        if (!db) return Response.json({ error: "Database is not configured" }, { status: 503 });
        const body = (await parseJson(request)) as { products?: Product[]; settings?: Settings } | null;
        if (!body || (!body.products && !body.settings)) {
          return Response.json({ error: "Invalid store payload" }, { status: 400 });
        }
        await ensureDatabase(db);
        if (body.products) await writeValue(db, "products", body.products);
        if (body.settings) await writeValue(db, "settings", body.settings);
        return Response.json({ ok: true });
      },
    },
  },
});

