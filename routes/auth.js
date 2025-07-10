const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Simulando banco de dados de usuários
const usuarios = [];

//Chave secreta do JWT (em produção, use dotenv)
const JWT_SECRET = 'rodrigo';

//POST /auth/registrar
router.post('/registrar', async (req, res) => {
  const { nome, email, senha } = req.body;

  //Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  //Verificar se já existe o e-mail
  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ erro: 'E-mail já cadastrado.' });
  }

  //Criptografar senha
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha: senhaCriptografada
  };

  usuarios.push(novoUsuario);
  res.status(201).json({ mensagem: 'Usuário registrado com sucesso.' });
});

//POST /auth/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  }

  //Gerar token JWT
  const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, JWT_SECRET, {
    expiresIn: '2h'
  });

  res.json({ token });
});

module.exports = router;
