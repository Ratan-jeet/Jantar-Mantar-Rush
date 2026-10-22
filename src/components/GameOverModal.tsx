import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, BookOpen, Award, ShieldCheck, Home, Target, Shirt, Gift, Trophy, Send, Check } from 'lucide-react';
import { RunStats } from '../types/game';
import { CIVIC_FACTS } from '../data/charactersAndFacts';
import { DailyCivicChallenge, CharacterSkin } from '../types/challenges';
import { calculateCivicRank, submitScore } from '../firebase/leaderboardService';
import { getCharacterPhotoUrl } from '../utils/characterAvatars';

interface GameOverModalProps {
  stats: RunStats;
  highScore: number;
  onRestart: () => void;
  onGoHome: () => void;
  onOpenArchives: () => void;
  completedChallenge?: DailyCivicChallenge | null;
  unlockedSkin?: CharacterSkin | null;
  onOpenDailyChallenge?: () => void;
  onOpenLeaderboard?: () => void;
  characterName: string;
  characterId?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  highScore,
  onRestart,
  onGoHome,
  onOpenArchives,
  completedChallenge,
  unlockedSkin,
  onOpenDailyChallenge,
  onOpenLeaderboard,
  characterName,
  characterId,
}) => {
  const isNewHighScore = stats.score >= highScore && stats.score > 0;
  const civicRank = calculateCivicRank(stats.score, stats.constitutions);

  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('jantar_rush_player_name') || 'Citizen Runner';
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Pick a random civic fact for constructive insight
  const fact = CIVIC_FACTS[Math.floor(Math.random() * CIVIC_FACTS.length)];

  const handleSubmitScore = async () => {
    if (!playerName.trim() || submitting || submitted) return;
    setSubmitting(true);
    try {
      localStorage.setItem('jantar_rush_player_name', playerName.trim());
      await submitScore({
        playerName: playerName.trim(),
        score: stats.score,
        distance: stats.distance,
        examPapers: stats.examPapers,
        constitutions: stats.constitutions,
        votes: stats.votes,
        characterName,
        civicRank,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit score to Firestore:', err);
      // Even if network fails, show submitted state gracefully
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isNewHighScore || completedChallenge) {
      confetti({
        particleCount: completedChallenge ? 150 : 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isNewHighScore, completedChallenge, onRestart]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs select-none overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col items-center text-center my-auto">
        {/* Header Ribbon */}
        {completedChallenge ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-2 animate-bounce">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Daily Challenge Complete!</span>
          </div>
        ) : isNewHighScore ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 animate-bounce">
            <Award className="w-4 h-4 text-amber-400" />
            <span>New Civic Record!</span>
          </div>
        ) : (
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">
            Run Concluded · Cordon Encountered
          </span>
        )}

        {characterId && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={getCharacterPhotoUrl(characterId)}
              alt={characterName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div className="text-left">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Runner Champion
              </span>
              <span className="text-sm font-black text-white">
                {characterName}
              </span>
            </div>
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-1">
          Democracy Marches On
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-4">
          {stats.causeSupported}
        </p>

        {/* Daily Civic Challenge Reward Banner if achieved */}
        {completedChallenge && (
          <div className="w-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-2 border-amber-400 rounded-2xl p-3.5 mb-4 text-left shadow-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily Civic Objective Achieved</span>
              </span>
              <span className="text-xs font-black text-emerald-300 font-mono">
                +{completedChallenge.bonusPoints.toLocaleString()} PTS
              </span>
            </div>
            <h4 className="text-white font-bold text-sm">
              {completedChallenge.title}
            </h4>
            <p className="text-xs text-slate-200 mt-0.5">
              {completedChallenge.description}
            </p>

            {unlockedSkin && (
              <div className="mt-2.5 pt-2 border-t border-amber-500/30 flex items-center justify-between">
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Skin Unlocked: <strong>{unlockedSkin.name}</strong></span>
                </span>
                {onOpenDailyChallenge && (
                  <button
                    onClick={onOpenDailyChallenge}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold uppercase transition hover:bg-amber-400 cursor-pointer"
                  >
                    View Wardrobe
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-5">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Score</span>
            <span className="text-xl font-black text-white tabular-nums">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">Distance</span>
            <span className="text-xl font-black text-white tabular-nums">
              {stats.distance} m
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[10px] text-rose-400 font-bold uppercase">Exam Papers</span>
            <span className="text-xl font-black text-rose-300 tabular-nums">
              {stats.examPapers}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[10px] text-blue-400 font-bold uppercase">Constitutions</span>
            <span className="text-xl font-black text-blue-300 tabular-nums">
              {stats.constitutions}
            </span>
          </div>
        </div>

        {/* Civic Awareness Rank Banner */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-3 text-left">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Earned Civic Awareness Rank:
            </span>
            <span className="text-sm font-black text-amber-300">
              {civicRank}
            </span>
          </div>
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard</span>
            </button>
          )}
        </div>

        {/* Global Firestore Leaderboard Submission Form */}
        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 mb-4 text-left shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Post to Global Top 10 Leaderboard</span>
            </span>
            {submitted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Submitted
              </span>
            )}
          </div>

          {!submitted ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={24}
                placeholder="Enter your name or handle..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
              <button
                onClick={handleSubmitScore}
                disabled={submitting || !playerName.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Saving...' : 'Post'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Your civic score is recorded in the Firestore registry!</span>
              {onOpenLeaderboard && (
                <button
                  onClick={onOpenLeaderboard}
                  className="text-amber-400 hover:underline font-bold"
                >
                  View Rankings →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Constructive Civic Fact Card */}
        <div className="w-full bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3.5 text-left mb-5 shadow-inner">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Civic Knowledge · {fact.category}
            </h4>
          </div>
          <h5 className="text-xs sm:text-sm font-semibold text-white mb-0.5">
            {fact.title}
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed">
            {fact.text}
          </p>
          <span className="block text-[10px] text-slate-500 mt-1.5 font-mono">
            Source: {fact.sourceOrArticle}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/20 active:scale-98 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 fill-slate-950" />
            <span>Run Again (Space)</span>
          </button>

          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Top 10</span>
            </button>
          )}

          <button
            onClick={onOpenArchives}
            className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Archives</span>
          </button>

          <button
            onClick={onGoHome}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center justify-center"
            title="Main Menu"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
