const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = 'rodrigo';

// Caminho do arquivo JSON
const usuariosPath = path.join(__dirname, '../db/usuarios.json');

// Carrega usuários do arquivo JSON
const carregarUsuarios = () => {
  try {
    const data = fs.readFileSync(usuariosPath);
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Salva usuários no arquivo JSON
const salvarUsuarios = (usuarios) => {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
};

// POST /auth/registrar
router.post('/registrar', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const usuarios = carregarUsuarios();

  const existente = usuarios.find(u => u.email === email);
  if (existente) {
    return res.status(400).json({ erro: 'E-mail já cadastrado.' });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    nome,
    email,
    senha: senhaCriptografada
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  res.status(201).json({ mensagem: 'Usuário registrado com sucesso.' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuarios = carregarUsuarios();

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, JWT_SECRET, {
    expiresIn: '2h'
  });

  res.json({ token });
});

module.exports = router;
