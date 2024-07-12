const express = require("express");
const { registrarTipoDocumento, listarTipoDocumentos } = require("../controllers/tipoDocumentoController");
const tipoDocumetoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware")

tipoDocumetoRoute.post('/registrar-tipo-documento', authMiddleware, registrarTipoDocumento)
tipoDocumetoRoute.get('/listar-tipo-documentos', authMiddleware, listarTipoDocumentos)


module.exports = tipoDocumetoRoute;