import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const LANGUAGE_META = {
  en: { label: "English", target: "English" },
  hi: { label: "Hindi", target: "Hindi" },
  hinglish: { label: "Hinglish", target: "Hinglish" },
  as: { label: "Assamese", target: "Assamese" },
  bn: { label: "Bangla", target: "Bengali" },
  brx: { label: "Bodo", target: "Bodo" },
  doi: { label: "Dogri", target: "Dogri" },
  gu: { label: "Gujarati", target: "Gujarati" },
  kn: { label: "Kannada", target: "Kannada" },
  ks: { label: "Kashmiri", target: "Kashmiri" },
  kok: { label: "Konkani", target: "Konkani" },
  mai: { label: "Maithili", target: "Maithili" },
  ml: { label: "Malayalam", target: "Malayalam" },
  mni: { label: "Manipuri", target: "Manipuri" },
  mr: { label: "Marathi", target: "Marathi" },
  ne: { label: "Nepali", target: "Nepali" },
  or: { label: "Odia", target: "Odia" },
  pa: { label: "Punjabi", target: "Punjabi" },
  sa: { label: "Sanskrit", target: "Sanskrit" },
  sat: { label: "Santali", target: "Santali" },
  sd: { label: "Sindhi", target: "Sindhi" },
  ta: { label: "Tamil", target: "Tamil" },
  te: { label: "Telugu", target: "Telugu" },
  ur: { label: "Urdu", target: "Urdu" },
  es: { label: "Español", target: "Spanish" },
  fr: { label: "Français", target: "French" },
  de: { label: "Deutsch", target: "German" },
  ja: { label: "日本語", target: "Japanese" },
  zh: { label: "中文", target: "Chinese" },
  ru: { label: "Русский", target: "Russian" },
  ar: { label: "العربية", target: "Arabic" },
} as const;

export type Language = keyof typeof LANGUAGE_META;

type TranslationKey =
  | "nav.home"
  | "nav.enterprise"
  | "nav.customerPricing"
  | "nav.vendorPricing"
  | "nav.consumerLogistics"
  | "nav.about"
  | "nav.services"
  | "nav.joinNow"
  | "nav.language"
  | "hero.badge"
  | "hero.title.prefix"
  | "hero.title.trust"
  | "hero.title.with"
  | "hero.title.technology"
  | "hero.title.and"
  | "hero.title.love"
  | "hero.subtitle"
  | "hero.getStarted"
  | "cards.heading.prefix"
  | "cards.heading.highlightA"
  | "cards.heading.highlightB"
  | "cards.customer"
  | "cards.vendor"
  | "reviews.title"
  | "reviews.subtitle"
  | "bot.title"
  | "bot.welcome"
  | "bot.placeholder"
  | "bot.send"
  | "bot.error";

type Dictionary = Partial<Record<Language, Record<string, string>>>;

