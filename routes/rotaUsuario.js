const express = require("express");
const { registrarUsuario, loginUsuario } = require("../controllers/usuarioController");
const usuarioRoute = express.Router()


usuarioRoute.post('/registrar-usuario', registrarUsuario);
usuarioRoute.post('/auth', loginUsuario);

module.exports = usuarioRoute;