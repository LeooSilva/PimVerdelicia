const sqlite3 = require('sqlite3').verbose();

// Cria ou abre o arquivo do banco de dados SQLite
const db = new sqlite3.Database('./meu_banco.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco SQLite:', err);
  } else {
    console.log('Conectado ao banco SQLite.');
  }
});

module.exports = db;
