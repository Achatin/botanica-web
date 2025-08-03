// lib/matchmaking.ts
const MAX_PLAYERS = 10;
const servers: Record<string, string[]> = {};

export async function assignToServer(socketId: string): Promise<string> {
  for (const [serverId, players] of Object.entries(servers)) {
    if (players.length < MAX_PLAYERS) {
      players.push(socketId);
      return serverId;
    }
  }

  const newServerId = generateServerName();
  servers[newServerId] = [socketId];
  return newServerId;
}

export function removeFromServer(socketId: string): void {
  for (const [serverId, players] of Object.entries(servers)) {
    const index = players.indexOf(socketId);
    if (index !== -1) {
      players.splice(index, 1);
      if (players.length === 0) {
        delete servers[serverId];
      }
      return;
    }
  }
}

const adjectives = [
  "Blooming",
  "Sunny",
  "Lazy",
  "Green",
  "Cozy",
  "Happy",
  "Golden",
  "Peaceful",
  "Misty",
  "Wild",
];

const nouns = [
  "Garden",
  "Patch",
  "Field",
  "Meadow",
  "Nook",
  "Cabin",
  "Terrace",
  "Room",
  "Glade",
  "Yard",
];

export function generateServerName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}
