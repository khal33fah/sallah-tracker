import { IslamicBook } from '../types';

export const ISLAMIC_BOOKS: IslamicBook[] = [
  {
    id: 'hisn-al-muslim',
    title: 'Fortress of the Muslim (Hisn al-Muslim)',
    arabicTitle: 'حِصْنُ الْمُسْلِمِ مِنْ أَذْكَارِ الْكِتَابِ وَالسُّنَّةِ',
    author: 'Sa\'id bin Ali bin Wahf Al-Qahtani',
    category: 'Adhkar',
    sections: [
      {
        id: 'post-prayer-adhkar',
        title: 'Supplications After Concluding the Prayer (Salah)',
        description: 'Authentic prophetic remembrances recited immediately following tasleem.',
        content: [
          {
            arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
            transliteration: 'Astaghfirullāh, Astaghfirullāh, Astaghfirullāh',
            translation: 'I seek the forgiveness of Allah (three times).',
            reference: 'Sahih Muslim 591',
            benefit: 'Expunges any deficiencies during the prayer session.',
            repeatCount: 3,
          },
          {
            arabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
            transliteration: 'Allāhumma antas-Salāmu wa minkas-salām, tabārakta yā Dhal-Jalāli wal-Ikrām',
            translation: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.',
            reference: 'Sahih Muslim 591',
            benefit: 'Brings immense tranquility and peace of heart.',
            repeatCount: 1,
          },
          {
            arabic: 'سُبْحَانَ اللَّهِ (٣٣) ، الْحَمْدُ لِلَّهِ (٣٣) ، اللَّهُ أَكْبَرُ (٣٣) ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
            transliteration: 'Subḥānallāh (33x), Al-ḥamdulillāh (33x), Allāhu Akbar (33x), Lā ilāha illallāh waḥdahū lā sharīka lah...',
            translation: 'Glory be to Allah (33 times), Praise be to Allah (33 times), Allah is the Greatest (33 times), and complete with Tawheed.',
            reference: 'Sahih Muslim 597',
            benefit: 'Whoever says this after every prayer will have their sins forgiven even if they were like the foam of the sea.',
            repeatCount: 33,
          },
          {
            arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
            transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm... (Ayat al-Kursi)',
            translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence...',
            reference: 'Sunan an-Nasa\'i (Al-Kubra 9928)',
            benefit: 'Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and entering Paradise except death.',
            repeatCount: 1,
          },
        ],
      },
      {
        id: 'morning-evening-protection',
        title: 'Morning & Evening Shield Adhkar',
        description: 'Daily fortress supplications for peace, protection, and spiritual light.',
        content: [
          {
            arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
            transliteration: 'Aṣbaḥnā wa-aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah',
            translation: 'We have entered a new morning and with it all dominion belongs to Allah, and all praise is to Allah. There is no deity but Allah alone.',
            reference: 'Sahih Muslim 2723',
            benefit: 'Re-centers morning intention and dedicates the day to the Creator.',
            repeatCount: 1,
          },
          {
            arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيًّا',
            transliteration: 'Raḍītu billāhi Rabban, wa bil-Islāmi dīnan, wa bi-Muḥammadin (ṣallallāhu ʿalayhi wa sallam) Nabiyyā',
            translation: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.',
            reference: 'Abu Dawud 5072, Tirmidhi 3389',
            benefit: 'Whoever says this in the morning and evening, Allah guarantees to make him pleased on the Day of Resurrection.',
            repeatCount: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'travel-dua-safar',
    title: 'The Traveler\'s Companion (Dua al-Safar)',
    arabicTitle: 'أَدْعِيَةُ السَّفَرِ وَأَحْكَامُ الْمُسَافِرِ',
    author: 'Prophetic Traditions of Journey',
    category: 'Travel Supplications',
    sections: [
      {
        id: 'dua-embarking',
        title: 'Dua al-Safar (Supplication for Starting a Journey)',
        description: 'The prophetic prayer when riding a vehicle or traveling on planes, cars, or ships.',
        content: [
          {
            arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
            transliteration: 'Subḥānal-ladhī sakh-khara lanā hādhā wa mā kunnā lahū muqrinīn, wa innā ilā Rabbinā lamunqalibūn',
            translation: 'Glory unto Him who has subjected this unto us, and we were not capable thereof on our own. And indeed, unto our Lord we are returning.',
            reference: 'Quran (Az-Zukhruf 43:13-14) & Sahih Muslim 1342',
            benefit: 'Invokes divine safety and protection against travel fatigue, accidents, and hardship.',
            repeatCount: 1,
          },
          {
            arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
            transliteration: 'Allāhumma innā nas\'aluka fī safarinā hādhal-birra wat-taqwā, wa minal-ʿamali mā tarḍā, Allāhumma hawwin ʿalaynā safaranā hādhā waṭwi ʿannā buʿdah',
            translation: 'O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You. O Allah, ease this journey for us and shorten its distance.',
            reference: 'Sahih Muslim 1342',
            benefit: 'Brings barakah and divine preservation to the traveler and the family left behind.',
            repeatCount: 1,
          },
        ],
      },
      {
        id: 'rules-of-musafir',
        title: 'Essential Rulings for the Musafir (Traveler)',
        description: 'Guidance on shortening (Qasr) and combining (Jam\') prayers.',
        content: [
          {
            arabic: 'وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ',
            transliteration: 'Wa idhā ḍarabtum fīl-arḍi falaysa ʿalaykum junāḥun an taqṣurū minaṣ-ṣalāh',
            translation: 'And when you travel throughout the land, there is no blame upon you for shortening the prayer (Quran 4:101).',
            reference: 'Surah An-Nisa 4:101',
            benefit: 'Dhuhr, Asr, and Isha are shortened from 4 rak\'ahs to 2 rak\'ahs. Fajr (2) and Maghrib (3) remain unchanged.',
            repeatCount: 1,
          },
        ],
      },
    ],
  },
];
