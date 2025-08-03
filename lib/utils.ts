import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Plant } from "./types";
import { PLANT_TYPES } from "./game-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePlantValue(plant: Plant) {
  const grownWeight = plant.weight * (plant.growthStage / 100);

  // Weight-adjusted base value
  let plantValue =
    PLANT_TYPES[plant.type].baseValue +
    PLANT_TYPES[plant.type].baseValue * grownWeight;

  // Apply mutations
  plant.mutations.forEach((mutation) => {
    plantValue *= mutation.valueMultiplier;
  });

  return Math.floor(plantValue);
}
