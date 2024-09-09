const express = require("express");
const { registrarCondicionante, listarCondicionantes } = require("../controllers/condicionanteController");
const condicionanteRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");

condicionanteRoute.post('/registrar-condicionante', authMiddleware, registrarCondicionante)
condicionanteRoute.get('/listar-condicionantes', authMiddleware, listarCondicionantes)


module.exports = condicionanteRoute;