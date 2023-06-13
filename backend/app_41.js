const express = require('express'); 
const bodyParser = require('body-parser');                                      //usado para analisar e decodificar os dados enviados pelo formulário
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const sqlite3 = require('sqlite3').verbose();
const DBPATH = './data/db_user.db';

const hostname = '127.0.0.1';
const port = 3000;
const app = express();

/* Colocar toda a parte estática no frontend */
app.use(express.static("./frontend/"));

/* Definição dos endpoints */
/******** CRUD ************/
app.use(express.json());                                                        // permitir que a aplicação Node.js Express.js interprete solicitações HTTP que contenham dados JSON em seus corpos

// Retorna todos registros (é o R do CRUD - Read)
app.get('/usuarios', (req, res) => {                                            //a função app.get() do servidor é usada para definir uma rota GET /usuarios. Quando um cliente faz uma solicitação GET para esta rota, a função de retorno (callback) é executada. Na primeira linha, o callback é definido como uma função anônima (req, res) => { ... } que recebe os objetos req (requisição) e res (resposta) como argumentos.
    res.statusCode = 200;                                                       //o código de status HTTP é definido como 200. O código de status 200 significa que a solicitação foi bem-sucedida.
    res.setHeader('Access-Control-Allow-Origin', '*');                          //permite que qualquer origem (domínio) faça requisições a este endpoint sem restrições de política de mesmo domínio (same-origin policy).
    var db = new sqlite3.Database(DBPATH); // Abre o banco                      //cria uma nova instância da classe Database do sqlite3 e armazena na variável db. O caminho do arquivo do banco de dados é passado como parâmetro para o construtor.
    var sql = 'SELECT * FROM usuario ORDER BY nome_completo COLLATE NOCASE';    //SQL para selecionar todos os registros da tabela usuario e ordená-los pelo campo nome_completo em ordem alfabética, ignorando a distinção entre maiúsculas e minúsculas.
        db.all(sql, [],  (err, rows ) => {                                      //chama o método all() do objeto db para executar a consulta SQL armazenada na variável sql. O método all() é usado para retornar todas as linhas resultantes da consulta em forma de matriz. O primeiro parâmetro é a consulta SQL, o segundo parâmetro é uma matriz de valores para substituir os marcadores de posição na consulta (neste caso, não há marcadores de posição, então uma matriz vazia é passada) e o terceiro parâmetro é uma função de retorno de chamada que será executada quando a consulta for concluída.
            if (err) {
                throw err;                                                      //verifica se ocorreu um erro durante a execução da consulta. Se ocorrer um erro, ele será lançado, o que interromperá a execução do programa e exibirá o erro no console.
            }
            res.json(rows);                                                     //envia uma resposta JSON contendo as linhas resultantes da consulta de volta para o cliente. A variável res é um objeto de resposta HTTP que é passado como parâmetro para a função que contém esse código. O método json() do objeto de resposta é usado para serializar o resultado em um formato JSON.
        });
        db.close(); // Fecha o banco
});

// Insere um registro (é o C do CRUD - Create)
app.post('/insereUsuario', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    sql = "INSERT INTO usuario (nome_completo, email, telefone) VALUES ('" + req.body.nome + "', '" + req.body.email + "', '" + req.body.telefone + "')";
    console.log(sql);
    db.run(sql, [],  err => {
        if (err) {
            throw err;
        }	
    });
    res.write('<p>USUARIO INSERIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
    db.close(); // Fecha o banco
    res.end();
});

// Monta o formulário para o update (é o U do CRUD - Update)
app.get('/atualizaUsuario', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    sql = "SELECT * FROM usuario WHERE userId="+ req.query.userId;              //userId seja igual ao valor passado pela query string da requisição (req.query.userId)
    console.log(sql);
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.all(sql, [],  (err, rows ) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
    db.close(); // Fecha o banco
});

// Atualiza um registro (é o U do CRUD - Update)
app.post('/atualizaUsuario', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    sql = "UPDATE usuario SET nome_completo='" + req.body.nome + "', email = '" + req.body.email + "' , telefone='" + req.body.telefone + "' WHERE userId='" + req.body.userId + "'";
    console.log(sql);
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.run(sql, [],  err => {
        if (err) {
            throw err;
        }
        res.end();
    });
    res.write('<p>USUARIO ATUALIZADO COM SUCESSO!</p><a href="/">VOLTAR</a>');
    db.close(); // Fecha o banco
});

// Exclui um registro (é o D do CRUD - Delete)
app.get('/removeUsuario', urlencodedParser, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    sql = "DELETE FROM usuario WHERE userId='" + req.query.userId + "'";
    console.log(sql);
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    db.run(sql, [],  err => {
        if (err) {
            throw err;
        }
        res.write('<p>USUARIO REMOVIDO COM SUCESSO!</p><a href="/">VOLTAR</a>');
        res.end();
    });
    db.close(); // Fecha o banco
});

app.listen(port, hostname, () => {
console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
