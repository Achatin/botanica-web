"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, useRef } from "react"
import { MUTATIONS, PLANT_TYPES } from "@/lib/game-data"
import type { Plant, GameState, Mutation, WeatherCondition, Player } from "@/lib/types"
import { calculatePlantValue } from "@/lib/utils"
import { useServer } from "./use-server"
// import { io, Socket } from "socket.io-client"

const GameContext = createContext<GameState | null>(null);

// let socket: Socket;

export function GameProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const [coins, setCoins] = useState(100)
  const [inventory, setInventory] = useState<Record<string, number>>({ carrot: 5, tomato: 2, strawberry: 1 })
  const [plants, setPlants] = useState<Plant[]>([])
  const [draggedPlant, setDraggedPlant] = useState<string | null>(null)

  const { updatePlayerBoard } = useServer();

  const [shop, setShop] = useState<Record<string, number>>({});
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [gameTime, setGameTime] = useState(0);

  useEffect(() => {
    const name = "Achatin";
    const eventSource = new EventSource(`/api/events?clientId=${name}`);

    eventSource.onmessage = (event) => {
      try {
        const data: GameState = JSON.parse(event.data);
        setShop(data.shop);
        setWeather(data.weather);
        setGameTime(data.gameTime);

        updatePlants(data.weather);
      } catch (err) {
        console.error('Error parsing game state:', err);
      }
    };

    eventSource.onerror = () => {
      console.warn('SSE error — closing connection');
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  // useEffect(() => {
  //   socket = io('/', {
  //     path: '/socket.io',
  //     transports: ['websocket'],
  //   });

  //   socket.on('game_state', (state: GameState) => {
  //     setShop(state.shop);
  //     setWeather(state.weather);
  //     setGameTime(state.gameTime);

  //     updatePlants(state.weather);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const loadPlayer = (player: Player) => {
    setId(player.id);
    setCoins(player.coins || 100);
    setInventory(player.inventory || {});

    // socket.emit("update_playerboard", {id: player.id, coins: player.coins});
  };

  const loadPlants = (plants: Plant[]) => {
    setPlants(plants || []);
  };

  const gameStateRef = useRef<{
    coins: number;
    inventory: Record<string, number>;
    plants: Plant[];
  }>({
    coins,
    inventory,
    plants,
  });

  useEffect(() => {
    gameStateRef.current = {
      coins,
      inventory,
      plants,
    };
  }, [coins, inventory, plants]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (id === null) return;
  //     socket.emit("save_player", {
  //       id,
  //       coins: gameStateRef.current.coins,
  //       inventory: gameStateRef.current.inventory,
  //       plants: gameStateRef.current.plants,
  //     });
  //     console.log("Auto-saved to server at", new Date().toLocaleTimeString());
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [id]);

  const getWeight = (minWeight: number, maxWeight: number): number => {
    const chance = Math.random();
    let weight: number;

    if (chance <= 0.025) {
      weight = maxWeight * (1 + Math.random() * 0.1);
    } else {
      weight = minWeight + Math.random() * (maxWeight - minWeight);
    }

    return Math.round(weight * 100) / 100;
  };

  const hasMutation = (mutations: Mutation[], mutationToCheck: Mutation) =>
    mutations.some(m => m.id === mutationToCheck.id);

  const updatePlants = (weather: WeatherCondition | null) => {
    setPlants((prev) =>
      prev.map((plant) => {
        const updatedPlant = { ...plant };

        if (updatedPlant.growthStage < 100) {
          const plantType = PLANT_TYPES[plant.type];
          updatedPlant.growthStage = Math.min(
            100,
            plant.growthStage + 100 / plantType.growthTime
          );
        }

        if (weather && weather.mutation && Math.random() < weather.mutation.chance) {
          if (!hasMutation(updatedPlant.mutations, weather.mutation))
            updatedPlant.mutations.push(weather.mutation);
        }

        if (updatedPlant.growthStage < 100) {
          const growthMutations: Mutation[] = Object.values(MUTATIONS).filter(
            (mutation) => mutation.type === "growth"
          );
          growthMutations.forEach((mutation) => {
            if (Math.random() < mutation.chance)
              if (!hasMutation(updatedPlant.mutations, mutation))
                updatedPlant.mutations.push(mutation);
          });
        }

        return updatedPlant;
      })
    );
  };

  const plantSeed = (plantType: string, x: number, y: number) => {
    if (inventory[plantType] > 0) {
      const newPlant: Plant = {
        id: Date.now().toString(),
        type: plantType,
        x,
        y,
        growthStage: 0,
        weight: getWeight(PLANT_TYPES[plantType].minWeight, PLANT_TYPES[plantType].maxWeight),
        mutations: [],
        plantedAt: gameTime,
      };

      setPlants((prev) => [...prev, newPlant]);
      setInventory((prev) => ({ ...prev, [plantType]: prev[plantType] - 1 }));
      return true;
    }
    return false;
  };

  const harvestPlant = (plantId: string) => {
    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    const value = calculatePlantValue(plant);

    setCoins((prev) => {
      const updated = prev + value;
      if (id) updatePlayerBoard(id, updated);
      return updated;
    });

    setPlants((prev) => prev.filter((p) => p.id !== plantId));
  };

  const buySeeds = (plantType: string, amount: number) => {
    const plantData = PLANT_TYPES[plantType];
    const totalCost = plantData.cost * amount;

    if (coins >= totalCost && shop[plantType] >= amount) {
      setCoins((prev) => {
        const updated = prev - totalCost;
        if (id) updatePlayerBoard(id, updated);
        return updated;
      });
      

      setInventory((prev) => ({ ...prev, [plantType]: (prev[plantType] || 0) + amount }));
      setShop((prev) => ({ ...prev, [plantType]: prev[plantType] - amount }));
      return true;
    }
    return false;
  };

  return (
    <GameContext.Provider
      value={{
        id,
        coins,
        inventory,
        plants,
        shop,
        weather,
        gameTime,
        draggedPlant,
        setDraggedPlant,
        plantSeed,
        harvestPlant,
        buySeeds,
        updatePlants,
        loadPlayer,
        loadPlants
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGameState must be used within GameProvider")
  }
  return context
}
