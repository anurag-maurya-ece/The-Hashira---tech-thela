
const fetch = require('node-fetch');

async function testTranslate() {
  const body = {
    texts: ["Hello world", "Contact Us", "Vegetables", "Market"],
    targetLanguageCode: "hi",
    targetLanguage: "Hindi"
  };

  try {
    const res = await fetch('http://localhost:3000/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch Error:', err.message);
  }
}

testTranslate();
