import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

const MODEL_NAME = "gemini-1.5-flash";
const DEFAULT_LIBRETRANSLATE_URL = "http://localhost:5000/translate";
const PUBLIC_LIBRETRANSLATE_URL = "https://translate.argosopentech.com/translate";
const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const MAX_CACHE_SIZE = 5000;
const CACHE_FILE_PATH = path.join(process.cwd(), ".cache", "translation-cache.json");
const CACHE_FLUSH_DELAY_MS = 500;

// High-performance fallback for common UI elements to ensure "WOW" factor without API keys
const COMMON_STRINGS = {
  hi: {
    "Home": "होम",
    "About": "हमारे बारे में",
    "Contact": "संपर्क करें",
    "Services": "सेवाएं",
    "Pricing": "मूल्य निर्धारण",
    "Login": "लॉगिन",
    "Signup": "साइनअप",
    "Logout": "लॉग आउट",
    "Dashboard": "डैशबोर्ड",
    "Settings": "सेटिंग्स",
    "Privacy Policy": "गोपनीयता नीति",
    "Terms of Service": "सेवा की शर्तें",
    "Our Mission": "हमारा लक्ष्य",
    "Our Team": "हमारी टीम",
    "Vendor Radar": "विक्रेता रडार",
    "Consumer Radar": "उपभोक्ता रडार",
    "Track Orders": "ऑर्डर ट्रैक करें",
    "Live Location": "लाइव लोकेशन",
    "Smart Routing": "स्मार्ट राउटिंग",
    "Follow Us": "हमें फॉलो करें",
    "Quick Links": "त्वरित लिंक",
    "Newsletter": "न्यूज़लेटर",
    "Subscribe": "सदस्यता लें",
    "Send": "भेजें",
    "Copyright": "कॉपीराइट",
    "All rights reserved": "सर्वाधिकार सुरक्षित",
    "Made with love": "प्यार से बनाया गया",
    "Back to top": "ऊपर वापस जाएं",
    "Success": "सफलता",
    "Error": "त्रुटि",
    "Loading": "लोड हो रहा है...",
    "Vendor": "विक्रेता",
    "Consumer": "उपभोक्ता",
    "Join our community": "हमारे समुदाय में शामिल हों",
    "Explore": "खोजें",
    "Get Started": "शुरू करें",
    "Read More": "और पढ़ें",
    "Download": "डाउनलोड करें",
    "Blog": "ब्लॉग",
    "Careers": "करियर",
    "Help Center": "सहायता केंद्र",
    "FAQ": "सामान्य प्रश्न",
    "Tech Thela AI": "Tech Thela AI",
    "Waitre": "Tech Thela",
    "Join Now": "अभी जुड़ें",
    "Empowering": "सशक्त बनाना",
    "Mobile": "मोबाइल",
    "Desktop": "डेस्कटॉप",
    "Language": "भाषा",
    "Location": "स्थान",
    "Search": "खोज"
  },
  hinglish: {
    "Home": "Home",
    "About": "About Us",
    "Contact": "Contact Karo",
    "Services": "Services",
    "Pricing": "Pricing",
    "Login": "Login",
    "Signup": "Signup",
    "Logout": "Logout",
    "Dashboard": "Dashboard",
    "Settings": "Settings",
    "Privacy Policy": "Privacy Policy",
    "Terms of Service": "Terms of Service",
    "Our Mission": "Humara Mission",
    "Our Team": "Humari Team",
    "Vendor Radar": "Vendor Radar",
    "Consumer Radar": "Consumer Radar",
    "Track Orders": "Orders Track Karo",
    "Live Location": "Live Location",
    "Smart Routing": "Smart Routing",
    "Follow Us": "Follow Karo",
    "Quick Links": "Quick Links",
    "Newsletter": "Newsletter",
    "Subscribe": "Subscribe",
    "Send": "Bhejo",
    "Copyright": "Copyright",
    "All rights reserved": "All rights reserved",
    "Made with love": "Love se banaya",
    "Back to top": "Wapas upar jao",
    "Success": "Success",
    "Error": "Error",
    "Loading": "Loading ho raha hai...",
    "Vendor": "Vendor",
    "Consumer": "Consumer",
    "Join our community": "Community join karo",
    "Explore": "Explore karo",
    "Get Started": "Shuru karo",
    "Read More": "Aur padho",
    "Download": "Download",
    "Blog": "Blog",
    "Careers": "Careers",
    "Help Center": "Help Center",
    "FAQ": "FAQ",
    "Tech Thela AI": "Tech Thela AI",
    "Waitre": "Tech Thela",
    "Join Now": "Join Now",
    "Location": "Location",
    "Search": "Search karo",
    "Update Inventory": "Inventory Update Karo",
    "Scanning": "Scanning ho raha hai...",
    "No Items Detected": "Kuch nahi mila",
    "Try Again": "Phir se try karo",
    "Go Online": "Online Jao",
    "Go Offline": "Offline Jao",
    "Market Insights": "Market Ki Baatein",
    "Leaderboard": "Top Vendors"
  },
  es: {
    "Home": "Inicio",
    "About": "Nosotros",
    "Contact": "Contacto",
    "Services": "Servicios",
    "Pricing": "Precios",
    "Login": "Entrar",
    "Signup": "Registrarse",
    "Logout": "Salir",
    "Dashboard": "Panel",
    "Tech Thela AI": "Tech Thela AI",
    "Waitre": "Tech Thela",
    "Join Now": "Únete Ahora",
    "Update Inventory": "Actualizar Inventario",
    "Scanning": "Escaneando...",
    "No Items Detected": "No se detectaron artículos"
  },
  fr: {
    "Home": "Acceuil",
    "About": "À Propos",
    "Contact": "Contact",
    "Services": "Services",
    "Pricing": "Tarification",
    "Login": "Connexion",
    "Signup": "S'inscrire",
    "Logout": "Déconnexion",
    "Dashboard": "Tableau de bord",
    "Tech Thela AI": "Tech Thela AI",
    "Waitre": "Tech Thela",
    "Join Now": "Rejoindre maintenant",
    "Update Inventory": "Mise à jour de l'inventaire",
    "Scanning": "Analyse en cours...",
    "No Items Detected": "Aucun article détecté"
  }
};

