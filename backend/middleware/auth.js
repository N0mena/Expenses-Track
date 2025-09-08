import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. Token missing.',
        error: 'NO_TOKEN' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretCode');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.',
        error: 'USER_NOT_FOUND' 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Invalid token.',
        error: 'INVALID_TOKEN' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expired. Please login again.',
        error: 'EXPIRED_TOKEN' 
      });
    }

    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      message: 'Server error during token verification.',
      error: 'SERVER_ERROR' 
    });
  }
};
