const Usuario = require("../models/Usuario");

module.exports.todosUsuarios = async (req, res) =>{
    try {
        const usuario = await Usuario.findAll()
        res.json(usuario)

    } catch (error) {
        res.send("Houve um erro aqui", error)
    }
}