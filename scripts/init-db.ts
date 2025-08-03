import { getDb } from "../lib/db.ts";

async function init() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      coins INTEGER NOT NULL,
      inventory TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plants (
      id TEXT PRIMARY KEY,
      playerId TEXT NOT NULL,
      type TEXT NOT NULL,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      growthStage INTEGER NOT NULL,
      weight REAL NOT NULL,
      mutations TEXT NOT NULL,
      plantedAt INTEGER NOT NULL
    );
  `);
  console.log("✅ DB initialized");
}

init();
