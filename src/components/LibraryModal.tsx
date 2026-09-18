import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  ChevronRight, 
  Bookmark, 
  Check, 
  Sparkles,
  Layers,
  Heart
} from 'lucide-react';
import { QURAN_SURAHS } from '../data/quranData';
import { HADITH_ITEMS } from '../data/hadithData';
import { ISLAMIC_BOOKS } from '../data/booksData';
import { QuranSurah, HadithItem } from '../types';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LibraryTab = 'quran' | 'hadith' | 'books';

export const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('quran');
  const [selectedSurahIndex, setSelectedSurahIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHadithTopic, setSelectedHadithTopic] = useState<string>('All');
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [adhkarCounter, setAdhkarCounter] = useState<{ [key: string]: number }>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const currentSurah = QURAN_SURAHS[selectedSurahIndex] || QURAN_SURAHS[0];

  // Play audio for a specific Ayah
  const playAyahAudio = (ayahNumber: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyahNumber === ayahNumber && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        setPlayingAyahNumber(null);
        return;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch(e => console.warn('Audio play error:', e));
      setPlayingAyahNumber(ayahNumber);

      audio.onended = () => {
        setPlayingAyahNumber(null);
      };
    }
  };

  // Filter Hadiths by topic & search
  const filteredHadiths = HADITH_ITEMS.filter(item => {
    const matchesTopic = selectedHadithTopic === 'All' || item.topic === selectedHadithTopic;
    const matchesSearch = 
      item.englishText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.narrator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const incrementAdhkar = (key: string, targetMax?: number) => {
    setAdhkarCounter(prev => {
      const current = prev[key] || 0;
      const next = targetMax && current >= targetMax ? 0 : current + 1;
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Islamic Knowledge Library</h2>
              <p className="text-xs text-slate-400">Quran text with recitations, authentic Hadith, and Islamic books</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2 py-2.5">
            <button
              id="library-tab-quran"
              onClick={() => setActiveTab('quran')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'quran'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>Noble Quran</span>
            </button>

            <button
              id="library-tab-hadith"
              onClick={() => setActiveTab('hadith')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'hadith'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>Hadith Collections</span>
            </button>

            <button
              id="library-tab-books"
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === 'books'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>Hisn al-Muslim & Books</span>
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: NOBLE QURAN */}
          {activeTab === 'quran' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {/* Surah List Column */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Surah ({QURAN_SURAHS.length})
                </div>

                <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                  {QURAN_SURAHS.map((surah, idx) => (
                    <button
                      key={surah.number}
                      onClick={() => {
                        setSelectedSurahIndex(idx);
                        if (audioRef.current) audioRef.current.pause();
                        setPlayingAyahNumber(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        selectedSurahIndex === idx
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                          {surah.number}
                        </span>
                        <div>
                          <div className="text-xs font-bold">{surah.nameEnglish}</div>
                          <div className="text-[10px] text-slate-400">{surah.meaning}</div>
                        </div>
                      </div>

                      <div className="text-sm font-arabic font-bold text-emerald-400">
                        {surah.nameArabic}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ayah Reader Column (2 Cols on md) */}
              <div className="md:col-span-2 space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                {/* Surah Banner */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 p-5 text-center relative overflow-hidden">
                  <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                    Surah {currentSurah.number} • {currentSurah.revelationType} • {currentSurah.numberOfAyahs} Ayahs
                  </div>
                  <h3 className="text-2xl font-arabic text-white mt-1">
                    سُورَةُ {currentSurah.nameArabic}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {currentSurah.nameEnglish} ({currentSurah.meaning})
                  </p>
                </div>

                {/* Ayahs Stream */}
                <div className="space-y-4">
                  {currentSurah.ayahs.map(ayah => {
                    const isPlaying = playingAyahNumber === ayah.number;

                    return (
                      <div
                        key={ayah.number}
                        className={`p-4 rounded-xl border transition-all ${
                          isPlaying
                            ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40'
                            : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 mb-3">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Ayah {ayah.numberInSurah}
                          </span>

                          <button
                            onClick={() => playAyahAudio(ayah.number, ayah.audioUrl)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                              isPlaying
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                          </button>
                        </div>

                        {/* Arabic Text */}
                        <p className="text-2xl sm:text-3xl font-arabic text-white text-right leading-loose py-2">
                          {ayah.arabicText}
                        </p>

                        {/* Transliteration */}
                        <p className="text-xs text-emerald-300/80 font-medium italic pt-2">
                          {ayah.transliteration}
                        </p>

                        {/* English Translation */}
                        <p className="text-xs sm:text-sm text-slate-300 pt-1 leading-relaxed">
                          {ayah.englishTranslation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HADITH COLLECTIONS */}
          {activeTab === 'hadith' && (
            <div className="space-y-4">
              {/* Topic Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {['All', 'Salah & Prayer', 'Travel & Musafir', 'Iman & Purpose', 'Mindfulness (Khushoo)'].map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedHadithTopic(topic)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedHadithTopic === topic
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search hadith..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Hadith Cards */}
              <div className="space-y-3">
                {filteredHadiths.map(hadith => (
                  <div
                    key={hadith.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{hadith.collection}</span>
                        <span className="text-slate-500">• Hadith #{hadith.hadithNumber}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                        {hadith.topic}
                      </span>
                    </div>

                    <p className="text-lg sm:text-xl font-arabic text-white text-right leading-relaxed pt-1">
                      {hadith.arabicText}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      "{hadith.englishText}"
                    </p>

                    <div className="text-[11px] text-slate-500 italic">
                      Narrated by {hadith.narrator}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ISLAMIC BOOKS & ADHKAR */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              {ISLAMIC_BOOKS.map(book => (
                <div key={book.id} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{book.title}</span>
                      <span className="text-xs text-emerald-400 font-arabic font-semibold">{book.arabicTitle}</span>
                    </h3>
                    <p className="text-xs text-slate-400">By {book.author}</p>
                  </div>

                  {book.sections.map(section => (
                    <div key={section.id} className="space-y-3">
                      <h4 className="text-sm font-semibold text-emerald-300">
                        {section.title}
                      </h4>
                      <p className="text-xs text-slate-400">{section.description}</p>

                      <div className="grid grid-cols-1 gap-3">
                        {section.content.map((item, idx) => {
                          const key = `${section.id}-${idx}`;
                          const currentCount = adhkarCounter[key] || 0;
                          const target = item.repeatCount || 1;

                          return (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                            >
                              <p className="text-xl font-arabic text-white text-right leading-relaxed">
                                {item.arabic}
                              </p>

                              <p className="text-xs text-emerald-300/90 font-medium">
                                {item.transliteration}
                              </p>

                              <p className="text-xs text-slate-300">
                                {item.translation}
                              </p>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                                <span className="text-[11px] text-slate-500">{item.reference}</span>

                                <button
                                  onClick={() => incrementAdhkar(key, target)}
                                  className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <span>Tasbih: {currentCount}/{target}</span>
                                  {currentCount >= target && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
