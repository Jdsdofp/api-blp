const express = require("express")
const authMiddleware = require("../config/authMiddleware")
const { notificaoes, marcarLido } = require("../controllers/notificaController")

const notificaoRoute = express.Router()

notificaoRoute.post('/listar-notificacoes', authMiddleware, notificaoes);
notificaoRoute.put('/marcarLido/:n_id', authMiddleware, marcarLido);



module.exports = notificaoRoute;