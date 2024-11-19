const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// =================== MIDDLEWARE ===================
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


// =================== BANCO DE DADOS ===================
const db = new sqlite3.Database('./verdelicia.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados verdelicia.db.');
  }
});

// =================== ROTAS ===================

// Cadastro inicial
app.post('/cadastro', (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  if (!nome || !email || !senha || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  const query = 'INSERT INTO Usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
  db.run(query, [nome, email, senha, telefone], function (err) {
    if (err) {
      console.error('Erro ao cadastrar usuário:', err.message);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
    res.status(201).json({ message: 'Cadastro realizado com sucesso!', userId: this.lastID });
  });
});

// Login
app.post('/login', (req, res) => {
  const { nome, senha } = req.body;

  if (!nome || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  }

  const query = 'SELECT id FROM Usuarios WHERE nome = ? AND senha = ?';
  db.get(query, [nome, senha], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário no banco de dados:', err.message);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    res.json({ message: 'Login realizado com sucesso!', userId: user.id });
  });
});

// Atualização do cadastro (segunda etapa)
app.post('/cadastro-etapa2', (req, res) => {
  const { endereco, complemento, cep, cpf, userId } = req.body;
  if (!userId || !endereco || !cep || !cpf) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  const query = `UPDATE Usuarios SET endereco = ?, complemento = ?, cep = ?, cpf = ? WHERE id = ?`;
  db.run(query, [endereco, complemento, cep, cpf, userId], function (err) {
    if (err) {
      console.error('Erro ao atualizar o cadastro:', err.message);
      return res.status(500).json({ error: 'Erro ao atualizar o cadastro.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ message: 'Cadastro atualizado com sucesso!' });
  });
});

// Cadastro de fornecedor
app.post('/fornecedores', (req, res) => {
  const { nome_empresa, nome_contato, telefone, cpf_cnpj, numero_cadastro } = req.body;

  if (!nome_empresa || !nome_contato || !telefone || !cpf_cnpj || !numero_cadastro) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const query = `
    INSERT INTO FORNECEDOR (NOM_STR_FOR, NOM_CONTATO_FOR, TEL_STR_FOR, CNPJ_STR_FOR, NUM_CADASTRO_FOR, END_STR_FOR)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(
    query,
    [nome_empresa, nome_contato, telefone, cpf_cnpj, numero_cadastro, ''], // Valor padrão vazio para END_STR_FOR
    function (err) {
      if (err) {
        console.error('Erro ao cadastrar fornecedor:', err.message);
        return res.status(500).json({ error: 'Erro ao cadastrar fornecedor.' });
      }
      res.status(201).json({ message: 'Fornecedor cadastrado com sucesso!', fornecedorId: this.lastID });
    }
  );
});




// Listar fornecedores
app.get('/fornecedores', (req, res) => {
  const query = `SELECT * FROM FORNECEDOR`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar fornecedores:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar fornecedores.' });
    }
    res.json(rows);
  });
});

// =================== INICIAR SERVIDOR ===================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
