"use client";

import { useState } from "react";
import { useServer } from "@/hooks/use-server";
import { Button } from "./ui/button";
import { useGameState } from "@/hooks/use-game-state";
import { Plant, Player } from "@/lib/types";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  const { serverId } = useServer();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { loadPlayer } = useGameState();
  const { loadPlants } = useGameState();

  const handleStart = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/player/${encodeURIComponent(name.trim())}`);
      if (!res.ok) {
        throw new Error(`Failed to load player: ${res.statusText}`);
      }
      const player: Player = await res.json();
      
      loadPlayer(player);

      const res2 = await fetch(`/api/player/${encodeURIComponent(name.trim())}/plants`);
      if (!res2.ok) {
        throw new Error(`Failed to load plants: ${res2.statusText}`);
      }
      const plants: Plant[] = await res2.json();
      
      loadPlants(plants);

      onStart(); // Proceed to next screen or game state
    } catch (error) {
      alert("Failed to load player");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-screen h-screen bg-gradient-to-b from-sky-200 to-green-100">
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-7xl font-bold mb-8">Botanica</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-80 text-center"
          disabled={loading}
        />
        <Button
          onClick={handleStart}
          disabled={serverId === null || name.trim() === "" || loading}
          size="lg"
        >
          {loading ? "Loading..." : "Play now"}
        </Button>
      </div>
      <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
        © 2025 Botanica. Game made by Achatin. All Rights Reserved.
      </footer>
    </main>
  );
}
