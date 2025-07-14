const express = require('express');
const app = express();

app.use(express.json());

// Importar rotas de produtos
const rotasProdutos = require('./routes/produtos');
const rotasAuth = require('./routes/auth');
const rotasCarrinho = require('./routes/carrinho');
const rotasPedidos = require('./routes/pedidos');
app.use('/produtos', rotasProdutos);
app.use('/auth', rotasAuth);
app.use('/carrinho', rotasCarrinho);
app.use('/pedidos', rotasPedidos);

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
