const express = require("express");
const { registrarCondicionante, listarCondicionantes, listarCondicionante } = require("../controllers/condicionanteController");
const condicionanteRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");

condicionanteRoute.post('/registrar-condicionante', authMiddleware, registrarCondicionante);
condicionanteRoute.get('/listar-condicionantes', authMiddleware, listarCondicionantes);
condicionanteRoute.get('/listar-condicionante/:c_id', authMiddleware, listarCondicionante);


module.exports = condicionanteRoute;