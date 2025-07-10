const express = require('express');
const router = express.Router();

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
router.post('/', (req, res) => {
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

module.exports = router;
