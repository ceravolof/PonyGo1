const express = require ('express');
const sqlite3 = require ('sqlite3').verbose();
const app = express();
const port = 3000;

let db = new sqlite3.Database('./database.db',(err)=>{
    if(err){
        return console.error(err.message);
    }
    console.log('Connesso al database SQLite');
});

app.use(express.json());

db.run(`CREATE TABLEID NOT EXISTS utenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    citta TEXT,
    titolostudio TEXT
    )`);

    app.post('/utenti',(req,res)=> {
        const {nome,email,citta,titolostudio} = req.body;
        db.run(`INSERT INTO utenti (nome,email,citta,titolostudio) VALUES (?,?,?,?) , ` [nome,email,citta,titolostudio], (err)=>{
            if (err){
                return res.status(500).json({error:err.message});
            }
            res.json({message:'Nuovo utente creato',id: this.lastID});
        });
    });

app.get('/utenti',(req,res)=>{
    db.all('SELECT * FROM utenti',[], (err,rows)=>{
        if(err){
            return res.status(500).json({eror: err.message});
        }
        res.json({users:row});
    });
});

app.put('/utenti/:id',(req,res)=> {
    const {id} = req.params;
    const {nome,email,citta,titolostudio} =req.body;
    db.run(
        `UPDATE utenti SET nome = ?, email = ?,citta = ? , titolosudio =?, WHERE id = ?`,
        [nome,email,citta,titolostudio,id],
        function(err){
            if(err){
                return res.status(500).json({error: err.message});
            }
            if (this.changes === 0){
                return res.status(404).json({message:'Utente non trovato'});
            }
            res.json({message: 'Utente aggiornato con successo'});
        }
    );
});

app.delete('/utenti:id', (req,res)=>{
    const {id} = req.params;
    db.run(`DELETE FROM utenti WHERE id = ?`,[id], function(err){
        if (err){
            return res.status(500).json({error: err.message});
        }
        if(this.changes ===0){
            return res.status(404).json({message:'Utente non trovato'})
        }
        res.json({message: 'Utente cancellato con successo'})
    });
});

app.get('/utenti/:city',(req,res))
