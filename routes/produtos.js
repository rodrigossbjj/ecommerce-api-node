const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../db/produtos.json');

// Função utilitária para carregar e salvar
const carregarProdutos = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const salvarProdutos = (produtos) => {
  fs.writeFileSync(filePath, JSON.stringify(produtos, null, 2));
};

// GET /produtos
router.get('/', (req, res) => {
  const produtos = carregarProdutos();
  res.json(produtos);
});

// POST /produtos
router.post('/', (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'Nome do produto é obrigatório.' });
  }

  if (preco === undefined || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ erro: 'Preço inválido.' });
  }

  const produtos = carregarProdutos();
  const novoProduto = {
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    nome,
    preco
  };

  produtos.push(novoProduto);
  salvarProdutos(produtos);

  res.status(201).json(novoProduto);
});

// PUT /produtos/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco } = req.body;

  const produtos = carregarProdutos();
  const produto = produtos.find(p => p.id === id);

  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

  produto.nome = nome || produto.nome;
  produto.preco = preco !== undefined ? preco : produto.preco;

  salvarProdutos(produtos);

  res.json(produto);
});

// DELETE /produtos/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  let produtos = carregarProdutos();
  const existe = produtos.some(p => p.id === id);

  if (!existe) return res.status(404).json({ erro: 'Produto não encontrado.' });

  produtos = produtos.filter(p => p.id !== id);
  salvarProdutos(produtos);

  res.json({ mensagem: 'Produto removido com sucesso.' });
});

module.exports = router;
