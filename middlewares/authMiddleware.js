const jwt = require('jsonwebtoken');
const JWT_SECRET = 'rodrigo';

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido.' });

    req.usuario = usuario; // salva os dados do usuário no request
    next();
  });
}

module.exports = autenticarToken;
