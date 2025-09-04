import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access denied, token missing!' });

  jwt.verify(token, 'defaultSecretCode', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid or expired' });

    req.user = user;
    next();
  });
};
