const express = require("express");
const { registarDocumento, listarDocumentos } = require("../controllers/documentoController");
const documentoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


//ROTA PARA CRIAR DOCUMENTO
documentoRoute.post('/registrar-documento', authMiddleware, registarDocumento);
documentoRoute.get('/listar-documentos', authMiddleware, listarDocumentos)


module.exports = documentoRoute;