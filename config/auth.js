const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = 'MrfXZfqeq9i53M2sLvLPoXJNcONHHZ--ydrH95P-fVA';
const secrt_refresh = 'weu2rgnvyrngbg4nveovsdxvcdws1dve';

module.exports = {
    hashSenha: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    compareSenha: async (password, hashedSenha) => {
        return await bcrypt.compare(password, hashedSenha);
    },

    generateToken: (user) => {
        return jwt.sign({
            id: user.u_id,
            empresas_ids: user.u_empresas_ids,
            filiais_ids: user.u_filiais_ids
        }, secret, { expiresIn: '7d' });
    },

    verifyToken: (token) => {
        return jwt.verify(token, secret);
    },

    generateRefreshToken: (user) => {
        return jwt.sign({ id: user.u_id }, secrt_refresh, { expiresIn: '24h' });
    },

    verifyRefreshToken: (refreshToken) => {
        return jwt.verify(refreshToken, secrt_refresh);
    }
};
