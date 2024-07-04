const express = require("express");
const { registrarUsuario, loginUsuario, listarUsuarios } = require("../controllers/usuarioController");
const usuarioRoute = express.Router()
const authMiddleware = require("../config/authMiddleware");


usuarioRoute.post('/registrar-usuario', registrarUsuario);
usuarioRoute.post('/auth', loginUsuario);
usuarioRoute.get('/listar-usuarios', authMiddleware, listarUsuarios);

module.exports = usuarioRoute;