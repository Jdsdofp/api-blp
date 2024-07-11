const express = require("express");
const { registrarTipoDocumento } = require("../controllers/tipoDocumentoController");
const tipoDocumetoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware")

tipoDocumetoRoute.post('/registrar-tipo-documento', authMiddleware, registrarTipoDocumento)


module.exports = tipoDocumetoRoute;