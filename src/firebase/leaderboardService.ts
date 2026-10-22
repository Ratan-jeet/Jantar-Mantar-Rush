import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface LeaderboardRecord {
  id: string;
  playerName: string;
  score: number;
  distance: number;
  examPapers: number;
  constitutions: number;
  votes: number;
  characterName: string;
  civicRank: string;
  createdAt: string;
}

export function calculateCivicRank(score: number, constitutions: number): string {
  if (score >= 20000 || constitutions >= 50) {
    return '🌟 Grand Constitutional Guardian';
  }
  if (score >= 12000) {
    return '🎖️ Chief Civic Sentinel';
  }
  if (score >= 7000) {
    return '📜 Article 19 Defender';
  }
  if (score >= 3000) {
    return '✊ Merit & Transparency Champion';
  }
  return '🌱 Awakening Citizen';
}

// Initial benchmark scores so leaderboard looks populated on first launch
const BENCHMARK_LEADERBOARD: LeaderboardRecord[] = [
  {
    id: 'bench_1',
    playerName: 'Sonam Wangchuk',
    score: 28450,
    distance: 2150,
    examPapers: 52,
    constitutions: 58,
    votes: 46,
    characterName: 'Sonam Wangchuk',
    civicRank: '🌟 Grand Constitutional Guardian',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'bench_2',
    playerName: 'Priya Narayanan',
    score: 21300,
    distance: 1820,
    examPapers: 44,
    constitutions: 51,
    votes: 38,
    characterName: 'Priya Narayanan',
    civicRank: '🌟 Grand Constitutional Guardian',
    createdAt: '2026-10-18T14:30:00Z',
  },
  {
    id: 'bench_3',
    playerName: 'Abhijeet Dipake',
    score: 17850,
    distance: 1540,
    examPapers: 65,
    constitutions: 32,
    votes: 41,
    characterName: 'Abhijeet Dipake',
    civicRank: '🎖️ Chief Civic Sentinel',
    createdAt: '2026-10-19T08:15:00Z',
  },
  {
    id: 'bench_4',
    playerName: 'Saurabh Das',
    score: 15400,
    distance: 1390,
    examPapers: 48,
    constitutions: 29,
    votes: 36,
    characterName: 'Saurabh Das',
    civicRank: '🎖️ Chief Civic Sentinel',
    createdAt: '2026-10-19T11:20:00Z',
  },
  {
    id: 'bench_5',
    playerName: 'Aarav Sharma',
    score: 13900,
    distance: 1280,
    examPapers: 61,
    constitutions: 22,
    votes: 30,
    characterName: 'Aarav Sharma',
    civicRank: '🎖️ Chief Civic Sentinel',
    createdAt: '2026-10-19T16:00:00Z',
  },
];

export async function getTopLeaderboard(maxLimit: number = 10): Promise<LeaderboardRecord[]> {
  const collectionPath = 'leaderboard';
  try {
    const q = query(
      collection(db, collectionPath),
      orderBy('score', 'desc'),
      limit(maxLimit)
    );

    const snapshot = await getDocs(q);
    const results: LeaderboardRecord[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        playerName: data.playerName,
        score: data.score,
        distance: data.distance,
        examPapers: data.examPapers,
        constitutions: data.constitutions,
        votes: data.votes,
        characterName: data.characterName,
        civicRank: data.civicRank,
        createdAt: data.createdAt,
      });
    });

    if (results.length === 0) {
      return BENCHMARK_LEADERBOARD.slice(0, maxLimit);
    }

    // Merge benchmark records if less than 10 to provide full top 10 experience
    if (results.length < maxLimit) {
      const combined = [...results];
      for (const b of BENCHMARK_LEADERBOARD) {
        if (!combined.some((c) => c.playerName === b.playerName) && combined.length < maxLimit) {
          combined.push(b);
        }
      }
      combined.sort((a, b) => b.score - a.score);
      return combined.slice(0, maxLimit);
    }

    return results;
  } catch (err) {
    console.warn('Leaderboard Firestore query fallback to benchmarks:', err);
    return BENCHMARK_LEADERBOARD.slice(0, maxLimit);
  }
}

export async function submitScore(entry: Omit<LeaderboardRecord, 'id'>): Promise<string> {
  const collectionPath = 'leaderboard';
  const entryId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const docRef = doc(db, collectionPath, entryId);
    await setDoc(docRef, {
      playerName: entry.playerName.trim().substring(0, 32),
      score: Math.floor(entry.score),
      distance: Math.floor(entry.distance),
      examPapers: Math.floor(entry.examPapers),
      constitutions: Math.floor(entry.constitutions),
      votes: Math.floor(entry.votes),
      characterName: entry.characterName.substring(0, 48),
      civicRank: entry.civicRank.substring(0, 48),
      createdAt: entry.createdAt,
    });
    return entryId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, collectionPath);
    throw err;
  }
}
