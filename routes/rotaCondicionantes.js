const express = require("express");
const { registrarCondicionante } = require("../controllers/condicionanteController");
const condicionanteRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");

condicionanteRoute.post('/registrar-condicionante', authMiddleware, registrarCondicionante)


module.exports = condicionanteRoute;