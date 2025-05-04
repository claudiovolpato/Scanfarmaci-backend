# 📦 ScanFarmaci WebApp + Supabase

WebApp HTML+JS per la scansione di codici a barre di farmaci, con salvataggio su **Supabase** (PostgreSQL) e hosting gratuito su **Vercel**.

---

## 🚀 Funzionalità
- Scansione codici a barre (con `BarcodeDetector`)
- Inserimento descrizione + quantità
- Salvataggio su Supabase:
  - `descrizioni` (codice, descrizione)
  - `scansioni` (codice, quantita, dataora)
- Visualizzazione delle scansioni salvate

---

## 🛠 Prerequisiti
- [Account Supabase](https://supabase.com) gratuito
- [Account Vercel](https://vercel.com) gratuito
- [GitHub](https://github.com/) per il deploy automatico

---

## 🔧 Configurazione Supabase

### 1. Crea un nuovo progetto
Vai su [app.supabase.com](https://app.supabase.com), crea un progetto.

### 2. Crea le tabelle
Vai su SQL editor e incolla:

```sql
create table descrizioni (
  codice text primary key,
  descrizione text not null
);

create table scansioni (
  id serial primary key,
  codice text references descrizioni(codice),
  quantita int not null,
  dataora timestamp default current_timestamp
);
```

### 3. Ottieni URL e chiave anonima
Vai su **Settings > API**:
- `SUPABASE_URL`
- `SUPABASE_KEY`

---

## 🚀 Deploy su Vercel

1. Fai fork/clona questo repo
2. Vai su [vercel.com](https://vercel.com)
3. Crea nuovo progetto, collega il repo GitHub
4. Aggiungi due Environment Variables:
   - `SUPABASE_URL` = l'URL del tuo progetto Supabase
   - `SUPABASE_KEY` = la chiave anon (public)
5. Deploy!

---

## 📱 Uso

- Clicca "Scansiona articolo"
- Dopo la lettura, inserisci descrizione e quantità
- I dati vengono salvati su Supabase
- Clicca "Scarica scansioni" per visualizzare tutto

---

## ℹ️ Note
- Richiede HTTPS e browser compatibile con `BarcodeDetector`
- L'account gratuito Supabase sospende i progetti inattivi (può impiegare ~5-10s per riattivarsi)
- Per mantenerlo attivo, puoi usare un ping periodico da GitHub Actions

---

© 2024 – Progetto ScanFarmaci
