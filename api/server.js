const cors = require('cors');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connesso al database SQLite');
});

app.use(express.json());


app.use(cors());



db.run(`CREATE TABLE IF NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid TEXT,
    email TEXT,
    passwd TEXT,
    type TEXT
)`);

app.post('/utenti', (req, res) => {
    const { userid, email, passwd, type } = req.body;
    db.run(`INSERT INTO utenti (userid, email, passwd, type) VALUES (?, ?, ?, ?)`,
        [userid, email, passwd, type], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Nuovo utente creato', id: this.lastID });
        }
    );
});

// Endpoint: restituisce tutti gli utenti della pizzeria --AJAX - da mettere su sv
app.get('/utenti', (req, res) => {
    db.all('SELECT * FROM utenti', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ users: rows });
    });
});

// Endpoint: restituisce solo i fattorini  -- AJAX - da mettere su sv
app.get('/utenti/fattorini', (req, res) => {
    db.all('SELECT * FROM utenti WHERE type = ?', ['fattorino'], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ fattorini: rows });
    });
});


app.put('/utenti/:id', (req, res) => {
    const { id } = req.params;
    const { userid, email, passwd, type } = req.body;
    db.run(
        `UPDATE utenti SET userid = ?, email = ?, passwd = ?, type = ? WHERE id = ?`,
        [userid, email, passwd, type, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }
            res.json({ message: 'Utente aggiornato con successo' });
        }
    );
});

app.delete('/utenti/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM utenti WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.json({ message: 'Utente cancellato con successo' });
    });
});

// Endpoint di login (autenticazione)
app.post('/login', (req, res) => {
    const { email, passwd } = req.body;
    
    // Trova l'utente con l'email inserita
    db.get('SELECT * FROM utenti WHERE email = ? AND passwd = ?', [email, passwd], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }
        // Se l'utente esiste e la password è corretta
        res.json({ message: 'Autenticazione avvenuta con successo', user: row });
    });
});


process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Chiusura del database.');
        process.exit(0);
    });
});

app.listen(port, () => {
    console.log(`Server API in esecuzione su http://localhost:${port}`);
});
