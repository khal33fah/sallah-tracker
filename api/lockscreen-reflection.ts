import { GoogleGenAI, Type } from "@google/genai";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { topic = "purpose and iman in this dunya", ayahReference = "51:56" } = req.body || {};
  const ai = getGeminiClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Write a concise, profound Islamic reflection (2-3 sentences) suitable for a phone lock screen wallpaper and daily reminder widget.
Theme: Reminding us about Allah, our true purpose in this Dunya (worldly life), and strengthening our Iman (faith).
Reference inspiration: ${ayahReference}, topic: ${topic}.
Include the Arabic phrase or Ayah snippet, English translation, and a 1-sentence thought to pause and ponder during our busy day.
Keep it deeply serene, high-contrast, and uplifting. Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              arabicAyah: { type: Type.STRING },
              surahReference: { type: Type.STRING },
              englishTranslation: { type: Type.STRING },
              reflectionWriteup: { type: Type.STRING },
              imanCorePrinciple: { type: Type.STRING },
            },
            required: ["arabicAyah", "surahReference", "englishTranslation", "reflectionWriteup", "imanCorePrinciple"],
          },
        },
      });

      if (response.text) {
        return res.status(200).json(JSON.parse(response.text.trim()));
      }
    } catch (aiErr) {
      console.warn("Gemini reflection fallback triggered:", aiErr);
    }
  }

  // Graceful authentic Islamic reflection fallback
  const fallbackReflections = [
    {
      arabicAyah: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
      surahReference: "Surah Adh-Dhariyat [51:56]",
      englishTranslation: "And I did not create the jinn and mankind except to worship Me.",
      reflectionWriteup: "In the rush of this temporary Dunya, pause and remember: every breath, every prayer, and every kindness is a step toward Allah's eternal peace.",
      imanCorePrinciple: "Our Purpose in this Dunya is Divine Connection.",
    },
    {
      arabicAyah: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      surahReference: "Surah Ar-Ra'd [13:28]",
      englishTranslation: "Unquestionably, by the remembrance of Allah hearts find rest.",
      reflectionWriteup: "No matter how busy your day becomes, true tranquility only enters through turning toward your Creator.",
      imanCorePrinciple: "Constant Remembrance Brings Inner Peace.",
    },
    {
      arabicAyah: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
      surahReference: "Surah Al-Mulk [67:2]",
      englishTranslation: "[He] who created death and life to test you [as to] which of you is best in deed.",
      reflectionWriteup: "This earthly life is an open test of love and sincerity. Do not lose your focus on the eternal home.",
      imanCorePrinciple: "Excellence (Ihsan) in Every Action.",
    },
  ];

  const selectedFallback = fallbackReflections[Math.floor(Math.random() * fallbackReflections.length)];
  return res.status(200).json(selectedFallback);
}
