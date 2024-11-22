const express = require("express");
const { registrarCusto, listarCustoDocumento } = require("../controllers/debitosDocumentosController");
const debitosRoute = express.Router()
const authMiddleware = require("../config/authMiddleware");


debitosRoute.post('/registrar-custo/:d_id', authMiddleware, registrarCusto);
debitosRoute.get('/listar-custo-documento/:d_id', listarCustoDocumento)

module.exports = debitosRoute;