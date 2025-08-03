import type { PlantType, WeatherCondition, Mutation } from "./types";

export const PLANT_TYPES: Record<string, PlantType> = {
  carrot: {
    id: "carrot",
    name: "Carrot",
    cost: 10,
    baseValue: 12,
    growthTime: 10, // 10 seconds
    size: { width: 1, height: 1 },
    minWeight: 0.1,
    maxWeight: 5,
    rarity: "common",
    color: "#ff6b35",
  },
  tomato: {
    id: "tomato",
    name: "Tomato",
    cost: 50,
    baseValue: 30,
    growthTime: 30,
    size: { width: 1, height: 1 },
    minWeight: 0.1,
    maxWeight: 3,
    rarity: "uncommon",
    color: "#e74c3c",
  },
  strawberry: {
    id: "strawberry",
    name: "Strawberry",
    cost: 50,
    baseValue: 100,
    growthTime: 120,
    size: { width: 2, height: 1 },
    minWeight: 0.01,
    maxWeight: 2,
    rarity: "rare",
    color: "#e91e63",
  },
  elderStrawberry: {
    id: "elderStrawberry",
    name: "Elder Strawberry",
    cost: 200,
    baseValue: 500,
    growthTime: 200,
    size: { width: 3, height: 2 },
    minWeight: 0.5,
    maxWeight: 10,
    rarity: "legendary",
    color: "#9c27b0",
  },
};

export const MUTATIONS: Record<string, Mutation> = {
  // GROWTH
  golden: {
    id: "golden",
    name: "Golden",
    type: "growth",
    description: "Touched by Midas",
    valueMultiplier: 2,
    chance: 0.001,
    color: "#ffd700",
  },

  rainbow: {
    id: "rainbow",
    name: "Rainbow",
    type: "growth",
    description: "Grew at the edge of a rainbow",
    valueMultiplier: 3,
    chance: 0.0005,
    color: "#ffd700",
  },

  // WEATHER
  moonlit: {
    id: "moonlit",
    name: "Moonlit",
    description: "Blessed by moonlight",
    type: "weather",
    valueMultiplier: 2,
    chance: 0.001,
    color: "#590098",
  },
  sundried: {
    id: "sundried",
    name: "Sundried",
    type: "weather",
    description: "Dried by sun",
    valueMultiplier: 2,
    chance: 0.001,
    color: "#eab308",
  },
  giant: {
    id: "soaked",
    name: "Soaked",
    type: "weather",
    description: "Totally soaked by rain",
    valueMultiplier: 2.5,
    chance: 0.001,
    color: "#4caf50",
  },
  charged: {
    id: "charged",
    name: "Charged",
    type: "weather",
    description: "Charged by storm energy",
    valueMultiplier: 4,
    chance: 0.001,
    color: "#00bcd4",
  },
};

export const WEATHER_CONDITIONS: Record<string, WeatherCondition> = {
  heatWave: {
    id: "heat_wave",
    name: "Heat Wave",
    description: "Extremely sunny weather",
    mutation: MUTATIONS["sundried"],
    icon: "☀️",
    backgroundColor: "from-yellow-200 to-green-100",
  },
  night: {
    id: "night",
    name: "Night",
    description: "Moonlit plants may gain special properties",
    mutation: MUTATIONS["moonlit"],
    icon: "🌙",
    backgroundColor: "from-indigo-500 to-purple-300",
  },
  rainy: {
    id: "rain",
    name: "Rain",
    description: "Plants grow faster in the rain",
    mutation: MUTATIONS["soaked"],
    icon: "🌧️",
    backgroundColor: "from-gray-600 to-blue-400",
  },
  storm: {
    id: "storm",
    name: "Storm",
    description: "Dangerous but high mutation chance",
    mutation: MUTATIONS["charged"],
    icon: "⛈️",
    backgroundColor: "from-gray-800 to-gray-600",
  },
};
