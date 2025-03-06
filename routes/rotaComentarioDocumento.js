const express = require("express");
const { registarComentarioDocumento, listarComentarios, registrarRespostaComentario, deletarComentario } = require("../controllers/comentarioDocumController");
const comentarioDocumentoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");

comentarioDocumentoRoute.post('/:cd_documento_id/registar-comentario', authMiddleware, registarComentarioDocumento);
comentarioDocumentoRoute.get('/:cd_documento_id/listar-comentario-documento', authMiddleware, listarComentarios);
comentarioDocumentoRoute.patch('/:cd_id/registrar-resposta-comentario', authMiddleware, registrarRespostaComentario);
comentarioDocumentoRoute.delete('/:cd_id/deletar-comentario', authMiddleware, deletarComentario);


module.exports = comentarioDocumentoRoute;