const dictionary: Dictionary = {
  en: {
    "nav.home": "Home",
    "nav.enterprise": "Enterprise",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.joinNow": "Join Now",
    "nav.language": "Language",
    "nav.vendorPricing": "Vendor Pricing",
    "nav.consumerLogistics": "Consumer Logistics",
    "hero.badge": "START TO SUCCESS",
    "hero.title.prefix": "Empowering your long-lived",
    "hero.title.trust": "trust",
    "hero.title.with": "with",
    "hero.title.technology": "technology",
    "hero.title.and": "and",
    "hero.title.love": "love",
    "hero.subtitle": "Restoring the connection between vendors and consumers in a split second. Experience seamless, reliable, and real-time community commerce.",
    "hero.getStarted": "Get Started",
    "cards.heading.prefix": "It's your time to make the move with",
    "cards.heading.highlightA": "Tech",
    "cards.heading.highlightB": "Thela",
    "cards.customer": "Get the best deals available in your local market",
    "cards.vendor": "Boost sales by reaching thousands of local customers digitally.",
    "reviews.title": "Hear it from our customers!",
    "reviews.subtitle": "Thousands trust Tech Thela every day.",
    "bot.title": "Tech Thela AI Assistant",
    "bot.welcome": "Hi! I am your Tech Thela assistant. Ask me about vendors, pricing, login, tracking, subscriptions, or payments.",
    "bot.placeholder": "Ask your question...",
    "bot.send": "Send",
    "bot.error": "I could not process that right now. Please try again in a moment.",
  },
  hi: {
    "nav.home": "होम",
    "nav.enterprise": "एंटरप्राइज़",
    "nav.about": "हमारे बारे में",
    "nav.services": "सेवाएं",
    "nav.joinNow": "अभी जुड़ें",
    "nav.language": "भाषा",
    "nav.vendorPricing": "विक्रेता मूल्य निर्धारण",
    "nav.consumerLogistics": "उपभोक्ता रसद",
    "hero.badge": "सफलता की शुरुआत",
    "hero.title.prefix": "आपके लंबे समय के",
    "hero.title.trust": "भरोसे",
    "hero.title.with": "को",
    "hero.title.technology": "टेक्नोलॉजी",
    "hero.title.and": "और",
    "hero.title.love": "प्यार",
    "hero.subtitle": "विक्रेताओं और ग्राहकों को सेकंड्स में जोड़ें। भरोसेमंद, आसान और रियल-टाइम लोकल कॉमर्स का अनुभव लें।",
    "hero.getStarted": "शुरू करें",
    "cards.heading.prefix": "अब समय है आगे बढ़ने का",
    "cards.heading.highlightA": "Tech",
    "cards.heading.highlightB": "Thela",
    "cards.customer": "अपने लोकल मार्केट में सबसे अच्छे ऑफर्स पाएं",
    "cards.vendor": "हजारों स्थानीय ग्राहकों तक पहुंचकर अपनी बिक्री बढ़ाएं।",
    "reviews.title": "हमारे ग्राहकों की राय सुनिए!",
    "reviews.subtitle": "हर दिन हजारों लोग Tech Thela पर भरोसा करते हैं।",
    "bot.title": "Tech Thela AI सहायक",
    "bot.welcome": "नमस्ते! मैं आपका Tech Thela सहायक हूं। आप मुझसे vendors, pricing, login, tracking, subscriptions या payments के बारे में पूछ सकते हैं।",
    "bot.placeholder": "अपना सवाल लिखें...",
    "bot.send": "भेजें",
    "bot.error": "अभी जवाब देने में दिक्कत आ रही है। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  },
  hinglish: {
    "nav.home": "Home",
    "nav.enterprise": "Enterprise",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.joinNow": "Join Now",
    "nav.language": "Language",
    "nav.vendorPricing": "Vendor Pricing",
    "nav.consumerLogistics": "Consumer Logistics",
    "hero.badge": "START TO SUCCESS",
    "hero.title.prefix": "Aapke long-term",
    "hero.title.trust": "trust",
    "hero.title.with": "ko",
    "hero.title.technology": "technology",
    "hero.title.and": "aur",
    "hero.title.love": "love",
    "hero.subtitle": "Vendors aur consumers ko seconds mein connect karo. Seamless, reliable aur real-time local commerce ka experience lo.",
    "hero.getStarted": "Get Started",
    "cards.heading.prefix": "Ab move lene ka time hai",
    "cards.heading.highlightA": "Tech",
    "cards.heading.highlightB": "Thela",
    "cards.customer": "Apne local market ke best deals pao",
    "cards.vendor": "Hazaron local customers tak reach karke sales boost karo.",
    "reviews.title": "Customers ki baat suno!",
    "reviews.subtitle": "Roz hazaron users Tech Thela par trust karte hain.",
    "bot.title": "Tech Thela AI Assistant",
    "bot.welcome": "Hi! Main aapka Tech Thela assistant hoon. Vendors, pricing, login, tracking, subscriptions ya payments pe sawal poochho.",
    "bot.placeholder": "Apna sawaal poochho...",
    "bot.send": "Send",
    "bot.error": "Abhi response nahi aa paaya. Thodi der baad try karo.",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ttai_lang") as Language | null;
    if (saved && saved in LANGUAGE_META) {
      setLanguage(saved);
    }
  }, []);

  const updateLanguage = (lang: string) => {
    const validLang = (lang in LANGUAGE_META ? lang : "en") as Language;
    setLanguage(validLang);
    localStorage.setItem("ttai_lang", validLang);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      t: (key: TranslationKey) => (dictionary[language]?.[key] as string) || (dictionary.en![key] as string) || key,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const languageOptions = Object.entries(LANGUAGE_META).map(([value, config]) => ({
  value: value as Language,
  label: config.label,
}));

export function getTargetLanguageName(language: Language): string {
  return LANGUAGE_META[language]?.target || "English";
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
