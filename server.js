const express = require("express");
const packgeName = require("./package.json");
const {settingsServer} = require("./settings_Server");
const app = express();
const usuarioRoute = require("./routes/rotaUsuario");


// Use body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", usuarioRoute);


// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.table(
        settingsServer(packgeName, PORT)
    )
});
// 