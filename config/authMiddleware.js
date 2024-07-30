const { verifyToken, verifyRefreshToken, generateToken, generateRefreshToken } = require('../config/auth');
const Usuario = require('../models/Usuario');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const refreshToken = req.header('x-refresh-token');
    
    if (!token && !refreshToken) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }
  
    try {
      if (token) {
        const decoded = verifyToken(token);
        req.user = decoded;
        return next();
      }
  
      if (refreshToken) {
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
  
        const user = await Usuario.findByPk(decodedRefreshToken.id);
  
        if (!user || user.u_refreshtoken !== refreshToken) {
          return res.status(401).json({ message: 'Refresh token inválido' });
        }
  
        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
  
        await user.update({ u_refreshtoken: newRefreshToken });
  
        res.setHeader('Authorization', `Bearer ${newToken}`);
        res.setHeader('x-refresh-token', newRefreshToken);
  
        req.user = verifyToken(newToken);
        return next();
      }
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
  };
  
  
