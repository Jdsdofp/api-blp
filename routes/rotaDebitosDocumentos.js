const express = require("express");
const { registrarCusto, listarCustoDocumento, listarCustos, deletarDebito } = require("../controllers/debitosDocumentosController");
const debitosRoute = express.Router()
const authMiddleware = require("../config/authMiddleware");

// path '/debit'


debitosRoute.post('/registrar-custo/:d_id', authMiddleware, registrarCusto);
debitosRoute.get('/listar-custo-documento/:d_id', authMiddleware, listarCustoDocumento);
debitosRoute.get('/listar-custos', authMiddleware, listarCustos);
debitosRoute.delete('/deletar-debito/:id', authMiddleware, deletarDebito);

module.exports = debitosRoute;