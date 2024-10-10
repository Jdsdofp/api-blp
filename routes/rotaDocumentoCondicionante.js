const express = require("express");
const { listarDocumentoCondicionantes, listarDocumentoCondicionante, listarDocumentoCondicionanteFiliais, fecharCondicionante, atribuirUsuariosCondicao, listarDocumentoCond } = require("../controllers/documentoCondiController");
const documentoCondRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");


documentoCondRoute.get('/listar-documento-condicionantes', authMiddleware, listarDocumentoCondicionantes);
documentoCondRoute.get('/listar-documento-condicionantes-filiais', listarDocumentoCondicionanteFiliais);
documentoCondRoute.get('/listar-documento-condicionante/:dc_id', authMiddleware, listarDocumentoCondicionante);
documentoCondRoute.get('/listar-condicionante/:dc_id', authMiddleware, listarDocumentoCond)
documentoCondRoute.put('/fechar-condicionante/:dc_id', authMiddleware, fecharCondicionante);
documentoCondRoute.patch('/atribuir-usuarios-condicao/:dc_id', authMiddleware, atribuirUsuariosCondicao);

module.exports = documentoCondRoute;