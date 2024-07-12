const express = require("express");
const { registarComentarioDocumento } = require("../controllers/comentarioDocumController");
const comentarioDocumentoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");

comentarioDocumentoRoute.post('/:cd_documento_id/registar-comentario', authMiddleware, registarComentarioDocumento)


module.exports = comentarioDocumentoRoute;