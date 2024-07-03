const express = require("express");
const packgeName = require("./package.json");
const settings = require("./settings_Server")
const app = express();
const Comentariosdocumentos = require("./models/Comentarios_documentos");



app.get('/', async (req, res)=>{
    const comentarios_documentos = await Comentariosdocumentos.findAll()
    res.json({comentarios_documentos})
})



// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.warn(
        settings(packgeName, PORT)
    )
})
// 