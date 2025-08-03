// server.ts
import next from "next";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { assignToServer, removeFromServer } from "./lib/matchmaking.ts";
import type { Player } from "./lib/types.ts";
import { WEATHER_CONDITIONS } from "./lib/game-data.ts";
import type { WeatherCondition } from "./lib/types.ts";

// Import your socket handlers
import { registerGameSocketHandlers } from "./socket/handlers.ts";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();
const players: Player[] = [];

// GLOBAL GAME STATE
let gameTime = 0;
let weather: WeatherCondition | null = null;
let shop = {
  carrot: 10,
  tomato: 5,
  strawberry: 2,
  elderStrawberry: 0,
};

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handler(req, res));
  const io = new IOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
    },
  });

  // Use your existing logic for matchmaking and player management
  io.on("connection", async (socket) => {
    const serverId = await assignToServer(socket.id);
    socket.join(serverId);
    socket.emit("server_id", serverId);

    // Register handlers
    registerGameSocketHandlers(socket);

    socket.on(
      "update_playerboard",
      ({ id, coins }: { id: string; coins: number }) => {
        const player: Player | undefined = players.find((p) => p.id === id);

        if (player) {
          player.coins = coins;
        } else {
          players.push({
            id,
            name: "Tester",
            coins: coins ?? 100,
            plants: [],
            inventory: {},
          });
        }

        io.to(serverId).emit("sync", players);
      }
    );

    socket.on("disconnect", () => {
      removeFromServer(socket.id);
      const index = players.findIndex((p) => p.id === socket.id);
      if (index !== -1) players.splice(index, 1);
      io.to(serverId).emit("sync", players);
    });

    socket.on("chat", (msg) => {
      io.to(serverId).emit("chat", { id: socket.id, msg });
    });
  });

  // Game tick and broadcast logic
  setInterval(() => {
    gameTime += 1;

    if (gameTime % 300 === 0) {
      shop = {
        ...shop,
        carrot: Math.min(shop.carrot + 10, 20),
        tomato: Math.min(shop.tomato + 5, 10),
        strawberry: Math.min(shop.strawberry + 2, 5),
        elderStrawberry: Math.random() < 0.1 ? 1 : 0,
      };
    }

    if (gameTime % 300 === 0 && Math.random() < 0.5) {
      const options = Object.values(WEATHER_CONDITIONS);
      weather = options[Math.floor(Math.random() * options.length)];
    }

    io.emit("game_state", {
      gameTime,
      weather,
      shop,
    });
  }, 1000);

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () =>
    console.log(`> Ready on http://localhost:${PORT}`)
  );
});
