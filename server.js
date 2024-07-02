const express = require("express");
const packgeName = require("./package.json");
const settings = require("./settings_Server")
const app = express();
const Filial =  require("./models/Filial")



app.get('/', async (req, res)=>{
    const filiais = await Filial.findAll()
    res.json({filiais})
})



// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.warn(
        settings(packgeName, PORT)
    )
})
// 