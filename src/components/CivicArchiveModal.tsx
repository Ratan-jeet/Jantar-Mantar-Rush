import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, Scale, History, HelpCircle } from 'lucide-react';
import { CIVIC_FACTS } from '../data/charactersAndFacts';

interface CivicArchiveModalProps {
  onClose: () => void;
}

export const CivicArchiveModal: React.FC<CivicArchiveModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'exam' | 'history' | 'constitution'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacts = CIVIC_FACTS.filter((fact) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'exam'
        ? fact.category === 'NEET & Exam Integrity'
        : activeTab === 'history'
        ? fact.category === 'History'
        : fact.category === 'Constitution' || fact.category === 'Civic Rights';

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      fact.title.toLowerCase().includes(q) ||
      fact.text.toLowerCase().includes(q) ||
      fact.category.toLowerCase().includes(q) ||
      fact.sourceOrArticle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Civic Knowledge & Democratic Heritage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Jantar Mantar & Student Movements Archive
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 border-b border-slate-800">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Insights ({CIVIC_FACTS.length})
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'exam'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              NEET & Exam Reforms
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Jantar Mantar History
            </button>
            <button
              onClick={() => setActiveTab('constitution')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'constitution'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Article 19 & Constitution
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facts, names, acts..."
              className="w-full sm:w-56 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-4 py-4 pr-1">
          {/* Constructive Criticism Editorial Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Scale className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                Constructive Criticism & Democratic Governance
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When youth, students, and citizens peacefully gather at Jantar Mantar or Connaught Place to question exam paper leaks, grace marks, or administrative delays, they are exercising their constitutional sovereignty. Constructive civic dissent is not an attack on the State; it is the vital feedback loop that prevents administrative stagnation and drives systemic integrity.
            </p>
          </div>

          {/* Cards List */}
          {filteredFacts.map((fact) => (
            <div
              key={fact.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 uppercase tracking-wider">
                  {fact.category}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">
                {fact.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2.5">
                {fact.text}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reference: {fact.sourceOrArticle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Close Archives
          </button>
        </div>
      </div>
    </div>
  );
};
