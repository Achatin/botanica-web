import { getDb } from "../db.ts";
import type { Plant } from "../types.ts";

interface PlantRowFromDb extends Omit<Plant, "mutations"> {
  playerId: string;
  mutations: string; // stored as JSON
}

export async function getPlantsForPlayer(playerId: string): Promise<Plant[]> {
  const db = await getDb();
  const rows: PlantRowFromDb[] = await db.all(
    `SELECT * FROM plants WHERE playerId = ?`,
    playerId
  );

  return rows.map((p) => ({
    ...p,
    mutations: JSON.parse(p.mutations),
  }));
}

export async function savePlantsForPlayer(playerId: string, plants: Plant[]) {
  const db = await getDb();

  await db.run(`DELETE FROM plants WHERE playerId = ?`, playerId);

  const insertStmt = `
    INSERT INTO plants (id, playerId, type, x, y, growthStage, weight, mutations, plantedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const plant of plants) {
    await db.run(
      insertStmt,
      plant.id,
      playerId,
      plant.type,
      plant.x,
      plant.y,
      plant.growthStage,
      plant.weight,
      JSON.stringify(plant.mutations),
      plant.plantedAt
    );
  }
}
