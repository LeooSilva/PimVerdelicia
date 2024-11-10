const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser

const app = express();
app.use(bodyParser.json()); // Certifique-se de que essa linha está presente

const cors = require('cors');
app.use(cors()); // Permite requisições de outras origens
app.use(cookieParser()); // Use cookie-parser


// Conectar ao banco de dados verdelicia.db
const db = new sqlite3.Database('./verdelicia.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados verdelicia.db.');
  }
});

// Rota de cadastro inicial
app.post('/cadastro', (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  const query = 'INSERT INTO Usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
  db.run(query, [nome, email, senha, telefone], function (err) {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      } else {
          res.json({ message: 'Cadastro realizado com sucesso!', userId: this.lastID });
      }
  });
});


// Código do servidor para tratar a segunda etapa do cadastro
app.post('/cadastro-etapa2', (req, res) => {
  const { endereco, complemento, cep, cpf, userId } = req.body;

  // Valida se todos os dados necessários estão presentes
  if (!userId || !endereco || !cep || !cpf) {
      return res.status(400).json({ error: 'Dados incompletos para atualizar o cadastro.' });
  }

  const query = `UPDATE Usuarios SET endereco = ?, complemento = ?, cep = ?, cpf = ? WHERE id = ?`;
  db.run(query, [endereco, complemento, cep, cpf, userId], function (err) {
      if (err) {
          console.error('Erro ao atualizar o cadastro:', err);
          res.status(500).json({ error: 'Erro ao atualizar o cadastro.' });
      } else {
          res.json({ message: 'Cadastro atualizado com sucesso!' });
      }
  });
});

app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
  }

  // Consulta para verificar nome e senha no banco de dados
  const query = 'SELECT id FROM Usuarios WHERE nome = ? AND senha = ?';
  db.get(query, [nome, senha], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário no banco de dados:', err);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Login bem-sucedido
    res.json({ message: 'Login realizado com sucesso!', userId: user.id });
  });
});





// Exemplo de inserção de dados na tabela PESSOA
app.post('/pessoa', (req, res) => {
  const { nome, cpf } = req.body;
  console.log('Dados recebidos:', req.body); // Adiciona este log para ver os dados

  const query = `INSERT INTO PESSOA (NOM_STR_PES, CPF_STR_PES) VALUES (?, ?)`;
  db.run(query, [nome, cpf], function(err) {
    if (err) {
      console.error('Erro ao inserir dados:', err.message);
      res.status(500).send('Erro ao inserir dados na tabela PESSOA');
    } else {
      res.send(`Pessoa inserida com sucesso! ID: ${this.lastID}`);
    }
  });
});


// Exemplo de consulta a dados na tabela PESSOA
app.get('/pessoas', (req, res) => {
  const query = `SELECT * FROM PESSOA`;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send('Erro ao buscar dados');
    } else {
      res.json(rows);
    }
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
