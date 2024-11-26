const express = require("express");
const { registrarTipoDocumento, listarTipoDocumentos, editarDescricaoTipoDoc, editarReqCondicionanteTipoDoc } = require("../controllers/tipoDocumentoController");
const tipoDocumetoRoute = express.Router();
const authMiddleware = require("../config/authMiddleware")

tipoDocumetoRoute.post('/registrar-tipo-documento', authMiddleware, registrarTipoDocumento);
tipoDocumetoRoute.get('/listar-tipo-documentos', authMiddleware, listarTipoDocumentos);
tipoDocumetoRoute.put('/editar-descrica-tipo-doc/:td_id', authMiddleware, editarDescricaoTipoDoc);
tipoDocumetoRoute.put('/editar-req-condicionante-tipo-doc/:td_id', authMiddleware, editarReqCondicionanteTipoDoc)


module.exports = tipoDocumetoRoute;