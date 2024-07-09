const express = require("express");
const { registrarUsuario, loginUsuario, listarUsuarios, resetSenhaInicial, editarUsuarios } = require("../controllers/usuarioController");
const usuarioRoute = express.Router()
const authMiddleware = require("../config/authMiddleware");


usuarioRoute.post('/registrar-usuario', authMiddleware, registrarUsuario);
usuarioRoute.post('/auth', loginUsuario);
usuarioRoute.get('/listar-usuarios', authMiddleware, listarUsuarios);
usuarioRoute.post('/reset-senha-inicial', authMiddleware, resetSenhaInicial);
usuarioRoute.put('/:u_id/editar-usuarios', authMiddleware, editarUsuarios)

module.exports = usuarioRoute;