const express = require("express");
const packgeName = require("./package.json");
const settings = require("./settings_Server")
const app = express();
const Tipo_documento = require("./models/Tipo_Documento")



app.get('/', async (req, res)=>{
    const tipo_documento = await Tipo_documento.findAll()
    res.json({tipo_documento})
})



// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.warn(
        settings(packgeName, PORT)
    )
})
// 