const express = require("express");
const { registarDocumento, 
        listarDocumentos, 
        listarDocumentosFilial, 
        listarDocumentosStatusFilial, 
        listarTodosDocumentosFilial, 
        listarStatusID, 
        listarDocumentoCondicaoId, 
        atualizaStatusIrregular, 
        deletarDocumento, 
        editarDocumento, 
        listarDocumentosTESTE, 
        listarDocumentosFilialTESTE, 
        listarDocumentosModel, 
        atualizaStatusNAplicavel } = require("../controllers/documentoController");

const documentoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


//path 'document'

//ROTA PARA CRIAR DOCUMENTO
documentoRoute.post('/registrar-documento', authMiddleware, registarDocumento);

//Lista...
documentoRoute.get('/listar-documentos', authMiddleware, listarDocumentos);
documentoRoute.get('/listar-documentos-filais', authMiddleware, listarDocumentosFilial);
documentoRoute.get('/listar-documentos-status-filial/:status/:filialId', authMiddleware, listarDocumentosStatusFilial);
documentoRoute.get('/listar-documentos-model/:filialId', listarDocumentosModel);
documentoRoute.get('/listar-documentos-conditionId/:conditionId', authMiddleware, listarDocumentoCondicaoId);
documentoRoute.get('/listar-todos-documentos-filial/:filialId', authMiddleware, listarTodosDocumentosFilial);
documentoRoute.get('/listar-status-id/:id', authMiddleware, listarStatusID);
//Lista...


//atualizar status documento para irregular.... ROTAS DE PERIGO
documentoRoute.put('/atualiza-status-irregular/:d_id', atualizaStatusIrregular);
documentoRoute.put('/atualiza-status-aplicavel/:d_id', atualizaStatusNAplicavel);

//ações coordenadas documentos..
documentoRoute.delete('/deletar-documento/:d_id', authMiddleware, deletarDocumento);
documentoRoute.put('/editar-documento/:d_id', authMiddleware, editarDocumento);





//ROTA TESTE
documentoRoute.get('/list-test', authMiddleware, listarDocumentosFilialTESTE);

module.exports = documentoRoute;