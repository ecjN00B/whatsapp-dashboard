require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static('www'));
app.use('/files', express.static(__dirname + '/files'));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const bodyParser = require('body-parser');
const port = process.env.PORT || 8082;

const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
app.use('/', router);

router.get('/perfil', (req, res) =>{
    execSQLQuery(`SELECT * FROM perfil`, res);
});

router.get('/conversa', (req, res) =>{
  var phone = req.query.phone;
  execSQLQuery(`SELECT * FROM coleta WHERE phone='${phone}'`, res);
});

router.get('/status', (req, res) =>{
  var id = req.query.id;
  execSQLQuery(`SELECT * FROM envio WHERE msgId='${id}'`, res);
});

router.get('/media', (req, res) =>{
  var filehash = req.query.filehash;
  execSQLQuery(`SELECT * FROM media WHERE filehash='${filehash}'`, res);
});

app.listen(port);
console.log('http://localhost:' + port);

function conectar(){
  connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
  });
}
 
function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    charset : 'utf8mb4',
    timezone: 'utc'
  });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
  });
}






function Inserir(nmCampanha, tipoCampanha, desc, anMSG, tpMSG, txtMSG, aqvEnvio, vcard, arqContato, bdn, qtd, dat, respo){
  connection.connect();
  const sql = "INSERT INTO dbenvio VALUES ?";
  const values = [nmCampanha, 
                  tipoCampanha, 
                  desc, anMSG, 
                  tpMSG, txtMSG, 
                  aqvEnvio, 
                  vcard, 
                  arqContato, 
                  bdn, 
                  qtd, 
                  dat, 
                  respo
                 ];
  connection.query(sql, [values], function (error, results, fields){
          if(error) return console.log(error);
          console.log('adicionou registros!');
          connection.end();
      });
}