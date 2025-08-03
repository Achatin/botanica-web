import { getDb } from "../db.ts";

export async function getPlayerById(id: string) {
  const db = await getDb();
  return db.get<{ id: string; coins: number; inventory: string }>(
    "SELECT * FROM players WHERE id = ?",
    id
  );
}

export async function savePlayer(
  id: string,
  coins: number,
  inventory: Record<string, number>
) {
  const db = await getDb();
  await db.run(
    `
    INSERT INTO players (id, coins, inventory)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET coins = excluded.coins, inventory = excluded.inventory
  `,
    id,
    coins,
    JSON.stringify(inventory)
  );
}
