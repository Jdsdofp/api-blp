const express = require("express");
const { registrarFilial, listarFiliais, listarFilial, listarEmpresaComFiliais, deletarFilial } = require("../controllers/filialController");
const fililRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


fililRoute.post('/registrar-filial', authMiddleware, registrarFilial);
fililRoute.get('/listar-filiais', authMiddleware, listarFiliais);
fililRoute.get('/:e_id/listar-filial', authMiddleware, listarFilial);
fililRoute.get('/:e_id/listar-empresas-filiais', authMiddleware, listarEmpresaComFiliais);
fililRoute.delete('/:f_id/deletar-filial', authMiddleware, deletarFilial)

module.exports = fililRoute;