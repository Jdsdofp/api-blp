const express = require("express");
const empresaRoute = express.Router()
const {listarEmpresas, registrarEmpresa, editarEmpresa} = require("../controllers/empresaController");
const authMiddleware = require("../config/authMiddleware");
const { verificarAcessoEmpresa } = require("../config/acessoMiddleware")


empresaRoute.get('/listar-empresas', authMiddleware, verificarAcessoEmpresa, listarEmpresas);
empresaRoute.post('/registrar-empresa', authMiddleware, registrarEmpresa);
empresaRoute.put('/:e_id/editar-empresa', authMiddleware, verificarAcessoEmpresa, editarEmpresa);



module.exports = empresaRoute;