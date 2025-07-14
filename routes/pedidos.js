const express = require('express');
const router = express.Router();
const autenticarToken = require('../middlewares/authMiddleware');
const fs = require('fs');
const path = require('path');

const pedidosFilePath = path.join(__dirname, '../db/pedidos.json');

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

// Listar todos os pedidos do usuário autenticado
router.get('/', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const pedidos = carregarPedidos();

  const pedidosUsuario = pedidos.filter(p => p.usuarioId === userId);
  res.json(pedidosUsuario);
});

// Cancelar um pedido por ID
router.post('/cancelar/:id', autenticarToken, (req, res) => {
  const userId = req.usuario.id;
  const pedidoId = parseInt(req.params.id);

  const pedidos = carregarPedidos();

  const pedidoIndex = pedidos.findIndex(p => p.id === pedidoId && p.usuarioId === userId);
  if (pedidoIndex === -1) return res.status(404).json({ erro: 'Pedido não encontrado.' });

  if (pedidos[pedidoIndex].status === 'cancelado') {
    return res.status(400).json({ erro: 'Pedido já está cancelado.' });
  }

  pedidos[pedidoIndex].status = 'cancelado';

  salvarPedidos(pedidos);

  res.json({ mensagem: 'Pedido cancelado com sucesso.', pedido: pedidos[pedidoIndex] });
});

module.exports = router;
