const express = require("express");
const { listarDocumentoCondicionantes, listarDocumentoCondicionante, listarDocumentoCondicionanteFiliais, fecharCondicionante } = require("../controllers/documentoCondiController");
const documentoCondRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


documentoCondRoute.get('/listar-documento-condicionantes', authMiddleware, listarDocumentoCondicionantes);
documentoCondRoute.get('/listar-documento-condicionantes-filiais', listarDocumentoCondicionanteFiliais);
documentoCondRoute.get('/listar-documento-condicionante/:dc_id', authMiddleware, listarDocumentoCondicionante);
documentoCondRoute.put('/:dc_id/fechar-condicionante', authMiddleware, fecharCondicionante);

module.exports = documentoCondRoute;