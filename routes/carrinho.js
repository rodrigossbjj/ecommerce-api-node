const express = require('express');
const router = express.Router();
const autenticarToken = require('../middlewares/authMiddleware');

//Carrinhos por usuário (simulação em memória)
const carrinhos = {};

//Adicionar item ao carrinho
router.post('/adicionar', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const { id, nome, preco, quantidade } = req.body;

  if (!id || !nome || !preco || !quantidade) {
    return res.status(400).json({ erro: 'Produto inválido. Informe id, nome, preco e quantidade.' });
  }

  if (!carrinhos[userId]) {
    carrinhos[userId] = [];
  }

  const existente = carrinhos[userId].find(p => p.id === id);
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinhos[userId].push({ id, nome, preco, quantidade });
  }

  res.json({ mensagem: 'Produto adicionado ao carrinho.', carrinho: carrinhos[userId] });
});

//Remover item do carrinho
router.post('/remover', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.body;

  if (!id || !carrinhos[userId]) {
    return res.status(400).json({ erro: 'Produto ou carrinho não encontrados.' });
  }

  carrinhos[userId] = carrinhos[userId].filter(p => p.id !== id);
  res.json({ mensagem: 'Produto removido do carrinho.', carrinho: carrinhos[userId] });
});

//Ver carrinho + total
router.get('/', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const carrinho = carrinhos[userId] || [];

  const total = carrinho.reduce((soma, p) => soma + (p.preco * p.quantidade), 0);

  res.json({ carrinho, total: parseFloat(total.toFixed(2)) });
});

module.exports = router;
