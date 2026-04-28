const DEFAULT_LIBRETRANSLATE_URL = "http://localhost:5000/translate";
const MYMEMORY_API_URL = "https://api.mymemory.translated.net/get";

function getBaseUrl(translateUrl) {
  if (!translateUrl) return "http://localhost:5000";
  return translateUrl.replace(/\/translate\/?$/, "");
}

export default async function handler(req, res) {
  const libreUrl = process.env.LIBRETRANSLATE_URL || DEFAULT_LIBRETRANSLATE_URL;
  const baseUrl = getBaseUrl(libreUrl);

  const status = {
    libretranslate: {
      configuredUrl: libreUrl,
      healthy: false,
      details: "unknown",
    },
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
    },
    mymemory: {
      healthy: false,
      details: "unknown",
    },
  };

  try {
    const response = await fetch(`${baseUrl}/languages`, { method: "GET" });
    if (!response.ok) {
      status.libretranslate.details = `HTTP ${response.status}`;
      return res.status(200).json(status);
    }

    const languages = await response.json();
    status.libretranslate.healthy = true;
    status.libretranslate.details = "ok";
    status.libretranslate.supportedLanguageCount = Array.isArray(languages) ? languages.length : 0;
    try {
      const probeQuery = new URLSearchParams({ q: "hello", langpair: "en|hi" });
      const mmResponse = await fetch(`${MYMEMORY_API_URL}?${probeQuery.toString()}`);
      status.mymemory.healthy = mmResponse.ok;
      status.mymemory.details = mmResponse.ok ? "ok" : `HTTP ${mmResponse.status}`;
    } catch (error) {
      status.mymemory.details = "unreachable";
    }

    return res.status(200).json(status);
  } catch (error) {
    status.libretranslate.details = "unreachable";
    try {
      const probeQuery = new URLSearchParams({ q: "hello", langpair: "en|hi" });
      const mmResponse = await fetch(`${MYMEMORY_API_URL}?${probeQuery.toString()}`);
      status.mymemory.healthy = mmResponse.ok;
      status.mymemory.details = mmResponse.ok ? "ok" : `HTTP ${mmResponse.status}`;
    } catch (mmError) {
      status.mymemory.details = "unreachable";
    }
    return res.status(200).json(status);
  }
}