const translationCache = global.__ttaiTranslationCache || new Map();
global.__ttaiTranslationCache = translationCache;
global.__ttaiTranslationCacheReady = global.__ttaiTranslationCacheReady || false;
global.__ttaiTranslationCacheWriteTimer = global.__ttaiTranslationCacheWriteTimer || null;

function makeCacheKey(targetLanguageCode, text) {
  return `${targetLanguageCode}::${text}`;
}

async function loadCacheFromDisk() {
  if (global.__ttaiTranslationCacheReady) return;

  try {
    const raw = await fs.readFile(CACHE_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.entries)) {
      parsed.entries.forEach(([key, value]) => {
        if (!key || !value) return;
        translationCache.set(key, value);
      });
    }
  } catch (error) {
    // No cache file is expected on first run.
  } finally {
    global.__ttaiTranslationCacheReady = true;
  }
}

async function flushCacheToDisk() {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE_PATH), { recursive: true });
    const payload = JSON.stringify({ entries: Array.from(translationCache.entries()) });
    await fs.writeFile(CACHE_FILE_PATH, payload, "utf8");
  } catch (error) {
    // Ignore disk write errors to avoid breaking runtime translation.
  }
}

function scheduleCacheFlush() {
  if (global.__ttaiTranslationCacheWriteTimer) {
    clearTimeout(global.__ttaiTranslationCacheWriteTimer);
  }

  global.__ttaiTranslationCacheWriteTimer = setTimeout(() => {
    global.__ttaiTranslationCacheWriteTimer = null;
    flushCacheToDisk();
  }, CACHE_FLUSH_DELAY_MS);
}

function getCachedTranslation(targetLanguageCode, text) {
  const key = makeCacheKey(targetLanguageCode, text);
  const entry = translationCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.updatedAt > CACHE_TTL_MS) {
    translationCache.delete(key);
    return null;
  }

  return entry.value;
}

function setCachedTranslation(targetLanguageCode, text, translatedText) {
  const key = makeCacheKey(targetLanguageCode, text);
  translationCache.set(key, {
    value: translatedText,
    updatedAt: Date.now(),
  });

  if (translationCache.size > MAX_CACHE_SIZE) {
    const firstKey = translationCache.keys().next().value;
    if (firstKey) translationCache.delete(firstKey);
  }

  scheduleCacheFlush();
}

function applyProviderResultToCache(targetLanguageCode, sourceTexts, result) {
  if (!result?.translated || !Array.isArray(result.translations)) return;
  sourceTexts.forEach((sourceText, index) => {
    const translated = result.translations[index] || sourceText;
    setCachedTranslation(targetLanguageCode, sourceText, translated);
  });
}

