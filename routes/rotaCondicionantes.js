const express = require("express");
const { registrarCondicionante, listarCondicionantes, listarCondicionante, editarDescCondicionante, deletaCondicionante, editarCondicao, deletarCondicao, adicionarCondicoes } = require("../controllers/condicionanteController");
const condicionanteRoute = express.Router();
const authMiddleware = require("../config/authMiddleware");

condicionanteRoute.post('/registrar-condicionante', authMiddleware, registrarCondicionante);
condicionanteRoute.get('/listar-condicionantes', authMiddleware, listarCondicionantes);
condicionanteRoute.get('/listar-condicionante/:c_id', authMiddleware, listarCondicionante);
condicionanteRoute.put('/editar-desc-condicionante/:c_id', authMiddleware, editarDescCondicionante);
condicionanteRoute.delete('/deleta-condicionante/:c_id', authMiddleware, deletaCondicionante);
condicionanteRoute.patch('/editar-condicao/:c_id', authMiddleware, editarCondicao);
condicionanteRoute.delete('/deletar-condicao/:c_id', authMiddleware, deletarCondicao);
condicionanteRoute.put('/adicionar-condicoes/:c_id', authMiddleware, adicionarCondicoes);


module.exports = condicionanteRoute;