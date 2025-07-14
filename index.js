const express = require('express');
const app = express();

app.use(express.json());

// Importar rotas de produtos
const rotasProdutos = require('./routes/produtos');
const rotasAuth = require('./routes/auth');
app.use('/produtos', rotasProdutos);
app.use('/auth', rotasAuth);


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
