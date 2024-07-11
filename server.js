const express = require("express");
const packgeName = require("./package.json");
const {settingsServer} = require("./settings_Server");
const app = express();
const usuarioRoute = require("./routes/rotaUsuario");
const empresaRoute = require("./routes/rotaEmpresa");
const tipoDocumentoRoute =require("./routes/rotaTipoDocumento");

// Use body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", usuarioRoute);
app.use("/company", empresaRoute);
app.use("/type-document", tipoDocumentoRoute);


// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.table(
        settingsServer(packgeName, PORT)
    )
});
// 