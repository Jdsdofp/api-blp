const express = require("express");
const packgeName = require("./package.json");
const {settingsServer} = require("./settings_Server");
const app = express();
const usuarioRoute = require("./routes/rotaUsuario");
const empresaRoute = require("./routes/rotaEmpresa");
const tipoDocumentoRoute =require("./routes/rotaTipoDocumento");
const documentoRoute = require("./routes/rotaDocumento");
const fililRoute = require("./routes/rotaFilial");
const comentarioDocumentoRoute = require("./routes/rotaComentarioDocumento");
const condicionanteRoute = require("./routes/rotaCondicionantes");

// Use body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", usuarioRoute);
app.use("/company", empresaRoute);
app.use("/type-document", tipoDocumentoRoute);
app.use("/branch", fililRoute);
app.use("/document", documentoRoute);
app.use("/comment-document", comentarioDocumentoRoute);
app.use("/condition", condicionanteRoute)

// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, ()=>{
    console.table(
        settingsServer(packgeName, PORT)
    )
});
// 