const express = require("express");
const { registrarFilial, listarFiliais } = require("../controllers/filialController");
const fililRoute = express.Router();
const authMiddleware = require("../config/authMiddleware")


fililRoute.post('/registrar-filial', authMiddleware, registrarFilial);
fililRoute.get('/listar-filiais', authMiddleware, listarFiliais);


module.exports = fililRoute;