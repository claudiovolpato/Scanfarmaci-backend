from flask import Flask, request, jsonify
import psycopg2
import os
from datetime import datetime

app = Flask(__name__)

DB_URL = os.environ.get("DATABASE_URL")  # Render imposta questa variabile automaticamente

conn = psycopg2.connect(DB_URL, sslmode='require')
cursor = conn.cursor()

@app.route("/descrizioni", methods=["GET"])
def get_descrizioni():
    cursor.execute("SELECT codice, descrizione FROM descrizioni")
    rows = cursor.fetchall()
    return jsonify({r[0]: r[1] for r in rows})

@app.route("/salva", methods=["POST"])
def salva_descrizione():
    data = request.get_json()
    codice = data.get("codice")
    descrizione = data.get("descrizione")
    if not codice or not descrizione:
        return "Dati mancanti", 400
    cursor.execute("""
        INSERT INTO descrizioni (codice, descrizione)
        VALUES (%s, %s)
        ON CONFLICT (codice) DO UPDATE SET descrizione = EXCLUDED.descrizione
    """, (codice, descrizione))
    conn.commit()
    return "OK"

@app.route("/scansione", methods=["POST"])
def salva_scansione():
    data = request.get_json()
    codice = data.get("codice")
    quantita = data.get("quantita")
    if not codice or not quantita:
        return "Dati mancanti", 400
    cursor.execute("""
        INSERT INTO scansioni (codice, quantita, dataora)
        VALUES (%s, %s, %s)
    """, (codice, quantita, datetime.now()))
    conn.commit()
    return "Scansione salvata"

@app.route("/scansioni", methods=["GET"])
def get_scansioni():
    cursor.execute("""
        SELECT s.id, s.codice, d.descrizione, s.quantita, s.dataora
        FROM scansioni s
        LEFT JOIN descrizioni d ON s.codice = d.codice
        ORDER BY s.dataora DESC
    """)
    rows = cursor.fetchall()
    return jsonify([
        {
            "id": r[0],
            "codice": r[1],
            "descrizione": r[2],
            "quantita": r[3],
            "dataora": r[4].isoformat()
        } for r in rows
    ])

@app.route("/")
def index():
    return "ScanFarmaci backend attivo"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
