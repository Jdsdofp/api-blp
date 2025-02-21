const express = require("express");
const empresaRoute = express.Router()
const {listarEmpresas, registrarEmpresa, editarEmpresa, listCompanyDecoded} = require("../controllers/empresaController");
const authMiddleware = require("../config/authMiddleware");
const { verificarAcessoEmpresa } = require("../config/acessoMiddleware");
const path = require("path");

empresaRoute.get('/listar-empresas', authMiddleware, verificarAcessoEmpresa, listarEmpresas);
empresaRoute.post('/registrar-empresa', authMiddleware, registrarEmpresa);
empresaRoute.put('/:e_id/editar-empresa', authMiddleware, verificarAcessoEmpresa, editarEmpresa);


// Servir o arquivo .proto
empresaRoute.get("/protos/company.proto", (req, res) => {
    const protoUrl = path.join(__dirname,  '..', 'modelsProtoBufs', 'company.proto');
    res.sendFile(protoUrl);
});

// Rota de teste
empresaRoute.get('/listCompanyDecoded', listCompanyDecoded);    




module.exports = empresaRoute;