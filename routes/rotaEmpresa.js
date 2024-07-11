const express = require("express");
const empresaRoute = express.Router()
const {listarEmpresas, registrarEmpresa, editarEmpresa} = require("../controllers/empresaController");
const authMiddleware = require("../config/authMiddleware");


empresaRoute.get('/listar-empresas', authMiddleware, listarEmpresas);
empresaRoute.post('/registrar-empresa', authMiddleware, registrarEmpresa);
empresaRoute.put('/:e_id/editar-empresa', authMiddleware, editarEmpresa);



module.exports = empresaRoute;