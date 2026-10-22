import { CharacterSkin, DailyCivicChallenge } from '../types/challenges';

export const CHARACTER_SKINS: CharacterSkin[] = [
  // Priya Skins
  {
    id: 'priya_default',
    characterId: 'priya_advocate',
    name: 'Advocate Classic',
    description: 'Traditional Supreme Court advocate robes with white neckband.',
    primaryColor: '#18181b',
    accentColor: '#fbbf24',
    pantsColor: '#0f172a',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
  {
    id: 'priya_golden_samvidhan',
    characterId: 'priya_advocate',
    name: 'Golden Samvidhan Robes',
    description: 'Imperial gold and amber silk robes commemorating Article 19 sovereignty.',
    primaryColor: '#d97706',
    accentColor: '#fef08a',
    pantsColor: '#78350f',
    specialGlow: '#f59e0b',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Collect 50 Constitutions in a single run.',
  },
  {
    id: 'priya_pil_champion',
    characterId: 'priya_advocate',
    name: 'PIL Rights Champion',
    description: 'Crimson silk coat worn by public interest litigation lawyers.',
    primaryColor: '#991b1b',
    accentColor: '#e2e8f0',
    pantsColor: '#450a0a',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Reach 1,500m distance in a single run.',
  },

  // Aarav Skins
  {
    id: 'aarav_default',
    characterId: 'aarav_student',
    name: 'Campus Aspirant',
    description: 'Standard campus denim and sky-blue tee with study backpack.',
    primaryColor: '#0284c7',
    accentColor: '#f59e0b',
    pantsColor: '#1e293b',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
  {
    id: 'aarav_azadi_merit',
    characterId: 'aarav_student',
    name: 'Azadi Merit Scholar',
    description: 'Tricolor patriotic varsity jacket representing merit and transparent exams.',
    primaryColor: '#ea580c',
    accentColor: '#16a34a',
    pantsColor: '#f8fafc',
    specialGlow: '#f97316',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Collect 60 Exam Papers in a single run.',
  },
  {
    id: 'aarav_vanguard',
    characterId: 'aarav_student',
    name: 'Constitutional Vanguard',
    description: 'Navy blue collegiate blazer with gold emblem and merit insignia.',
    primaryColor: '#1e3a8a',
    accentColor: '#38bdf8',
    pantsColor: '#0f172a',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Collect 20 RTI queries in a single run.',
  },

  // Dev Skins
  {
    id: 'dev_default',
    characterId: 'dev_kisan',
    name: 'Grassroots Volunteer',
    description: 'Earthy green khadi jacket with agrarian orange gamchha.',
    primaryColor: '#16a34a',
    accentColor: '#f97316',
    pantsColor: '#1e293b',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
  {
    id: 'dev_kisan_kranti',
    characterId: 'dev_kisan',
    name: 'Kisan Kranti Leader',
    description: 'Pristine white khadi kurta with rich emerald gamchha and brass buttons.',
    primaryColor: '#f8fafc',
    accentColor: '#15803d',
    pantsColor: '#166534',
    specialGlow: '#22c55e',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Gather 45 Votes in a single run.',
  },

  // Meera Skins
  {
    id: 'meera_default',
    characterId: 'meera_press',
    name: 'Investigative Scribe',
    description: 'Terracotta orange journalist vest with cyan press card lanyard.',
    primaryColor: '#ea580c',
    accentColor: '#38bdf8',
    pantsColor: '#18181b',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
  {
    id: 'meera_midnight_press',
    characterId: 'meera_press',
    name: 'Midnight Press Scribe',
    description: 'Tactical midnight stealth jacket with high-visibility press neon trim.',
    primaryColor: '#09090b',
    accentColor: '#06b6d4',
    pantsColor: '#18181b',
    specialGlow: '#22d3ee',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Reach 1,500m distance in a single run.',
  },

  // Sonam Wangchuk Skins
  {
    id: 'sonam_default',
    characterId: 'sonam_wangchuk',
    name: 'Ladakh Padyatri Goncha',
    description: 'Authentic maroon wool Goncha robe with saffron sash and Tibi sheep-wool cap.',
    primaryColor: '#78350f',
    accentColor: '#f59e0b',
    pantsColor: '#451a03',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
  {
    id: 'sonam_solar_glider',
    characterId: 'sonam_wangchuk',
    name: 'Solar Eco Innovator',
    description: 'Cerulean Himalayan jacket with golden ice-stupa environmental badge.',
    primaryColor: '#0369a1',
    accentColor: '#38bdf8',
    pantsColor: '#0c4a6e',
    specialGlow: '#38bdf8',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Collect 50 Constitutions in a single run.',
  },

  // Abhijeet Dipake Skins
  {
    id: 'abhijeet_default',
    characterId: 'abhijeet_dipake',
    name: 'School Thik Karo Vanguard',
    description: 'Cobalt jacket with "School Thik Karo" inspection clipboard, CJP resilience badge, and red protest band.',
    primaryColor: '#1d4ed8',
    accentColor: '#f59e0b',
    pantsColor: '#1e293b',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
  {
    id: 'abhijeet_cjp_satyagrahi',
    characterId: 'abhijeet_dipake',
    name: 'Cockroach Janta Satyagrahi',
    description: 'Golden-amber and midnight sapphire protest attire commemorating youth resilience and democratic accountability.',
    primaryColor: '#f59e0b',
    accentColor: '#1d4ed8',
    pantsColor: '#0f172a',
    specialGlow: '#f59e0b',
    unlockedByDefault: false,
    unlockRequirement: 'Complete Daily Challenge: Collect 60 Exam Papers in a single run.',
  },

  // Saurabh Das Skins
  {
    id: 'saurabh_default',
    characterId: 'saurabh_das',
    name: 'Investigative Press Coat',
    description: 'Slate overcoat with cyan press credential lanyard and reporter notepad.',
    primaryColor: '#334155',
    accentColor: '#06b6d4',
    pantsColor: '#0f172a',
    unlockedByDefault: true,
    unlockRequirement: 'Default Skin',
  },
];

export const DAILY_CHALLENGES_POOL: DailyCivicChallenge[] = [
  {
    id: 'challenge_constitutions_50',
    title: 'Constitutional Guardian',
    category: 'Sovereignty & Rights',
    description: 'Collect 50 Constitution (Samvidhan) books in a single run to defend Article 19.',
    objectiveType: 'collect_constitutions_single_run',
    targetCount: 50,
    bonusPoints: 5000,
    rewardSkinId: 'priya_golden_samvidhan',
  },
  {
    id: 'challenge_exam_papers_60',
    title: 'Paper Leak Whistleblower',
    category: 'Exam Integrity',
    description: 'Collect 60 Exam Papers in a single run to expose unfair means and demand NTA reforms.',
    objectiveType: 'collect_papers_single_run',
    targetCount: 60,
    bonusPoints: 4500,
    rewardSkinId: 'aarav_azadi_merit',
  },
  {
    id: 'challenge_votes_45',
    title: 'Democracy in Motion',
    category: 'Electoral Voice',
    description: 'Mobilize 45 Democratic Ballots in a single run through Sansad Marg.',
    objectiveType: 'collect_votes_single_run',
    targetCount: 45,
    bonusPoints: 4000,
    rewardSkinId: 'dev_kisan_kranti',
  },
  {
    id: 'challenge_distance_1500',
    title: 'Sansad Marg Marathon',
    category: 'Civic Endurance',
    description: 'Dash 1,500 meters in a single run past Delhi Police barricades without stopping.',
    objectiveType: 'reach_distance_single_run',
    targetCount: 1500,
    bonusPoints: 6000,
    rewardSkinId: 'meera_midnight_press',
  },
  {
    id: 'challenge_rtis_20',
    title: 'RTI Transparency Auditor',
    category: 'Public Accountability',
    description: 'Collect 20 RTI Query letters in a single run to shed sunlight on administrative records.',
    objectiveType: 'collect_rtis_single_run',
    targetCount: 20,
    bonusPoints: 4500,
    rewardSkinId: 'aarav_vanguard',
  },
];

export function getTodayDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns today's deterministic challenge based on current calendar date.
 */
export function getTodayChallenge(d: Date = new Date()): DailyCivicChallenge {
  const dateStr = getTodayDateString(d);
  // Numeric hash of date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_CHALLENGES_POOL.length;
  return DAILY_CHALLENGES_POOL[index];
}

export function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMins}m`;
}

// LocalStorage helpers
const UNLOCKED_SKINS_KEY = 'jantar_rush_unlocked_skins';
const COMPLETED_CHALLENGES_KEY = 'jantar_rush_completed_challenges';

export function getUnlockedSkinIds(): Set<string> {
  const defaultUnlocked = CHARACTER_SKINS.filter((s) => s.unlockedByDefault).map((s) => s.id);
  try {
    const raw = localStorage.getItem(UNLOCKED_SKINS_KEY);
    if (!raw) return new Set(defaultUnlocked);
    const parsed: string[] = JSON.parse(raw);
    return new Set([...defaultUnlocked, ...parsed]);
  } catch {
    return new Set(defaultUnlocked);
  }
}

export function unlockSkin(skinId: string) {
  const current = getUnlockedSkinIds();
  current.add(skinId);
  try {
    localStorage.setItem(UNLOCKED_SKINS_KEY, JSON.stringify(Array.from(current)));
  } catch (err) {
    console.error('Failed to save unlocked skins', err);
  }
}

export function isChallengeCompletedToday(challengeId: string, dateStr: string = getTodayDateString()): boolean {
  try {
    const raw = localStorage.getItem(COMPLETED_CHALLENGES_KEY);
    if (!raw) return false;
    const records: Record<string, string[]> = JSON.parse(raw);
    return records[dateStr]?.includes(challengeId) ?? false;
  } catch {
    return false;
  }
}

export function markChallengeCompletedToday(challengeId: string, dateStr: string = getTodayDateString()) {
  try {
    const raw = localStorage.getItem(COMPLETED_CHALLENGES_KEY);
    const records: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    if (!records[dateStr]) records[dateStr] = [];
    if (!records[dateStr].includes(challengeId)) {
      records[dateStr].push(challengeId);
    }
    localStorage.setItem(COMPLETED_CHALLENGES_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save completed challenges', err);
  }
}
