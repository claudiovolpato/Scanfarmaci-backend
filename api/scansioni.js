export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };

  if (req.method === 'POST') {
    const { codice, quantita, dataora } = req.body;

    if (!codice || !quantita) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }

    const resp = await fetch(`${url}/rest/v1/scansioni`, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        codice,
        quantita,
        dataora: dataora || new Date().toISOString()
      })
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data });

    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'GET') {
    const from = req.query.from;
    const to = req.query.to;

    if (!from || !to) {
      return res.status(400).json({ error: 'Parametri "from" e "to" richiesti' });
    }

    // ISO 8601 con orario per compatibilità con Supabase (timestamp)
    const fromISO = `${from}T00:00:00`;
    const toISO = `${to}T23:59:59`;

    const query = `${url}/rest/v1/scansioni?select=id,codice,quantita,dataora,descrizioni(descrizione)&dataora=gte.${fromISO}&dataora=lte.${toISO}&order=dataora.desc`;

    const resp = await fetch(query, { headers });
    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: data });

    const mapped = data.map(r => ({
      id: r.id,
      codice: r.codice,
      descrizione: r.descrizioni?.descrizione || '',
      quantita: r.quantita,
      dataora: r.dataora
    }));

    return res.status(200).json(mapped);
  }

  if (req.method === 'DELETE') {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID mancante per la cancellazione' });
  }

  const deleteUrl = `${url}/rest/v1/scansioni?id=eq.${id}`;
  const resp = await fetch(deleteUrl, {
    method: 'DELETE',
    headers
  });

  if (!resp.ok) {
    const err = await resp.text();
    return res.status(resp.status).json({ error: err });
  }

  return res.status(200).json({ success: true });
}
  return res.status(405).json({ error: 'Metodo non consentito' });
}
