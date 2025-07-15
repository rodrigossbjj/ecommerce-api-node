# 🛒 API de E-commerce

API REST feita com Node.js e Express, com autenticação JWT, cadastro de usuários, gerenciamento de produtos, carrinho e pedidos. Os dados são armazenados em arquivos JSON, ideal para testes e aprendizado.

## 🚀 Tecnologias

- Node.js
- Express
- JSON Web Token (JWT)
- JavaScript
- Armazenamento em arquivos JSON

## 📦 Instalação

```bash
git clone https://github.com/rodrigossbjj/ecommerce-api.git
cd ecommerce-api
npm install
```

## ▶️ Executar o projeto

```bash
npm index.js
```

Servidor inicia em: `http://localhost:3000`

## 📌 Rotas principais

### 🔐 Autenticação

- `POST /auth/registrar` — Cadastra novo usuário
- `POST /auth/login` — Retorna token JWT

### 🛍 Produtos

- `GET /produtos` — Lista produtos
- `POST /produtos` — Adiciona produto (requer token)
- `POST /produtos/:id` — Atualizar produto (requer token)

### 🛒 Carrinho

- `POST /carrinho/adicionar` — Adiciona item ao carrinho
- `POST /carrinho/remover` — Remove item do carrinho
- `GET /carrinho` — Lista carrinho e total
- `POST /carrinho/checkout` — Finaliza pedido

### 📦 Pedidos

- `GET /pedidos` — Lista pedidos do usuário
- `POST /pedidos/cancelar/:id` — Cancela pedido

> Todas as rotas (exceto login e cadastro) requerem token JWT.

## 📂 Estrutura de Pastas

```
.
├── db/
│   ├── produtos.json
│   ├── pedidos.json
│   └── usuarios.json
├── middlewares/
│   └── authMiddleware.js
├── routes/
│   ├── auth.js
│   ├── produtos.js
│   ├── carrinho.js
│   └── pedidos.js
├── index.js
└── package.json
```

## ✅ Requisitos

- Node.js v18+
- VS Code com extensão REST Client (opcional para testar `.http`)