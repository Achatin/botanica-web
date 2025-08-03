export interface PlantType {
  id: string;
  name: string;
  cost: number;
  baseValue: number;
  growthTime: number; // in game ticks
  size: { width: number; height: number };
  minWeight: number;
  maxWeight: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  color: string;
}

export interface Mutation {
  id: string;
  name: string;
  description: string;
  type: string;
  valueMultiplier: number;
  chance: number;
  color: string;
}

export interface WeatherCondition {
  id: string;
  name: string;
  description: string;
  mutation: Mutation;
  icon: string;
  backgroundColor: string;
}

export interface Plant {
  id: string;
  type: string;
  x: number;
  y: number;
  growthStage: number; // 0-100
  weight: number;
  mutations: Mutation[];
  plantedAt: number;
}

export interface Player {
  id: string;
  name: string;
  coins: number;
  plants: Plant[];
  inventory: Record<string, number>;
}

// export interface LocalGameState {
//   coins: number;
//   inventory: Record<string, number>;
//   plants: Plant[];
//   draggedPlant: string | null;
//   setDraggedPlant: (plantType: string | null) => void;
//   plantSeed: (plantType: string, x: number, y: number) => boolean;
//   harvestPlant: (plantId: string) => void;
//   buySeeds: (plantType: string, amount: number) => boolean;
//   updatePlants: (plants: Plant[]) => void;
// }

// export interface GlobalGameState {
//   shop: Record<string, number>;
//   weather: WeatherCondition | null;
//   gameTime: number;
// }

export interface GameState {
  id: string | null;
  coins: number;
  inventory: Record<string, number>;
  plants: Plant[];
  shop: Record<string, number>;
  weather: WeatherCondition | null;
  gameTime: number;
  draggedPlant: string | null;
  setDraggedPlant: (plantType: string | null) => void;
  plantSeed: (plantType: string, x: number, y: number) => boolean;
  harvestPlant: (plantId: string) => void;
  buySeeds: (plantType: string, amount: number) => boolean;
  updatePlants: (weather: WeatherCondition) => void;
  loadPlayer: (player: Player) => void;
  loadPlants: (plants: Plant[]) => void;
}
