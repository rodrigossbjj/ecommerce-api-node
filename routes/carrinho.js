const express = require('express');
const router = express.Router();
const autenticarToken = require('../middlewares/authMiddleware');
const fs = require('fs');
const path = require('path');

const carrinhosFilePath = path.join(__dirname, '../db/carrinhos.json');
const pedidosFilePath = path.join(__dirname, '../db/pedidos.json');

const carregarCarrinhos = () => {
  try {
    const data = fs.readFileSync(carrinhosFilePath);
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const salvarCarrinhos = (carrinhos) => {
  fs.writeFileSync(carrinhosFilePath, JSON.stringify(carrinhos, null, 2));
};

const carregarPedidos = () => {
  try {
    const data = fs.readFileSync(pedidosFilePath);
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const salvarPedidos = (pedidos) => {
  fs.writeFileSync(pedidosFilePath, JSON.stringify(pedidos, null, 2));
};

// Adicionar item ao carrinho
router.post('/adicionar', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const { id, nome, preco, quantidade } = req.body;

  if (!id || !nome || !preco || !quantidade) {
    return res.status(400).json({ erro: 'Produto inválido. Informe id, nome, preco e quantidade.' });
  }

  const carrinhos = carregarCarrinhos();

  let carrinhoUsuario = carrinhos.find(c => c.usuarioId === userId);

  if (!carrinhoUsuario) {
    carrinhoUsuario = { usuarioId: userId, itens: [] };
    carrinhos.push(carrinhoUsuario);
  }

  const existente = carrinhoUsuario.itens.find(p => p.id === id);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinhoUsuario.itens.push({ id, nome, preco, quantidade });
  }

  salvarCarrinhos(carrinhos);

  res.json({ mensagem: 'Produto adicionado ao carrinho.', carrinho: carrinhoUsuario.itens });
});

// Remover item do carrinho
router.post('/remover', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ erro: 'Produto inválido. Informe o id.' });
  }

  const carrinhos = carregarCarrinhos();

  const carrinhoUsuario = carrinhos.find(c => c.usuarioId === userId);

  if (!carrinhoUsuario) {
    return res.status(400).json({ erro: 'Carrinho não encontrado para o usuário.' });
  }

  carrinhoUsuario.itens = carrinhoUsuario.itens.filter(p => p.id !== id);

  salvarCarrinhos(carrinhos);

  res.json({ mensagem: 'Produto removido do carrinho.', carrinho: carrinhoUsuario.itens });
});

// Ver carrinho + total
router.get('/', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const carrinhos = carregarCarrinhos();

  const carrinhoUsuario = carrinhos.find(c => c.usuarioId === userId);

  const itens = carrinhoUsuario ? carrinhoUsuario.itens : [];

  const total = itens.reduce((soma, p) => soma + (p.preco * p.quantidade), 0);

  res.json({ carrinho: itens, total: parseFloat(total.toFixed(2)) });
});

// Finalizar pedido (checkout)
router.post('/checkout', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const carrinhos = carregarCarrinhos();

  const carrinhoUsuario = carrinhos.find(c => c.usuarioId === userId);

  if (!carrinhoUsuario || carrinhoUsuario.itens.length === 0) {
    return res.status(400).json({ erro: 'Carrinho vazio. Adicione produtos antes de finalizar o pedido.' });
  }

  const total = carrinhoUsuario.itens.reduce((soma, p) => soma + (p.preco * p.quantidade), 0);

  const pedidos = carregarPedidos();

  const novoId = pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1;

  const pedido = {
    id: novoId,
    usuarioId: userId,
    data: new Date().toISOString(),
    itens: carrinhoUsuario.itens,
    total: parseFloat(total.toFixed(2)),
    status: 'finalizado'
  };

  pedidos.push(pedido);

  salvarPedidos(pedidos);

  carrinhoUsuario.itens = [];
  salvarCarrinhos(carrinhos);

  res.status(201).json({
    mensagem: 'Pedido finalizado com sucesso!',
    pedido
  });
});

module.exports = router;
