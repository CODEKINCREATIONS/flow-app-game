// Game types

import { Player } from "./auth";

export interface Chest {
  id: number;
  status: "locked" | "unlocked" | "opened";
  code?: string;
  videoUrl?: string;
  unlockedBy?: string;
  unlockedAt?: string;
}

export interface PlayerProgress {
  playerId: string;
  playerName: string;
  riddleAccess: number;
  attempts: number;
  solved: boolean;
}

export interface GameState {
  chests: Chest[];
  currentChest: number | null;
  playerProgress: PlayerProgress[];
  videoUrl?: string;
}

// Player Activity API types
export interface PlayerStats {
  playerName: string;
  boxesSolved: number;
  boxesVisited: number;
  totalBoxes: number;
}

export interface PlayerActivityItem {
  playerName: string;
  activeBox: number;
  attempt: number;
  solved: "Yes" | "No" | string;
}

export interface PlayerActivityData {
  playerStats: PlayerStats;
  playersProgress: PlayerActivityItem[];
}
