import React from 'react';
import { Volume2, VolumeX, BookOpen, User, MapPin, Play, ShieldAlert, Target, Sparkles, Shirt, Trophy } from 'lucide-react';
import { CharacterInfo, TrackTheme } from '../types/game';
import { DailyCivicChallenge, CharacterSkin } from '../types/challenges';
import { getCharacterPhotoUrl } from '../utils/characterAvatars';

interface TitleScreenProps {
  onStartGame: () => void;
  selectedCharacter: CharacterInfo;
  onSelectCharacter: (char: CharacterInfo) => void;
  selectedTrack: TrackTheme;
  onSelectTrack: (track: TrackTheme) => void;
  onOpenArchives: () => void;
  onOpenCharacterModal: () => void;
  dailyChallenge: DailyCivicChallenge;
  isTodayChallengeCompleted: boolean;
  selectedSkin: CharacterSkin;
  onOpenDailyChallenge: () => void;
  onOpenLeaderboard: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  highScore: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  selectedCharacter,
  onSelectCharacter,
  selectedTrack,
  onSelectTrack,
  onOpenArchives,
  onOpenCharacterModal,
  dailyChallenge,
  isTodayChallengeCompleted,
  selectedSkin,
  onOpenDailyChallenge,
  onOpenLeaderboard,
  isMuted,
  onToggleMute,
  highScore,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 select-none bg-gradient-to-b from-slate-950/85 via-slate-950/60 to-slate-950/90 pointer-events-auto overflow-y-auto">
      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>High Score: <strong className="tabular-nums font-bold text-white">{highScore.toLocaleString()}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Global Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold transition cursor-pointer"
            title="View Global Top 10 Leaderboard & Civic Ranks"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Top 10</span>
          </button>

          {/* Daily Challenge Button */}
          <button
            onClick={onOpenDailyChallenge}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold transition cursor-pointer ${
              isTodayChallengeCompleted
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-400/60 hover:bg-amber-500/30'
            }`}
            title="Open Daily Civic Challenge and Wardrobe"
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Daily Challenge</span>
            {isTodayChallengeCompleted ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">✓ Done</span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={onOpenArchives}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-semibold transition cursor-pointer"
            title="Read Jantar Mantar protest history & Constitutional rights"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Civic Archives</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Hero Title & Identity Lockup */}
      <div className="flex flex-col items-center text-center my-auto max-w-2xl mx-auto px-4">
        {/* Bespoke SVG Logo Lockup */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg viewBox="0 0 48 48" className="w-12 h-12 drop-shadow-md" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="17" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M24 6 L24 42 M6 24 L42 24 M11 11 L37 37 M11 37 L37 11" stroke="#f59e0b" strokeWidth="1" />
            <polygon points="24,10 32,24 24,38 16,24" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="4" fill="#38bdf8" />
          </svg>
          <div className="text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black text-amber-400 block">
              Historical Civic Endless Runner
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Delhi Heritage & Democracy Corridor
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-xl uppercase mb-2">
          Jantar Mantar <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Rush</span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mb-6 leading-relaxed">
          Dash through the iconic observatory and Connaught Place. Dodge Delhi Police barricades, RPF checkpoints, and Section 144 barriers while rallying for exam integrity, democratic votes, and the Constitution.
        </p>

        {/* Character Card / Preview */}
        <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 mb-5 shadow-2xl flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={getCharacterPhotoUrl(selectedCharacter.id)}
                alt={selectedCharacter.name}
                className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-amber-400"
              />
              <span
                className={`absolute -bottom-1 -right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase border ${
                  selectedCharacter.category === 'Protester'
                    ? 'bg-amber-500 text-slate-950 border-amber-300'
                    : selectedCharacter.category === 'Journalist'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                    : selectedCharacter.category === 'Influencer'
                    ? 'bg-rose-500 text-slate-950 border-rose-300'
                    : 'bg-emerald-500 text-slate-950 border-emerald-300'
                }`}
              >
                {selectedCharacter.category}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                  {selectedCharacter.name}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  {selectedCharacter.role.split('&')[0]}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xs sm:max-w-sm line-clamp-1">
                {selectedCharacter.perkDescription}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCharacterModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-600 transition shrink-0 cursor-pointer shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>40 Champions</span>
          </button>
        </div>

        {/* Daily Civic Challenge Hero Banner */}
        <div
          onClick={onOpenDailyChallenge}
          className="w-full bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 hover:border-amber-400/70 rounded-xl p-3 mb-4 text-left shadow-lg cursor-pointer transition group"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Today's Civic Challenge</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              +{dailyChallenge.bonusPoints.toLocaleString()} Pts {isTodayChallengeCompleted ? '· Completed ✓' : ''}
            </span>
          </div>

          <div className="text-white text-xs sm:text-sm font-bold group-hover:text-amber-300 transition line-clamp-1">
            {dailyChallenge.title}: {dailyChallenge.description}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
            <span className="flex items-center gap-1">
              <Shirt className="w-3 h-3 text-cyan-400" />
              <span>Skin: <strong className="text-slate-300">{selectedSkin.name}</strong></span>
            </span>
            <span className="text-cyan-400 group-hover:underline font-semibold">
              View Challenge & Skins →
            </span>
          </div>
        </div>

        {/* Track Selection Pills */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-orange-400" /> Track:
          </span>
          <button
            onClick={() => onSelectTrack('jantar_mantar')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
              selectedTrack === 'jantar_mantar'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            🏛️ Jantar Mantar (Protest Track)
          </button>
          <button
            onClick={() => onSelectTrack('connaught_place')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
              selectedTrack === 'connaught_place'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            🏛️ Connaught Place (CP Colonnade)
          </button>
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={onStartGame}
          className="group relative flex items-center justify-center gap-3 w-full sm:w-80 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-lg tracking-wide shadow-xl shadow-orange-500/25 active:scale-98 transition transform cursor-pointer"
        >
          <Play className="w-6 h-6 fill-slate-950" />
          <span>START CIVIC RUN</span>
        </button>

        {/* Single flat control-hint line as per Game Craft Guidelines */}
        <div className="mt-4 text-[11px] sm:text-xs text-slate-400 font-mono tracking-wider">
          A / D or Swipe Lane · W or Up Jump · S or Down Slide · Space Hoverboard
        </div>
      </div>

      {/* Bottom Footer Note on Constructive Civic Spirit */}
      <div className="w-full text-center text-[11px] text-slate-300 font-medium pb-1 flex items-center justify-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Dedicated to educational transparency, student merit, and Article 19 peaceful assembly in India.</span>
      </div>
    </div>
  );
};
