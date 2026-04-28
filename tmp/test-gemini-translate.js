const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment; set process.env.GEMINI_API_KEY to run this test.");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const targetLanguage = "Spanish";
  const uncachedTexts = ["Home", "Join Now", "Enterprise"];

  const prompt = `
Translate each input text into ${targetLanguage}.

Rules:
1) Keep brand names, product names, URLs, emails, phone numbers, IDs unchanged.
2) Preserve punctuation, formatting, and sentence intent.
3) Return ONLY valid JSON object with key "translations" whose value is an array of translated strings in the exact same order and same length.

Input JSON:
${JSON.stringify({ texts: uncachedTexts })}
`;

  try {
    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    console.log("Raw Response:", raw);
    
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log("Parsed JSON:", JSON.parse(jsonMatch[0]));
    } else {
      console.error("No JSON found in response");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

test();
