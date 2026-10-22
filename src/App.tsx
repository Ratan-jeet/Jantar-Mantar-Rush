import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameEngine } from './three/GameEngine';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { CivicArchiveModal } from './components/CivicArchiveModal';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { testFirestoreConnection } from './firebase/firebase';
import {
  CharacterInfo,
  CollectibleType,
  GameState,
  PowerUpState,
  PowerUpType,
  RunStats,
  TrackTheme,
} from './types/game';
import { CharacterSkin, DailyCivicChallenge } from './types/challenges';
import { CHARACTERS } from './data/charactersAndFacts';
import {
  CHARACTER_SKINS,
  getTodayChallenge,
  isChallengeCompletedToday,
  markChallengeCompletedToday,
  getUnlockedSkinIds,
  unlockSkin,
} from './data/challenges';
import { soundEngine } from './audio/soundEffects';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Daily Civic Challenge & Skins
  const [todayChallenge] = useState<DailyCivicChallenge>(() => getTodayChallenge());
  const [isTodayChallengeCompleted, setIsTodayChallengeCompleted] = useState<boolean>(() =>
    isChallengeCompletedToday(getTodayChallenge().id)
  );
  const [unlockedSkinIds, setUnlockedSkinIds] = useState<Set<string>>(() => getUnlockedSkinIds());

  // Default character & skin
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo>(CHARACTERS[0]);
  const [selectedSkin, setSelectedSkin] = useState<CharacterSkin>(() => {
    return (
      CHARACTER_SKINS.find((s) => s.characterId === CHARACTERS[0].id) || CHARACTER_SKINS[0]
    );
  });

  // High score & settings
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('jantar_rush_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('jantar_rush_muted') === 'true';
  });

  // Game lifecycle
  const [gameState, setGameState] = useState<GameState>('title');
  const [selectedTrack, setSelectedTrack] = useState<TrackTheme>('jantar_mantar');

  // Modals
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState<boolean>(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // In-run HUD states
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [examPapers, setExamPapers] = useState<number>(0);
  const [constitutions, setConstitutions] = useState<number>(0);
  const [votes, setVotes] = useState<number>(0);
  const [rtis, setRtis] = useState<number>(0);
  const [finalStats, setFinalStats] = useState<RunStats | null>(null);
  const [completedChallengeRun, setCompletedChallengeRun] = useState<DailyCivicChallenge | null>(null);
  const [unlockedSkinRun, setUnlockedSkinRun] = useState<CharacterSkin | null>(null);

  const [powerUps, setPowerUps] = useState<Record<PowerUpType, PowerUpState>>({
    hoverboard: { type: 'hoverboard', duration: 15, timeLeft: 0, active: false },
    super_boots: { type: 'super_boots', duration: 12, timeLeft: 0, active: false },
    magnet: { type: 'magnet', duration: 12, timeLeft: 0, active: false },
    double_score: { type: 'double_score', duration: 12, timeLeft: 0, active: false },
    shield: { type: 'shield', duration: 10, timeLeft: 0, active: false },
  });

  // Handle Mute
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      localStorage.setItem('jantar_rush_muted', String(next));
      return next;
    });
  }, []);

  // Initialize GameEngine once
  useEffect(() => {
    soundEngine.setMuted(isMuted);
    testFirestoreConnection().catch(console.error);

    if (!canvasMountRef.current) return;

    const engine = new GameEngine(
      canvasMountRef.current,
      selectedCharacter,
      selectedTrack,
      {
        onScoreUpdate: (currentScore, currentDist) => {
          setScore(currentScore);
          setDistance(currentDist);
        },
        onItemCollected: (type, totalCount) => {
          if (type === 'exam_paper') setExamPapers(totalCount);
          if (type === 'constitution') setConstitutions(totalCount);
          if (type === 'vote') setVotes(totalCount);
          if (type === 'rti_query') setRtis(totalCount);
        },
        onPowerUpUpdate: (pups) => {
          setPowerUps(pups);
        },
        onGameOver: (stats) => {
          // Check if today's Daily Civic Challenge was achieved in this run!
          let achievedCount = 0;
          if (todayChallenge.objectiveType === 'collect_constitutions_single_run') {
            achievedCount = stats.constitutions;
          } else if (todayChallenge.objectiveType === 'collect_papers_single_run') {
            achievedCount = stats.examPapers;
          } else if (todayChallenge.objectiveType === 'collect_votes_single_run') {
            achievedCount = stats.votes;
          } else if (todayChallenge.objectiveType === 'reach_distance_single_run') {
            achievedCount = stats.distance;
          } else if (todayChallenge.objectiveType === 'collect_rtis_single_run') {
            achievedCount = stats.rtis;
          }

          if (achievedCount >= todayChallenge.targetCount && !isTodayChallengeCompleted) {
            markChallengeCompletedToday(todayChallenge.id);
            setIsTodayChallengeCompleted(true);
            stats.score += todayChallenge.bonusPoints;

            let rewardedSkin: CharacterSkin | null = null;
            if (todayChallenge.rewardSkinId) {
              unlockSkin(todayChallenge.rewardSkinId);
              const freshUnlocked = getUnlockedSkinIds();
              setUnlockedSkinIds(freshUnlocked);
              rewardedSkin = CHARACTER_SKINS.find((s) => s.id === todayChallenge.rewardSkinId) || null;
            }

            setCompletedChallengeRun(todayChallenge);
            setUnlockedSkinRun(rewardedSkin);
          } else {
            setCompletedChallengeRun(null);
            setUnlockedSkinRun(null);
          }

          setFinalStats(stats);
          setGameState('gameover');

          if (stats.score > highScore) {
            setHighScore(stats.score);
            localStorage.setItem('jantar_rush_highscore', String(stats.score));
          }
        },
      },
      selectedSkin
    );

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []); // Run once on mount

  // Sync character changes
  const handleSelectCharacter = (char: CharacterInfo) => {
    setSelectedCharacter(char);
    // Find active skin for this character
    const matchingSkin =
      CHARACTER_SKINS.find((s) => s.characterId === char.id && unlockedSkinIds.has(s.id)) ||
      CHARACTER_SKINS.find((s) => s.characterId === char.id) ||
      CHARACTER_SKINS[0];
    setSelectedSkin(matchingSkin);

    if (engineRef.current) {
      engineRef.current.setCharacter(char, matchingSkin);
    }
  };

  // Sync skin selection
  const handleSelectSkin = (skin: CharacterSkin) => {
    setSelectedSkin(skin);
    if (engineRef.current) {
      engineRef.current.setSkin(skin);
    }
  };

  const handleSelectTrack = (track: TrackTheme) => {
    setSelectedTrack(track);
    if (engineRef.current) {
      engineRef.current.setTrackTheme(track);
    }
  };

  // Calculate live in-game challenge progress
  let currentChallengeValue = 0;
  if (todayChallenge.objectiveType === 'collect_constitutions_single_run') {
    currentChallengeValue = constitutions;
  } else if (todayChallenge.objectiveType === 'collect_papers_single_run') {
    currentChallengeValue = examPapers;
  } else if (todayChallenge.objectiveType === 'collect_votes_single_run') {
    currentChallengeValue = votes;
  } else if (todayChallenge.objectiveType === 'reach_distance_single_run') {
    currentChallengeValue = distance;
  } else if (todayChallenge.objectiveType === 'collect_rtis_single_run') {
    currentChallengeValue = rtis;
  }

  const isChallengeObjectiveMet = currentChallengeValue >= todayChallenge.targetCount;

  // Game control handlers
  const handleStartGame = () => {
    if (!engineRef.current) return;
    setScore(0);
    setDistance(0);
    setExamPapers(0);
    setConstitutions(0);
    setVotes(0);
    setRtis(0);
    setCompletedChallengeRun(null);
    setUnlockedSkinRun(null);

    engineRef.current.reset();
    engineRef.current.setCharacter(selectedCharacter, selectedSkin);
    engineRef.current.setTrackTheme(selectedTrack);
    engineRef.current.start();
    setGameState('playing');
  };

  const handleTogglePause = () => {
    if (!engineRef.current) return;
    if (gameState === 'playing') {
      engineRef.current.pause();
      setGameState('paused');
    } else if (gameState === 'paused') {
      engineRef.current.resume();
      setGameState('playing');
    }
  };

  const handleRestart = () => {
    handleStartGame();
  };

  const handleGoHome = () => {
    if (engineRef.current) {
      engineRef.current.reset();
    }
    setGameState('title');
  };

  // Keyboard shortcut for Enter/Space to start on title screen
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        gameState === 'title' &&
        !isArchiveOpen &&
        !isCharacterModalOpen &&
        !isDailyChallengeOpen &&
        !isLeaderboardOpen
      ) {
        if (e.code === 'Enter' || e.code === 'Space') {
          handleStartGame();
        }
      } else if (e.code === 'Escape' && (gameState === 'playing' || gameState === 'paused')) {
        handleTogglePause();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    gameState,
    isArchiveOpen,
    isCharacterModalOpen,
    isDailyChallengeOpen,
    isLeaderboardOpen,
    selectedCharacter,
    selectedSkin,
    selectedTrack,
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Isolated Three.js WebGL Canvas Mount Container */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={handleStartGame}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={handleSelectCharacter}
          selectedTrack={selectedTrack}
          onSelectTrack={handleSelectTrack}
          onOpenArchives={() => setIsArchiveOpen(true)}
          onOpenCharacterModal={() => setIsCharacterModalOpen(true)}
          dailyChallenge={todayChallenge}
          isTodayChallengeCompleted={isTodayChallengeCompleted}
          selectedSkin={selectedSkin}
          onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          highScore={highScore}
        />
      )}

      {/* Active Playing / Paused HUD */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <GameHUD
          score={score}
          distance={distance}
          examPapers={examPapers}
          constitutions={constitutions}
          votes={votes}
          rtis={rtis}
          powerUps={powerUps}
          isPaused={gameState === 'paused'}
          onTogglePause={handleTogglePause}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onActivateHoverboard={() => engineRef.current?.activateHoverboardManual()}
          onMoveLeft={() => engineRef.current?.shiftLane(-1)}
          onMoveRight={() => engineRef.current?.shiftLane(1)}
          onJump={() => engineRef.current?.jump()}
          onSlide={() => engineRef.current?.slide()}
          characterId={selectedCharacter.id}
          characterName={selectedCharacter.name}
          challengeProgress={{
            title: todayChallenge.title,
            current: currentChallengeValue,
            target: todayChallenge.targetCount,
            completed: isChallengeObjectiveMet,
          }}
        />
      )}

      {/* Pause Overlay (Unobtrusive) */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 pointer-events-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase mb-2">
              Run Paused
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Take a breath. The march for educational integrity will resume when ready.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleTogglePause}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide transition cursor-pointer"
              >
                Resume Run (Esc)
              </button>
              <button
                onClick={handleGoHome}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
              >
                Quit to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && finalStats && (
        <GameOverModal
          stats={finalStats}
          highScore={highScore}
          onRestart={handleRestart}
          onGoHome={handleGoHome}
          onOpenArchives={() => setIsArchiveOpen(true)}
          completedChallenge={completedChallengeRun}
          unlockedSkin={unlockedSkinRun}
          onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          characterName={selectedCharacter.name}
          characterId={selectedCharacter.id}
        />
      )}

      {/* Global Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal onClose={() => setIsLeaderboardOpen(false)} />
      )}

      {/* Daily Civic Challenge & Wardrobe Modal */}
      {isDailyChallengeOpen && (
        <DailyChallengeModal
          currentChallenge={todayChallenge}
          isTodayCompleted={isTodayChallengeCompleted}
          unlockedSkinIds={unlockedSkinIds}
          selectedSkin={selectedSkin}
          onSelectSkin={handleSelectSkin}
          selectedCharacter={selectedCharacter}
          onClose={() => setIsDailyChallengeOpen(false)}
        />
      )}

      {/* Civic Archives Modal */}
      {isArchiveOpen && (
        <CivicArchiveModal onClose={() => setIsArchiveOpen(false)} />
      )}

      {/* Character Selection Modal */}
      {isCharacterModalOpen && (
        <CharacterSelectModal
          selectedCharacter={selectedCharacter}
          onSelect={handleSelectCharacter}
          onClose={() => setIsCharacterModalOpen(false)}
        />
      )}
    </div>
  );
}
