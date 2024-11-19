const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const pool = require('./db/conn');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true,
}))

app.use(express.json());

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/usuarios/insertusuarios', (req, res) => {
    const nome = req.body.nome
    const email = req.body.email
    const fone = req.body.fone
    const data_nascimento = req.body.data_nascimento

    const sql = `INSERT INTO usuarios (??, ??, ??, ??) VALUES (?, ?, ?, ?)`;
    const data = ['nome', 'email', 'fone', 'data_nascimento', nome, email, fone, data_nascimento];

    pool.query(sql, data, function (err) {
        if (err) return console.log(err);
        console.log("Inserido com sucesso!");
        res.redirect('/usuarios');
    })
});

app.get('/usuarios', (req, res) => {
    const sql = `SELECT * FROM usuarios`;

    pool.query(sql, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        const usuarios = data

        res.render('usuarios', { usuarios });
    });
});

app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM usuarios WHERE ?? = ?`;
    const data = ['id', id];

    pool.query(sql, data, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        const usuario = data[0]

        res.render('usuario', { usuario });
    });
});

app.get('/usuarios/edit/:id', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM usuarios WHERE ?? = ?`;
    const data = ['id', id];

    pool.query(sql, data, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        const usuario = data[0]

        res.render('editusuario', { usuario });
    });
});

app.post('/usuarios/updateusuario', (req, res) => {

    const id = req.body.id;
    const nome = req.body.nome
    const email = req.body.email
    const fone = req.body.fone
    const data_nascimento = req.body.data_nascimento

    const sql = `UPDATE usuarios SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?`;
    const data = ['nome', nome, 'email', email, 'fone', fone, 'data_nascimento', data_nascimento, 'id', id];

    pool.query(sql, data, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect("/usuarios");
    });
});

app.post('/usuarios/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM usuarios WHERE ?? = ?`;
    const data = ['id', id];

    pool.query(sql, data, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect("/usuarios");
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
})