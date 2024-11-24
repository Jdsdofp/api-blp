const express = require("express");
const cors = require("cors");
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
const { Empresa, Filial, Usuario } = require('./config/actions');
const documentoCondRoute = require("./routes/rotaDocumentoCondicionante");



const allowedOrigins = ['http://localhost:5173', 'http://10.11.3.42:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  credentials: true, // Necessário se o front-end utiliza cookies/sessões
};

app.use(cors(corsOptions));


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
app.use("/document-condition", documentoCondRoute)

// SET DO SERVER
const PORT = 8080 ||process.env;
app.listen(PORT, '0.0.0.0', ()=>{
    console.table(
        settingsServer(packgeName, PORT)
    )
});