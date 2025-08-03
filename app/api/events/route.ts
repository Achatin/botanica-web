// app/api/events/route.ts
import { WEATHER_CONDITIONS } from "@/lib/game-data";
import { WeatherCondition } from "@/lib/types";
import { NextRequest } from "next/server";

type Client = {
  id: string;
  writer: WritableStreamDefaultWriter<Uint8Array>;
};

let clients: Client[] = [];
let gameTime: number = 0;
let weather: WeatherCondition | null = WEATHER_CONDITIONS.night;
let shop = {
  carrot: 10,
  tomato: 5,
  strawberry: 2,
  elderStrawberry: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function broadcast(data: any) {
  const encoded = new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
  clients.forEach((client) => {
    client.writer.write(encoded).catch(() => {
      clients = clients.filter((c) => c.id !== client.id);
    });
  });
}

let gameTickStarted = false;
function startGameTick() {
  if (gameTickStarted) return;
  gameTickStarted = true;

  setInterval(() => {
    gameTime += 1;

    // Every 5 minutes (300 ticks), replenish shop
    if (gameTime % 300 === 0) {
      shop = {
        ...shop,
        carrot: Math.min(shop.carrot + 10, 20),
        tomato: Math.min(shop.tomato + 5, 10),
        strawberry: Math.min(shop.strawberry + 2, 5),
        elderStrawberry: Math.random() < 0.1 ? 1 : 0,
      };
    }

    // Random weather update
    if (gameTime % 300 === 0 && Math.random() < 0.5) {
      const options = Object.values(WEATHER_CONDITIONS);
      weather = options[Math.floor(Math.random() * options.length)];
    }

    broadcast({
      gameTime,
      weather,
      shop,
    });
  }, 1000);
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") ?? `anon-${Date.now()}`;

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const client: Client = {
    id: clientId,
    writer,
  };

  console.log(`New client connected: ${client.id}`);
  clients.push(client);
  startGameTick();

  req.signal.addEventListener("abort", () => {
    clients = clients.filter((c) => c.id !== client.id);
    writer.close();
  });

  writer.write(new TextEncoder().encode("retry: 10000\n\n")); // optional retry

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
