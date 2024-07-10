const express = require("express");
const empresaRoute = express.Router()
const {listarEmpresas, registrarEmpresa} = require("../controllers/empresaController");
const authMiddleware = require("../config/authMiddleware");


empresaRoute.get('/listar-empresas', listarEmpresas);
empresaRoute.post('/registrar-empresa', authMiddleware, registrarEmpresa);



module.exports = empresaRoute;