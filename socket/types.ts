import type { Plant } from "../lib/types";

export interface SavePlayerPayload {
  id: string;
  coins: number;
  inventory: Record<string, number>;
  plants: Plant[];
}
