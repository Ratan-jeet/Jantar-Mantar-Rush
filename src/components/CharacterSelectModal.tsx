import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Zap,
  Search,
  Sparkles,
  Info,
  ShieldAlert,
  Users,
  Mic,
  Video,
  GraduationCap,
  Scale,
  Award,
} from 'lucide-react';
import { CharacterInfo } from '../types/game';
import { CHARACTERS } from '../data/charactersAndFacts';
import { getCharacterPhotoUrl } from '../utils/characterAvatars';

interface CharacterSelectModalProps {
  selectedCharacter: CharacterInfo;
  onSelect: (char: CharacterInfo) => void;
  onClose: () => void;
}

type CategoryFilter = 'All' | 'Protester' | 'Journalist' | 'Influencer' | 'Gen-Z';

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  selectedCharacter,
  onSelect,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingCharacter, setInspectingCharacter] = useState<CharacterInfo | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: CHARACTERS.length,
      Protester: CHARACTERS.filter((c) => c.category === 'Protester').length,
      Journalist: CHARACTERS.filter((c) => c.category === 'Journalist').length,
      Influencer: CHARACTERS.filter((c) => c.category === 'Influencer').length,
      'Gen-Z': CHARACTERS.filter((c) => c.category === 'Gen-Z').length,
    };
  }, []);

  // Filtered characters list
  const filteredCharacters = useMemo(() => {
    return CHARACTERS.filter((char) => {
      const matchesCategory =
        activeCategory === 'All' || char.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        char.name.toLowerCase().includes(q) ||
        char.role.toLowerCase().includes(q) ||
        char.quote.toLowerCase().includes(q) ||
        char.bio.toLowerCase().includes(q) ||
        char.perkDescription.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/92 backdrop-blur-md select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Select Civic Champion</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  40 Characters Available
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Featuring 10 Protesters, 10 Independent Journalists, 10 Influencers & Educators, and 10 Gen-Z Aspirants who rallied at Jantar Mantar and Sansad Marg demanding examination integrity, constitutional transparency, and ministerial accountability.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs & Search Row */}
        <div className="py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('All')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                activeCategory === 'All'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All ({categoryCounts.All})</span>
            </button>

            <button
              onClick={() => setActiveCategory('Protester')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                activeCategory === 'Protester'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span>✊ Protesters ({categoryCounts.Protester})</span>
            </button>

            <button
              onClick={() => setActiveCategory('Journalist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                activeCategory === 'Journalist'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Journalists ({categoryCounts.Journalist})</span>
            </button>

            <button
              onClick={() => setActiveCategory('Influencer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                activeCategory === 'Influencer'
                  ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md shadow-rose-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Influencers ({categoryCounts.Influencer})</span>
            </button>

            <button
              onClick={() => setActiveCategory('Gen-Z')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                activeCategory === 'Gen-Z'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Gen-Z ({categoryCounts['Gen-Z']})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, quote..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Character Grid */}
        <div className="overflow-y-auto space-y-2.5 py-3 pr-1 flex-1">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No champions found matching "{searchQuery}". Try selecting "All" or a different category.
            </div>
          ) : (
            filteredCharacters.map((char) => {
              const isSelected = char.id === selectedCharacter.id;
              const photoUrl = getCharacterPhotoUrl(char.id);

              return (
                <div
                  key={char.id}
                  onClick={() => {
                    onSelect(char);
                    onClose();
                  }}
                  className={`group relative p-3 sm:p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Actual Face Photo with zoom button */}
                    <div
                      className="relative shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingCharacter(char);
                      }}
                      title="Click to inspect high-resolution portrait & protest dossier"
                    >
                      <img
                        src={photoUrl}
                        alt={char.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover shadow-xl border-2 border-slate-700 group-hover:border-amber-400 transition transform group-hover:scale-105"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-600 text-slate-300">
                        <Info className="w-3 h-3 text-amber-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-black text-sm sm:text-base leading-tight">
                          {char.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            char.category === 'Protester'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : char.category === 'Journalist'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : char.category === 'Influencer'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {char.category}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-amber-400 font-semibold block mt-0.5">
                        {char.role}
                      </span>

                      <p className="text-xs text-slate-300 italic mt-1 line-clamp-2 max-w-xl">
                        "{char.quote}"
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{char.perkDescription}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center sm:flex-col gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectingCharacter(char);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(char);
                        onClose();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Choose'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <span>
            Tip: Click any character's photo or <strong>Dossier</strong> to view their full protest background & demands.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Large Character Dossier & Photo Modal */}
      {inspectingCharacter && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg"
          onClick={() => setInspectingCharacter(null)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectingCharacter(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Face Photo */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-800">
              <img
                src={getCharacterPhotoUrl(inspectingCharacter.id)}
                alt={inspectingCharacter.name}
                className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-amber-400 shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                  {inspectingCharacter.category}
                </span>
                <h3 className="text-xl font-black text-white mt-1.5">
                  {inspectingCharacter.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {inspectingCharacter.role}
                </p>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  {inspectingCharacter.tagline}
                </p>
              </div>
            </div>

            {/* Bio & Demands */}
            <div className="py-4 space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Protest Background & Role
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {inspectingCharacter.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Historic Quote at Jantar Mantar
                </h4>
                <p className="text-xs text-amber-300 italic bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 leading-relaxed">
                  "{inspectingCharacter.quote}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Civic Gameplay Perk
                </h4>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{inspectingCharacter.perkDescription}</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setInspectingCharacter(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Back to List
              </button>
              <button
                onClick={() => {
                  onSelect(inspectingCharacter);
                  setInspectingCharacter(null);
                  onClose();
                }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 cursor-pointer transition hover:from-amber-400 hover:to-orange-400"
              >
                Select {inspectingCharacter.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
