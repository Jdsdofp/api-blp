const express = require("express");
const { registarDocumento, listarDocumentos, listarDocumentosFilial, listarDocumentosStatusFilial, listarTodosDocumentosFilial, listarStatusID, listarDocumentoCondicaoId } = require("../controllers/documentoController");
const documentoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


//ROTA PARA CRIAR DOCUMENTO
documentoRoute.post('/registrar-documento', authMiddleware, registarDocumento);
documentoRoute.get('/listar-documentos', authMiddleware, listarDocumentos);
documentoRoute.get('/listar-documentos-filais', authMiddleware, listarDocumentosFilial);
documentoRoute.get('/listar-documentos-status-filial/:status/:filialId', authMiddleware, listarDocumentosStatusFilial);
documentoRoute.get('/listar-documentos-conditionId/:conditionId', authMiddleware, listarDocumentoCondicaoId);
documentoRoute.get('/listar-todos-documentos-filial/:filialId', authMiddleware, listarTodosDocumentosFilial);
documentoRoute.get('/listar-status-id/:id', authMiddleware, listarStatusID)



module.exports = documentoRoute;