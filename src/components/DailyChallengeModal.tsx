import React, { useState } from 'react';
import {
  X,
  Target,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
  Shirt,
  Calendar,
  Gift,
} from 'lucide-react';
import { DailyCivicChallenge, CharacterSkin } from '../types/challenges';
import {
  CHARACTER_SKINS,
  DAILY_CHALLENGES_POOL,
  getTimeUntilMidnight,
} from '../data/challenges';
import { CharacterInfo } from '../types/game';

interface DailyChallengeModalProps {
  currentChallenge: DailyCivicChallenge;
  isTodayCompleted: boolean;
  unlockedSkinIds: Set<string>;
  selectedSkin: CharacterSkin;
  onSelectSkin: (skin: CharacterSkin) => void;
  selectedCharacter: CharacterInfo;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  currentChallenge,
  isTodayCompleted,
  unlockedSkinIds,
  selectedSkin,
  onSelectSkin,
  selectedCharacter,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'wardrobe' | 'rotation'>('today');

  const rewardSkin = currentChallenge.rewardSkinId
    ? CHARACTER_SKINS.find((s) => s.id === currentChallenge.rewardSkinId)
    : null;

  const characterSkins = CHARACTER_SKINS.filter(
    (s) => s.characterId === selectedCharacter.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Civic Mission Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Daily Civic Challenges & Wardrobe
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 py-3 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'today'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Today's Challenge</span>
          </button>

          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'wardrobe'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Character Skins ({characterSkins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rotation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'rotation'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Challenges Pool</span>
          </button>
        </div>

        {/* Tab 1: Today's Daily Challenge */}
        {activeTab === 'today' && (
          <div className="overflow-y-auto space-y-4 py-4 pr-1">
            {/* Banner card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentChallenge.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resets in: {getTimeUntilMidnight()}</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                {currentChallenge.title}
              </h3>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {currentChallenge.description}
              </p>

              {/* Status indicator */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
                {isTodayCompleted ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Completed! Reward Earned & Added to Score!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm">
                    <Target className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Target: Accomplish in a single run through Jantar Mantar or CP.</span>
                  </div>
                )}
              </div>

              {/* Rewards Box */}
              <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Rewards:</span>
                    <span className="text-sm font-black text-amber-300 tabular-nums">
                      +{currentChallenge.bonusPoints.toLocaleString()} Bonus Points
                    </span>
                  </div>
                </div>

                {rewardSkin && (
                  <div className="flex items-center gap-2.5 bg-slate-900/90 border border-amber-400/40 px-3 py-1.5 rounded-xl">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/20 flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: rewardSkin.primaryColor }}
                    >
                      ★
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold block">Unlockable Skin:</span>
                      <span className="text-xs font-bold text-white">{rewardSkin.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400">
              💡 <strong>Pro Tip:</strong> Completing the objective (like collecting 50 Constitutions) automatically registers at the end of your run, saves to your profile, and permanently unlocks the special skin in your wardrobe!
            </div>
          </div>
        )}

        {/* Tab 2: Wardrobe / Character Skins */}
        {activeTab === 'wardrobe' && (
          <div className="overflow-y-auto space-y-3 py-4 pr-1">
            <div className="text-xs text-slate-400 mb-2">
              Showing skins for currently selected character: <strong className="text-white">{selectedCharacter.name}</strong>
            </div>

            {characterSkins.map((skin) => {
              const isUnlocked = unlockedSkinIds.has(skin.id);
              const isEquipped = selectedSkin.id === skin.id;

              return (
                <div
                  key={skin.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-amber-500/10 border-amber-400'
                      : isUnlocked
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Swatch Preview */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-white/30 shrink-0 relative"
                      style={{ backgroundColor: skin.primaryColor }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/30 absolute bottom-1 right-1"
                        style={{ backgroundColor: skin.accentColor }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm sm:text-base">
                          {skin.name}
                        </h4>
                        {isEquipped && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            Equipped
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {skin.description}
                      </p>
                      <p className="text-[11px] text-amber-400/90 font-medium mt-1">
                        🎯 {skin.unlockRequirement}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <button
                        onClick={() => onSelectSkin(skin)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                          isEquipped
                            ? 'bg-slate-800 text-slate-400 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {isEquipped ? 'Active' : 'Equip Skin'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800/60 text-slate-500 flex items-center gap-1 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: All Challenges Pool */}
        {activeTab === 'rotation' && (
          <div className="overflow-y-auto space-y-3 py-4 pr-1">
            <p className="text-xs text-slate-400 mb-2">
              Every day at midnight, a new challenge is selected from the civic rotation pool:
            </p>

            {DAILY_CHALLENGES_POOL.map((ch, idx) => {
              const chRewardSkin = ch.rewardSkinId
                ? CHARACTER_SKINS.find((s) => s.id === ch.rewardSkinId)
                : null;
              const isToday = ch.id === currentChallenge.id;

              return (
                <div
                  key={ch.id}
                  className={`p-3.5 rounded-2xl border ${
                    isToday
                      ? 'bg-amber-500/10 border-amber-400'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Challenge #{idx + 1} · {ch.category}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase">
                        Active Today
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                    {ch.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                    <span className="text-amber-300 font-mono font-bold">
                      +{ch.bonusPoints.toLocaleString()} Points
                    </span>
                    {chRewardSkin && (
                      <span className="text-cyan-300 font-medium">
                        Reward: {chRewardSkin.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
