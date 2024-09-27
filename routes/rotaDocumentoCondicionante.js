const express = require("express");
const { listarDocumentoCondicionantes, listarDocumentoCondicionante } = require("../controllers/documentoCondiController");
const documentoCondRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


documentoCondRoute.get('/listar-documento-condicionantes', authMiddleware, listarDocumentoCondicionantes);
documentoCondRoute.get('/:dc_id/listar-documento-condicionante', authMiddleware, listarDocumentoCondicionante);

module.exports = documentoCondRoute;