const express = require("express");
const packgeName = require("./package.json");
const settings = require("./settings_Server")
const app = express();




app.get('/', async (req, res)=>{
    const data = new Date()
    res.send(data.toISOString())
})



// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.warn(
        settings(packgeName, PORT)
    )
})
// 