export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export type LaneIndex = -1 | 0 | 1;

export type TrackTheme = 'jantar_mantar' | 'connaught_place';

export type CollectibleType = 'exam_paper' | 'constitution' | 'vote' | 'rti_query';

export type PowerUpType = 'hoverboard' | 'super_boots' | 'magnet' | 'double_score' | 'shield';

export interface PowerUpState {
  type: PowerUpType;
  duration: number; // in seconds
  timeLeft: number;
  active: boolean;
}

import { FaceFeatures } from '../three/proceduralFaces';

export interface CharacterInfo {
  id: string;
  name: string;
  category: 'Protester' | 'Journalist' | 'Influencer' | 'Gen-Z';
  role: string;
  tagline: string;
  quote: string;
  bio: string;
  perkDescription: string;
  perkMultiplier: {
    paperBonus?: number;
    scoreMultiplier?: number;
    magnetRangeBonus?: number;
    shieldDurationBonus?: number;
  };
  primaryColor: string;
  accentColor: string;
  features?: FaceFeatures;
}

export interface RunStats {
  score: number;
  distance: number;
  examPapers: number;
  constitutions: number;
  votes: number;
  rtis: number;
  highScore: number;
  causeSupported: string;
}

export interface CivicFact {
  id: string;
  title: string;
  category: 'History' | 'Constitution' | 'NEET & Exam Integrity' | 'Civic Rights';
  text: string;
  sourceOrArticle: string;
}
