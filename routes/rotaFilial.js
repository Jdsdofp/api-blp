const express = require("express");
const { registrarFilial, listarFiliais, listarFilial } = require("../controllers/filialController");
const fililRoute = express.Router();
const authMiddleware = require("../config/authMiddleware")


fililRoute.post('/registrar-filial', authMiddleware, registrarFilial);
fililRoute.get('/listar-filiais', authMiddleware, listarFiliais);
fililRoute.get('/:e_id/listar-filial', authMiddleware, listarFilial);


module.exports = fililRoute;