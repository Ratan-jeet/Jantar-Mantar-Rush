export interface CharacterSkin {
  id: string;
  characterId: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  pantsColor?: string;
  specialGlow?: string;
  unlockedByDefault?: boolean;
  unlockRequirement: string;
}

export type ChallengeObjectiveType =
  | 'collect_constitutions_single_run'
  | 'collect_papers_single_run'
  | 'collect_votes_single_run'
  | 'reach_distance_single_run'
  | 'collect_rtis_single_run';

export interface DailyCivicChallenge {
  id: string;
  title: string;
  category: string;
  description: string;
  objectiveType: ChallengeObjectiveType;
  targetCount: number;
  bonusPoints: number;
  rewardSkinId?: string;
}

export interface ChallengeStatus {
  challenge: DailyCivicChallenge;
  currentRunValue: number;
  targetValue: number;
  isCompleted: boolean;
  isClaimed: boolean;
  timeRemainingFormatted: string;
}
