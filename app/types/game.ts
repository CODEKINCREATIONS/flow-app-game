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
