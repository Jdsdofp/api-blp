const express = require("express");
const { registarDocumento, listarDocumentos, listarDocumentosFilial, listarDocumentosStatusFilial, listarTodosDocumentosFilial, listarStatusID, listarDocumentoCondicaoId, atualizaStatusIrregular, deletarDocumento } = require("../controllers/documentoController");
const documentoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


//path 'document'

//ROTA PARA CRIAR DOCUMENTO
documentoRoute.post('/registrar-documento', authMiddleware, registarDocumento);
documentoRoute.get('/listar-documentos', authMiddleware, listarDocumentos);
documentoRoute.get('/listar-documentos-filais', authMiddleware, listarDocumentosFilial);
documentoRoute.get('/listar-documentos-status-filial/:status/:filialId', authMiddleware, listarDocumentosStatusFilial);
documentoRoute.get('/listar-documentos-conditionId/:conditionId', authMiddleware, listarDocumentoCondicaoId);
documentoRoute.get('/listar-todos-documentos-filial/:filialId', authMiddleware, listarTodosDocumentosFilial);
documentoRoute.get('/listar-status-id/:id', authMiddleware, listarStatusID);
//atualizar status documento para irregular.... ROTAS DE PERIGO
documentoRoute.put('/atualiza-status-irregular/:d_id', atualizaStatusIrregular);
documentoRoute.delete('/deletar-documento/:d_id', deletarDocumento);


module.exports = documentoRoute;