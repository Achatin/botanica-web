// socket/handlers.ts
import type { Socket } from "socket.io";
import { getPlayerById, savePlayer } from "../lib/queries/player.ts";
import {
  getPlantsForPlayer,
  savePlantsForPlayer,
} from "../lib/queries/plant.ts";
import type { SavePlayerPayload } from "./types.ts";

export function registerGameSocketHandlers(socket: Socket) {
  socket.on("load_player", async (playerId: string) => {
    const player = await getPlayerById(playerId);
    const plants = await getPlantsForPlayer(playerId);

    socket.emit("load_player_response", {
      coins: player?.coins ?? 100,
      inventory: player
        ? JSON.parse(player.inventory)
        : { carrot: 5, tomato: 2, strawberry: 1 },
      plants,
    });
  });

  socket.on("save_player", async (data: SavePlayerPayload) => {
    const { id, coins, inventory, plants } = data;

    await savePlayer(id, coins, inventory);
    await savePlantsForPlayer(id, plants);
  });
}
