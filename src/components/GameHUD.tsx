import React from 'react';
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  Magnet,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { PowerUpState, PowerUpType } from '../types/game';
import { getCharacterPhotoUrl } from '../utils/characterAvatars';

interface GameHUDProps {
  score: number;
  distance: number;
  examPapers: number;
  constitutions: number;
  votes: number;
  rtis: number;
  powerUps: Record<PowerUpType, PowerUpState>;
  isPaused: boolean;
  onTogglePause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onActivateHoverboard: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSlide: () => void;
  characterId?: string;
  characterName?: string;
  challengeProgress?: {
    title: string;
    current: number;
    target: number;
    completed: boolean;
  };
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  distance,
  examPapers,
  constitutions,
  votes,
  rtis,
  powerUps,
  isPaused,
  onTogglePause,
  isMuted,
  onToggleMute,
  onActivateHoverboard,
  onMoveLeft,
  onMoveRight,
  onJump,
  onSlide,
  characterId,
  characterName,
  challengeProgress,
}) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top Status Cluster (Unobstructed center) */}
      <div className="flex items-start justify-between w-full">
        {/* Left Stats Cluster: Character Avatar, Score, Distance, Challenge */}
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {/* Main Score & Distance with Character Face Photo */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-2 shadow-lg">
            {characterId && (
              <div className="relative shrink-0">
                <img
                  src={getCharacterPhotoUrl(characterId)}
                  alt={characterName || 'Champion'}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-400 shadow-sm"
                  title={characterName || 'Champion'}
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Score</span>
              <span className="text-xl sm:text-2xl font-black tabular-nums text-white tracking-tight leading-none">
                {score.toLocaleString()}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700 mx-1" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Distance</span>
              <span className="text-sm sm:text-base font-bold tabular-nums text-slate-200 leading-none">
                {distance} m
              </span>
            </div>
          </div>

          {/* Daily Civic Challenge in-run progress indicator */}
          {challengeProgress && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs border font-medium shadow-sm transition ${
                challengeProgress.completed
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-amber-500/20'
                  : 'bg-slate-900/85 border-slate-700/80 text-slate-300'
              }`}
            >
              <span className="font-bold text-amber-400 text-[10px] uppercase">
                {challengeProgress.completed ? '🎉 Challenge Met!' : '🎯 Daily Goal:'}
              </span>
              <span className="text-[11px] tabular-nums font-mono font-bold">
                {challengeProgress.current} / {challengeProgress.target}
              </span>
            </div>
          )}

          {/* Active Power-up timer bars */}
          <div className="flex flex-col gap-1 mt-1">
            {powerUps.hoverboard.active && (
              <div className="flex items-center gap-2 bg-sky-950/90 border border-sky-500/50 rounded-lg px-2.5 py-1 text-xs text-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-[11px]">Hoverboard</span>
                <span className="tabular-nums font-mono text-[10px] ml-auto">
                  {Math.ceil(powerUps.hoverboard.timeLeft)}s
                </span>
              </div>
            )}

            {powerUps.super_boots.active && (
              <div className="flex items-center gap-2 bg-rose-950/90 border border-rose-500/50 rounded-lg px-2.5 py-1 text-xs text-rose-200">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold text-[11px]">Super Boots</span>
                <span className="tabular-nums font-mono text-[10px] ml-auto">
                  {Math.ceil(powerUps.super_boots.timeLeft)}s
                </span>
              </div>
            )}

            {powerUps.magnet.active && (
              <div className="flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-xs text-emerald-200">
                <Magnet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-[11px]">Solidarity Magnet</span>
                <span className="tabular-nums font-mono text-[10px] ml-auto">
                  {Math.ceil(powerUps.magnet.timeLeft)}s
                </span>
              </div>
            )}

            {powerUps.double_score.active && (
              <div className="flex items-center gap-2 bg-amber-950/90 border border-amber-500/50 rounded-lg px-2.5 py-1 text-xs text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-[11px]">2X Free Speech</span>
                <span className="tabular-nums font-mono text-[10px] ml-auto">
                  {Math.ceil(powerUps.double_score.timeLeft)}s
                </span>
              </div>
            )}

            {powerUps.shield.active && (
              <div className="flex items-center gap-2 bg-teal-950/90 border border-teal-500/50 rounded-lg px-2.5 py-1 text-xs text-teal-200">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-semibold text-[11px]">SC Injunction Shield</span>
                <span className="tabular-nums font-mono text-[10px] ml-auto">
                  {Math.ceil(powerUps.shield.timeLeft)}s
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Stats Cluster: Collectibles & Quick Controls */}
        <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* Pause & Mute buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePause}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md transition cursor-pointer"
              title={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md transition cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Collectible counters */}
          <div className="flex flex-col gap-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 shadow-lg text-xs">
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Exam Papers:</span>
              </span>
              <strong className="text-white font-mono tabular-nums">{examPapers}</strong>
            </div>

            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Constitutions:</span>
              </span>
              <strong className="text-amber-300 font-mono tabular-nums">{constitutions}</strong>
            </div>

            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Votes:</span>
              </span>
              <strong className="text-blue-300 font-mono tabular-nums">{votes}</strong>
            </div>

            {rtis > 0 && (
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>RTI Queries:</span>
                </span>
                <strong className="text-emerald-300 font-mono tabular-nums">{rtis}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center 85% playfield remains completely unobstructed! */}

      {/* Bottom Mobile-Friendly Tactile Controls & Hoverboard Button */}
      <div className="flex items-end justify-between w-full pointer-events-auto mt-auto pb-1">
        {/* Left: Direction D-Pad for Touch screens */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-1.5 shadow-xl sm:opacity-75 sm:hover:opacity-100 transition">
          <button
            onClick={onMoveLeft}
            className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-amber-500/30 text-white flex items-center justify-center border border-slate-700 shadow cursor-pointer active:scale-95 transition"
            title="Move Left"
          >
            <ArrowLeft className="w-6 h-6 text-amber-400" />
          </button>
          <button
            onClick={onMoveRight}
            className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-amber-500/30 text-white flex items-center justify-center border border-slate-700 shadow cursor-pointer active:scale-95 transition"
            title="Move Right"
          >
            <ArrowRight className="w-6 h-6 text-amber-400" />
          </button>
        </div>

        {/* Center Hoverboard Quick Trigger Button */}
        <button
          onClick={onActivateHoverboard}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border font-bold text-xs uppercase tracking-wider shadow-xl cursor-pointer transition active:scale-95 ${
            powerUps.hoverboard.active
              ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-sky-500/30'
              : 'bg-slate-900/90 text-sky-300 border-sky-500/40 hover:bg-slate-800'
          }`}
          title="Activate Tricolor Hoverboard (Space or Tap)"
        >
          <Sparkles className="w-4 h-4" />
          <span>{powerUps.hoverboard.active ? 'Board Active' : 'Hoverboard (Space)'}</span>
        </button>

        {/* Right: Jump & Slide Buttons */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-1.5 shadow-xl sm:opacity-75 sm:hover:opacity-100 transition">
          <button
            onClick={onSlide}
            className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-rose-500/30 text-white flex items-center justify-center border border-slate-700 shadow cursor-pointer active:scale-95 transition"
            title="Slide under barriers"
          >
            <ArrowDown className="w-6 h-6 text-rose-400" />
          </button>
          <button
            onClick={onJump}
            className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-emerald-500/30 text-white flex items-center justify-center border border-slate-700 shadow cursor-pointer active:scale-95 transition"
            title="Jump over barricades"
          >
            <ArrowUp className="w-6 h-6 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
