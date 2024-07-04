const express = require("express");
const { todosUsuarios } = require("../controllers/user_controller");
const usuarioRoute = express.Router()


usuarioRoute.get('/', todosUsuarios);


module.exports = usuarioRoute;