const express = require("express");
const { registrarUsuario, loginUsuario, listarUsuarios, resetSenhaInicial } = require("../controllers/usuarioController");
const usuarioRoute = express.Router()
const authMiddleware = require("../config/authMiddleware");


usuarioRoute.post('/registrar-usuario', registrarUsuario);
usuarioRoute.post('/auth', loginUsuario);
usuarioRoute.get('/listar-usuarios', authMiddleware, listarUsuarios);
usuarioRoute.post('/reset-senha-inicial', authMiddleware, resetSenhaInicial)

module.exports = usuarioRoute;