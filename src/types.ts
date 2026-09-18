export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Qiyam';

export interface PrayerTimeItem {
  id: PrayerName;
  name: string;
  arabicName: string;
  timeString: string; // e.g. "05:12 AM"
  timestamp: number; // epoch ms for today
  rakahs: number;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export interface PrayerLogRecord {
  id: string;
  date: string; // YYYY-MM-DD
  prayerName: PrayerName;
  observed: boolean;
  timestamp: number;
  matVerified: boolean;
  matPhotoBase64?: string;
  verificationConfidence?: number;
  matType?: string;
  spiritualNote?: string;
  isTravelerShortened?: boolean;
}

export interface TravelerConfig {
  isTraveler: boolean;
  destinationName: string;
  allowPhoneUse: boolean; // Option 1 from prompt
  fiveMinuteTimerActive: boolean; // Option 2 from prompt
  fiveMinuteTimerEndTimestamp: number | null;
  fiveMinuteRemainingSeconds: number;
  combinePrayers: boolean; // Jam' bayn as-Salatayn
}

export interface QuranAyah {
  number: number;
  numberInSurah: number;
  arabicText: string;
  transliteration: string;
  englishTranslation: string;
  audioUrl?: string;
}

export interface QuranSurah {
  number: number;
  nameEnglish: string;
  nameArabic: string;
  meaning: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: QuranAyah[];
}

export interface HadithItem {
  id: string;
  collection: 'Sahih al-Bukhari' | 'Sahih Muslim' | '40 Hadith Nawawi' | 'Sunan Abi Dawud';
  bookNumber?: number | string;
  hadithNumber: number | string;
  narrator: string;
  arabicText: string;
  englishText: string;
  topic: 'Salah & Prayer' | 'Travel & Musafir' | 'Iman & Purpose' | 'Repentance & Mercy' | 'Mindfulness (Khushoo)';
}

export interface IslamicBook {
  id: string;
  title: string;
  arabicTitle: string;
  author: string;
  category: 'Adhkar' | 'Fiqh of Prayer' | 'Travel Supplications' | 'Spiritual Reflections';
  sections: {
    id: string;
    title: string;
    description: string;
    content: {
      arabic: string;
      transliteration: string;
      translation: string;
      reference: string;
      benefit: string;
      repeatCount?: number;
    }[];
  }[];
}

export interface LockScreenReminder {
  id: string;
  arabicAyah: string;
  surahReference: string;
  englishTranslation: string;
  reflectionWriteup: string;
  themeFocus: 'Purpose of Life' | 'Remembrance of Allah' | 'Iman & Tawakkul' | 'The Reality of Dunya' | 'Patience & Hope';
}

export type AppTab = 'tracker' | 'camera' | 'suspension' | 'library' | 'lockscreen';
