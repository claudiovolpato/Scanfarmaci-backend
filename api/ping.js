export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const endpoint = `${SUPABASE_URL}/rest/v1/descrizioni?select=codice&limit=1`;

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`
  };

  try {
    const supabaseRes = await fetch(endpoint, { headers });
    const data = await supabaseRes.json();
    if (!supabaseRes.ok) {
      return res.status(supabaseRes.status).json({ error: data });
    }
    return res.status(200).json({ status: 'ok', codiceSample: data[0]?.codice || null });
  } catch (err) {
    return res.status(500).json({ error: 'Errore di connessione a Supabase', message: err.message });
  }
}
