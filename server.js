const express = require("express");
const packgeName = require("./package.json");
const settings = require("./settings_Server")
const app = express();
const usuarioRoute = require("./routes/rota_usuario");



app.get('/', async (req, res)=>{
    const data = new Date()
    res.send(data.toISOString())
})

app.use("/usuario", usuarioRoute)


// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.warn(
        settings(packgeName, PORT)
    )
})
// 