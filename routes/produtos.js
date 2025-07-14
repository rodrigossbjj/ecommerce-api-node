const express = require('express');
const router = express.Router();
const autenticarToken = require("../middlewares/authMiddleware");

//Simulação de banco de dados
let produtos = [
  { id: 1, nome: 'Camiseta', preco: 49.9 },
  { id: 2, nome: 'Tênis', preco: 199.9 }
];

//GET /produtos - listar produtos
router.get('/', (req, res) => {
  res.json(produtos);
});

//POST /produtos - adicionar novo produto
router.post('/', autenticarToken, (req, res) => {
  const {nome, preco} = req.body;

  //Validação de Produto
  if(!nome || typeof nome !== 'string' || nome.trim() === ''){
    return res.status(400).json({ erro: 'Nome do produto é obrigatório e deve ser uma string válida.' });
  }
  
  if (preco === undefined || typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ erro: 'Preço do produto deve ser um número maior que zero.' });
  }

  const novoProduto = {
    id: produtos.length + 1,
    nome: nome.trim(),
    preco
  };
    
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
  
});

//POST /produtos/:id - Atuliaza Produto por ID
router.put('/:id', autenticarToken, (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;

  const produto = produtos.find(p => p.id === parseInt(id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

  if (nome) produto.nome = nome.trim();
  if (preco && typeof preco === 'number' && preco > 0) produto.preco = preco;

  res.json(produto);
});


//POST /produtos/:id - Exclui Produto por ID
router.delete('/:id', autenticarToken, (req, res) => {
  const { id } = req.params;

  const index = produtos.findIndex(p => p.id === parseInt(id));
  if (index === -1) return res.status(404).json({ erro: 'Produto não encontrado.' });

  const excluido = produtos.splice(index, 1);
  res.json({ mensagem: 'Produto excluído com sucesso.', produto: excluido[0] });
});


module.exports = router;
