export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const endpoint = `${SUPABASE_URL}/rest/v1/descrizioni`;
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  if (req.method === 'GET') {
    const resp = await fetch(endpoint, { headers });
    const data = await resp.json();
    const dict = {};
    data.forEach(row => dict[row.codice] = row.descrizione);
    return res.status(200).json(dict);

  } else if (req.method === 'POST') {
    const { codice, descrizione } = req.body;
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify([{ codice, descrizione }])
    });
    const result = await resp.json();
    return res.status(200).json(result);

  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
