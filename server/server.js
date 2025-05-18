
const express = require('express');
const { chromium } = require('playwright');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('dist'));

// API endpoint to handle text-to-speech conversion
app.post('/api/text-to-speech', async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text input' });
  }

  try {
    const audioBuffer = await getSpeechmaAudio(text, voiceId || 'en-US-GuyNeural');
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

async function getSpeechmaAudio(text, voice) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36"
  });
  
  try {
    const page = await context.newPage();
    await page.goto("https://speechma.com/", { timeout: 60000 });

    await page.fill("textarea#inputText", text);
    await page.selectOption("select#selectVoice", voice);
    await page.click("button:has-text('Convert')");
    await page.waitForSelector("audio", { timeout: 30000 });

    const audioUrl = await page.getAttribute("audio", "src");
    if (!audioUrl) throw new Error("No audio found");

    const buffer = await page.evaluate(async (url) => {
      const res = await fetch(url);
      const arr = await res.arrayBuffer();
      return Array.from(new Uint8Array(arr));
    }, audioUrl);

    return Buffer.from(buffer);
  } finally {
    await browser.close();
  }
}

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
