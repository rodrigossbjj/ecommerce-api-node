const express = require('express');
const router = express.Router();
const autenticarToken = require('../middlewares/authMiddleware');

//Carrinhos por usuário (simulação em memória)
const carrinhos = {};
const pedidos = {}; // <- novo
let proximoPedidoId = 1;

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

//Finalizar pedido (checkout)
router.post('/checkout', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const carrinho = carrinhos[userId];

  if (!carrinho || carrinho.length === 0) {
    return res.status(400).json({ erro: 'Carrinho vazio. Adicione produtos antes de finalizar o pedido.' });
  }

  const total = carrinho.reduce((soma, p) => soma + (p.preco * p.quantidade), 0);

  const pedido = {
  id: proximoPedidoId++,
  usuarioId: userId,
  data: new Date().toISOString(),
  itens: carrinho,
  total: parseFloat(total.toFixed(2)),
  status: 'finalizado'
};

if (!pedidos[userId]) pedidos[userId] = [];
pedidos[userId].push(pedido);

//Limpar carrinho
carrinhos[userId] = [];

res.status(201).json({
  mensagem: 'Pedido finalizado com sucesso!',
  pedido
});
});

//Listar todos os pedidos do usuário
router.get('/pedidos', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  res.json(pedidos[userId] || []);
});

//Cancelar um pedido por ID
router.post('/cancelar/:id', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const pedidoId = parseInt(req.params.id);

  const listaPedidos = pedidos[userId];
  if (!listaPedidos) return res.status(404).json({ erro: 'Nenhum pedido encontrado.' });

  const pedido = listaPedidos.find(p => p.id === pedidoId);
  if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });

  if (pedido.status === 'cancelado') {
    return res.status(400).json({ erro: 'Pedido já está cancelado.' });
  }

  pedido.status = 'cancelado';

  res.json({ mensagem: 'Pedido cancelado com sucesso.', pedido });
});


module.exports = router;