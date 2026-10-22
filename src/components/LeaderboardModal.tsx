import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Medal,
  RefreshCw,
  Award,
  Crown,
  User,
  MapPin,
  BookOpen,
} from 'lucide-react';
import {
  getTopLeaderboard,
  LeaderboardRecord,
} from '../firebase/leaderboardService';
import { CHARACTERS } from '../data/charactersAndFacts';
import { getCharacterPhotoUrl } from '../utils/characterAvatars';

interface LeaderboardModalProps {
  onClose: () => void;
  highlightPlayerName?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  highlightPlayerName,
}) => {
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const topScores = await getTopLeaderboard(10);
      setRecords(topScores);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Global Civic Honor Roll</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Top 10 Civic Awareness Leaders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Defending constitutional democracy, student merit, and peaceful assembly across Delhi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchScores}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Scores List */}
        <div className="overflow-y-auto space-y-2.5 py-4 pr-1">
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span className="text-xs font-medium">Querying Firestore global records...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No scores recorded yet. Be the first citizen runner on the board!
            </div>
          ) : (
            records.map((rec, index) => {
              const rank = index + 1;
              const isHighlight =
                highlightPlayerName &&
                rec.playerName.toLowerCase() === highlightPlayerName.toLowerCase();

              let rankIcon = (
                <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">
                  #{rank}
                </span>
              );

              if (rank === 1) {
                rankIcon = (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Crown className="w-4 h-4" />
                  </div>
                );
              } else if (rank === 2) {
                rankIcon = (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black text-sm flex items-center justify-center">
                    <Medal className="w-4 h-4" />
                  </div>
                );
              } else if (rank === 3) {
                rankIcon = (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black text-sm flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                );
              }

              const char = CHARACTERS.find(
                (c) =>
                  c.name.toLowerCase() === rec.characterName.toLowerCase() ||
                  c.id === rec.characterName.toLowerCase()
              );
              const photoUrl = char ? getCharacterPhotoUrl(char.id) : null;

              return (
                <div
                  key={rec.id || `rank_${rank}`}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    rank === 1
                      ? 'bg-amber-500/15 border-amber-400/80 shadow-md shadow-amber-500/10'
                      : isHighlight
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Rank & Player Info with Character Photo */}
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">{rankIcon}</div>

                    {photoUrl && (
                      <img
                        src={photoUrl}
                        alt={rec.characterName}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-400/60 shrink-0 shadow-sm"
                        title={rec.characterName}
                      />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-sm sm:text-base leading-tight">
                          {rec.playerName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                          {rec.characterName}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="text-amber-300 font-medium">
                          {rec.civicRank}
                        </span>
                        <span className="hidden sm:inline text-slate-600">·</span>
                        <span className="hidden sm:inline">
                          {rec.distance}m dash
                        </span>
                        <span className="hidden sm:inline text-slate-600">·</span>
                        <span className="hidden sm:inline text-amber-400">
                          {rec.constitutions} Constitutions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score */}
                  <div className="flex flex-col items-end">
                    <span className="text-base sm:text-lg font-black text-white tabular-nums tracking-tight">
                      {rec.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Civic Pts
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Civic Rank Reference Guide Footer */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Ranks: 20k+ (Guardian) · 12k+ (Sentinel) · 7k+ (Defender) · 3k+ (Champion)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
