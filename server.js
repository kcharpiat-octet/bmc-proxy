const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { apiKey, ...body } = req.body;
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) return res.status(401).json({ error: 'Clé API manquante' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT || 3000, () => console.log('Proxy démarré'));