function mapToLibreCode(code) {
  const mapping = {
    en: "en",
    hi: "hi",
    bn: "bn",
    gu: "gu",
    kn: "kn",
    ml: "ml",
    mr: "mr",
    ne: "ne",
    or: "or",
    pa: "pa",
    ta: "ta",
    te: "te",
    ur: "ur",
    as: "as",
  };

  // Hinglish is not a standard MT target; nearest fallback is Hindi.
  if (code === "hinglish") return "hi";
  return mapping[code] || null;
}

function mapToMyMemoryCode(code) {
  const mapping = {
    en: "en",
    hi: "hi",
    bn: "bn",
    gu: "gu",
    kn: "kn",
    ml: "ml",
    mr: "mr",
    ne: "ne",
    or: "or",
    pa: "pa",
    ta: "ta",
    te: "te",
    ur: "ur",
    as: "as",
  };

  if (code === "hinglish") return "hi";
  return mapping[code] || null;
}

async function translateWithMyMemory(texts, targetLanguageCode) {
  const target = mapToMyMemoryCode(targetLanguageCode);
  if (!target) {
    return {
      translations: texts,
      translated: false,
      provider: "mymemory",
      reason: "unsupported_target_in_free_engine",
    };
  }

  try {
    const translations = await Promise.all(
      texts.map(async (input) => {
        const query = new URLSearchParams({
          q: input,
          langpair: `en|${target}`,
        });

        const response = await fetch(`${MYMEMORY_API_URL}?${query.toString()}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`MyMemory HTTP ${response.status}`);
        }

        const data = await response.json();
        const translated = data?.responseData?.translatedText;
        return translated || input;
      })
    );

    return {
      translations,
      translated: true,
      provider: "mymemory",
    };
  } catch (error) {
    return {
      translations: texts,
      translated: false,
      provider: "mymemory",
      reason: "free_engine_request_failed",
    };
  }
}

async function translateWithLibreTranslate(texts, targetLanguageCode) {
  const target = mapToLibreCode(targetLanguageCode);
  if (!target) {
    return {
      translations: texts,
      translated: false,
      provider: "libretranslate",
      reason: "unsupported_target_in_free_engine",
    };
  }

  const configuredEndpoint = process.env.LIBRETRANSLATE_URL;
  const endpoints = configuredEndpoint
    ? [configuredEndpoint, DEFAULT_LIBRETRANSLATE_URL, PUBLIC_LIBRETRANSLATE_URL]
    : [DEFAULT_LIBRETRANSLATE_URL, PUBLIC_LIBRETRANSLATE_URL];
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;

  for (const endpoint of endpoints) {
    try {
      const translated = await Promise.all(
        texts.map(async (input) => {
          const payload = {
            q: input,
            source: "auto",
            target,
            format: "text",
            ...(apiKey ? { api_key: apiKey } : {}),
          };

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`LibreTranslate HTTP ${response.status}`);
          }

          const data = await response.json();
          return data?.translatedText || input;
        })
      );

      return {
        translations: translated,
        translated: true,
        provider: "libretranslate",
        endpoint,
      };
    } catch (error) {
      // Try next endpoint.
    }
  }

  return {
    translations: texts,
    translated: false,
    provider: "libretranslate",
    reason: "free_engine_request_failed",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { texts = [], targetLanguage = "English", targetLanguageCode = "en" } = req.body || {};
  await loadCacheFromDisk();

  if (!Array.isArray(texts)) {
    return res.status(400).json({ error: "texts must be an array" });
  }

  const sanitized = texts.map((item) => (typeof item === "string" ? item : String(item ?? "")));
  if (sanitized.length === 0) {
    return res.status(200).json({ translations: [], translated: true, provider: "none" });
  }

  const translations = new Array(sanitized.length);
  const uncachedTexts = [];
  const uncachedIndexes = [];

  sanitized.forEach((text, index) => {
    const cached = getCachedTranslation(targetLanguageCode, text);
    if (cached !== null) {
      translations[index] = cached;
      return;
    }

    uncachedTexts.push(text);
    uncachedIndexes.push(index);
  });

  // Try COMMON_STRINGS mapping first as a zero-cost, high-reliability tier
  const dict = COMMON_STRINGS[targetLanguageCode];
  if (dict) {
    const stillUncachedTexts = [];
    const stillUncachedIndexes = [];

    uncachedTexts.forEach((text, i) => {
      const idx = uncachedIndexes[i];
      const normalized = text.trim().toLowerCase();
      
      // Try exact, then partial matches for common UI patterns
      const match = Object.keys(dict).find(key => {
        const k = key.toLowerCase();
        return normalized === k || 
               normalized === `${k} us` || 
               normalized === `${k} now` ||
               normalized === `all ${k}` ||
               normalized.startsWith(k);
      });

      if (match) {
        translations[idx] = dict[match];
        setCachedTranslation(targetLanguageCode, text, dict[match]);
      } else {
        stillUncachedTexts.push(text);
        stillUncachedIndexes.push(idx);
      }
    });

    // Update pointers to only fetch what remains
    uncachedTexts.length = 0;
    uncachedTexts.push(...stillUncachedTexts);
    uncachedIndexes.length = 0;
    uncachedIndexes.push(...stillUncachedIndexes);
  }

  if (uncachedTexts.length === 0) {
    return res.status(200).json({
      translations,
      translated: true,
      provider: "common_dictionary",
      cache: { hit: sanitized.length, miss: 0 },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let geminiFailed = false;

  if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelCandidates = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-1.5-pro"
    ];

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
Translate each input text into ${targetLanguage}.

Rules:
1) Keep brand names, product names, URLs, emails, phone numbers, IDs unchanged.
2) Preserve punctuation, formatting, and sentence intent.
3) Return ONLY valid JSON object with key "translations" whose value is an array of translated strings in the exact same order and same length.

Input JSON:
${JSON.stringify({ texts: uncachedTexts })}
`;

        const result = await model.generateContent(prompt);
        const raw = result?.response?.text?.() || "";

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.translations) && parsed.translations.length === uncachedTexts.length) {
            applyProviderResultToCache(targetLanguageCode, uncachedTexts, {
              translated: true,
              translations: parsed.translations,
            });

            uncachedIndexes.forEach((index, idx) => {
              translations[index] = parsed.translations[idx] || sanitized[index];
            });

            return res.status(200).json({
              translations,
              translated: true,
              provider: `gemini (${modelName})`,
              cache: { hit: sanitized.length - uncachedTexts.length, miss: uncachedTexts.length },
            });
          }
        }
        // If we got here but no break, it failed parsing - don't retry same model
      } catch (error) {
        const errorMsg = error.message.toLowerCase() || "";
        if (
          errorMsg.includes("429") || 
          errorMsg.includes("quota") || 
          errorMsg.includes("limit") || 
          errorMsg.includes("404") || 
          errorMsg.includes("not found") ||
          errorMsg.includes("not supported")
        ) {
          console.warn(`Gemini Model ${modelName} hit limit or is unavailable. Trying next...`);
          continue; // Try next model in candidate list
        }
        console.error(`Gemini Error (${modelName}):`, errorMsg);
        geminiFailed = true;
        break; // Non-recoverable error, move to standard fallbacks
      }
    }
  }

  // Fallback to LibreTranslate if Gemini is missing or failed
  const libreResult = await translateWithLibreTranslate(uncachedTexts, targetLanguageCode);
  applyProviderResultToCache(targetLanguageCode, uncachedTexts, libreResult);
  
  if (libreResult.translated) {
    uncachedIndexes.forEach((index, idx) => {
      translations[index] = libreResult.translations[idx] || sanitized[index];
    });
    return res.status(200).json({
      ...libreResult,
      translations,
      cache: { hit: sanitized.length - uncachedTexts.length, miss: uncachedTexts.length },
    });
  }

  // Final fallback to MyMemory
  const myMemoryResult = await translateWithMyMemory(uncachedTexts, targetLanguageCode);
  applyProviderResultToCache(targetLanguageCode, uncachedTexts, myMemoryResult);
  
  if (myMemoryResult.translated) {
    uncachedIndexes.forEach((index, idx) => {
      translations[index] = myMemoryResult.translations[idx] || sanitized[index];
    });
    return res.status(200).json({
      ...myMemoryResult,
      translations,
      cache: { hit: sanitized.length - uncachedTexts.length, miss: uncachedTexts.length },
    });
  }

  // Last resort: return original texts
  uncachedIndexes.forEach((index) => {
    translations[index] = sanitized[index];
  });
  return res.status(200).json({
    translations,
    translated: false,
    provider: "none",
    reason: "all_providers_failed",
    cache: { hit: sanitized.length - uncachedTexts.length, miss: uncachedTexts.length },
  });
}
