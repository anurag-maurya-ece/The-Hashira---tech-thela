import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";

const WEBSITE_CONTEXT = `
You are the AI support assistant for Tech Thela AI, a hyper-local street vendor platform.

Platform facts:
- User roles: Customer, Vendor, Enterprise.
- Core features: live vendor map tracking, vendor location updates, nearby vendors, reviews/ratings, subscription pricing pages, payment/checkout flows, login/signup routes.
- Common pages: Home, Enterprise, About, Vendor pricing, Customer pricing, Customer login, Vendor login, payment pages.
- User goals: discover nearby vendors, track vendors in real-time, resolve login/payment issues, understand plans/pricing, use vendor tools and customer dashboards.

Response behavior:
- Give practical, concise steps focused on this website and its flows.
- If asked something outside this product, gently steer back to Tech Thela use-cases.
- Never claim actions were completed unless user confirms.
- If information is missing, suggest where in the app the user should go next.
`;

function getLanguageInstruction(language) {
  const languageMap = {
    as: "Assamese",
    bn: "Bengali",
    brx: "Bodo",
    doi: "Dogri",
    gu: "Gujarati",
    kn: "Kannada",
    ks: "Kashmiri",
    kok: "Konkani",
    mai: "Maithili",
    ml: "Malayalam",
    mni: "Manipuri",
    mr: "Marathi",
    ne: "Nepali",
    or: "Odia",
    pa: "Punjabi",
    sa: "Sanskrit",
    sat: "Santali",
    sd: "Sindhi",
    ta: "Tamil",
    te: "Telugu",
    ur: "Urdu",
  };

  if (language === "hi") {
    return "Reply only in Hindi using clear and simple wording.";
  }
  if (language === "hinglish") {
    return "Reply in Hinglish (Hindi + English mix), friendly and concise.";
  }
  if (languageMap[language]) {
    return `Reply only in ${languageMap[language]} using natural native script.`;
  }
  return "Reply in English.";
}

function fallbackReply(language) {
  if (language === "hi") {
    return "चैटबॉट चल रहा है, लेकिन Gemini key अभी configured नहीं है। कृपया admin से कहें कि GEMINI_API_KEY सेट करें। तब तक आप login, pricing, vendor tracking, और payment flow के लिए वेबसाइट मेन्यू का उपयोग करें।";
  }
  if (language === "hinglish") {
    return "Chatbot chal raha hai, but Gemini key abhi configured nahi hai. Admin se bolo GEMINI_API_KEY set kare. Tab tak aap login, pricing, vendor tracking aur payment flows website menu se use kar sakte ho.";
  }
  return "The chatbot is active, but Gemini key is not configured yet. Ask your admin to set GEMINI_API_KEY. Meanwhile, use the website menu for login, pricing, vendor tracking, and payment flows.";
}

function isGeminiUnavailable(error) {
  const msg = (error?.message || "").toLowerCase();
  return (
    msg.includes("api key") ||
    msg.includes("permission") ||
    msg.includes("unauth") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("429")
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ reply: fallbackReply(req.body?.language || "en") });
  }

  const { message, language = "en", history = [] } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const compactHistory = Array.isArray(history)
      ? history
          .slice(-8)
          .map((item) => `${item.role === "user" ? "User" : "Assistant"}: ${item.content}`)
          .join("\n")
      : "";

    const prompt = `
${WEBSITE_CONTEXT}
${getLanguageInstruction(language)}

Conversation so far:
${compactHistory || "(no previous messages)"}

User message:
${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result?.response?.text?.()?.trim();

    if (!reply) {
      return res.status(502).json({ error: "Empty response from Gemini" });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    if (isGeminiUnavailable(error)) {
      return res.status(200).json({ reply: fallbackReply(language) });
    }

    return res.status(500).json({
      error: "Gemini request failed",
      details: error?.message || "Unknown error",
    });
  }
}
