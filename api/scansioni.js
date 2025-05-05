// api/scansioni.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { codice, quantita, dataora } = req.body;

  if (!codice || !quantita) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  try {
    const response = await fetch(`${url}/rest/v1/scansioni`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        codice,
        quantita,
        dataora: dataora || new Date().toISOString()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Errore:", err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}
