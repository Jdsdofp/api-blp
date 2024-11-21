const express = require("express");

const { 
    listarDocumentoCondicionantes, 
    listarDocumentoCondicionante, 
    listarDocumentoCondicionanteFiliais, 
    fecharCondicionante, 
    atribuirUsuariosCondicao, 
    listarDocumentoCond, 
    fecharProcessoCondicionante, 
    adicionarCondicoes,
    fecharProcesso,
    listarUsuariosPorCondicao,
} = require("../controllers/documentoCondiController");

const documentoCondRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


documentoCondRoute.get('/listar-documento-condicionantes', authMiddleware, listarDocumentoCondicionantes);
documentoCondRoute.get('/listar-documento-condicionantes-filiais', listarDocumentoCondicionanteFiliais);
documentoCondRoute.get('/listar-documento-condicionante/:dc_id', authMiddleware, listarDocumentoCondicionante);
documentoCondRoute.get('/listar-condicionante/:dc_id', authMiddleware, listarDocumentoCond);
documentoCondRoute.put('/fechar-condicionante/:dc_id', authMiddleware, fecharCondicionante);
documentoCondRoute.put('/fechar-processo-condicionante/:dc_id', authMiddleware, fecharProcessoCondicionante);
documentoCondRoute.patch('/atribuir-usuarios-condicao/:dc_id', authMiddleware, atribuirUsuariosCondicao);
documentoCondRoute.put('/adicionar-condicoes/:dc_id', authMiddleware, adicionarCondicoes);
documentoCondRoute.put('/fechar-processo/:dc_id', authMiddleware, fecharProcesso);
documentoCondRoute.post('/listar-usuarios-atribuidos-condicao/:dc_id', authMiddleware, listarUsuariosPorCondicao)


module.exports = documentoCondRoute;