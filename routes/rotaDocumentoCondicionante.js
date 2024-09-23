const express = require("express");
const { listarDocumentoCondicionantes, listarDocumentoCondicionante, listarDocumentoCondicionanteFiliais } = require("../controllers/documentoCondiController");
const documentoCondRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


documentoCondRoute.get('/listar-documento-condicionantes', authMiddleware, listarDocumentoCondicionantes);
documentoCondRoute.get('/listar-documento-condicionantes-filiais', listarDocumentoCondicionanteFiliais);
documentoCondRoute.get('/listar-documento-condicionante/:dc_id', authMiddleware, listarDocumentoCondicionante);

module.exports = documentoCondRoute;