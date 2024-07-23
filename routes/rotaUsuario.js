const express = require("express");
const { registrarUsuario, loginUsuario, listarUsuarios, resetSenhaInicial, editarUsuarios, listarUsuario, atribuirEmpresaUsuario, retiraEmpresaUsuario, listarEmpresasEFiliaisUsuario } = require("../controllers/usuarioController");
const usuarioRoute = express.Router()
const authMiddleware = require("../config/authMiddleware");


usuarioRoute.post('/registrar-usuario', authMiddleware, registrarUsuario);
usuarioRoute.post('/login', loginUsuario);
usuarioRoute.get('/listar-usuarios', authMiddleware, listarUsuarios);
usuarioRoute.get('/:u_id/listar-usuario', authMiddleware, listarUsuario);
usuarioRoute.post('/reset-senha-inicial', authMiddleware, resetSenhaInicial);
usuarioRoute.put('/:u_id/editar-usuarios', authMiddleware, editarUsuarios);
usuarioRoute.patch('/:u_id/atribuir-empresa-usuario', authMiddleware, atribuirEmpresaUsuario);
usuarioRoute.put('/:u_id/retira-empresa-usuario', authMiddleware, retiraEmpresaUsuario);
usuarioRoute.get('/:u_id/listar-empresa-filial-usuario',authMiddleware, listarEmpresasEFiliaisUsuario);

module.exports = usuarioRoute;