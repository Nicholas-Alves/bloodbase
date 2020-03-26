//IMPORTS
const express = require('express');
const nunjucks = require('nunjucks');
const Pool = require('pg').Pool;

//CONFIGURAÇÃO DO SERVIDOR
const server = express();
server.use(express.static('public'));
server.use(express.urlencoded({
    extended: true
}));

//CONFIGURAÇÃO DO BANCO DE DADOS (POSTGRES)
const db = new Pool({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'dbBloodBase'
});

//CONFIGURAÇÃO DO NUNJUCKS
nunjucks.configure('./', {
    express: server,
    noCache: true
});

//ROTAS
server.get('/', (req, res) => {
    db.query('select * from "tbDonor"', (err, result) => {
        if(err){
            console.error(err)
            res.send('Erro no banco de dados');
        }

        const donors = result.rows;
        res.render('index.html', { donors })
    })
});

server.post('/', (req, res) => {
    const { name, email, blood } = req.body;

    if(name == '' || email == '' || blood == '') return res.send('Todos os campos são obrigatórios.');

    const cmd = `insert into "tbDonor" (name, email, blood) values ($1, $2, $3)`
    const values = [name, email, blood];

    db.query(cmd, values, (err) => {
        if(err){
            console.error(err)
            return res.send('Erro no banco de dados');
        }        
        res.redirect('/');
    });
})

//INICIANDO O SERVIDOR
server.listen(3000, () => console.log('Servidor iniciado'));
