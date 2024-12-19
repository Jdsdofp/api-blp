const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const packageName = require("./package.json");
const { settingsServer } = require("./settings_Server");
const app = express();
const usuarioRoute = require("./routes/rotaUsuario");
const empresaRoute = require("./routes/rotaEmpresa");
const tipoDocumentoRoute = require("./routes/rotaTipoDocumento");
const documentoRoute = require("./routes/rotaDocumento");
const filialRoute = require("./routes/rotaFilial");
const comentarioDocumentoRoute = require("./routes/rotaComentarioDocumento");
const condicionanteRoute = require("./routes/rotaCondicionantes");
const { Empresa, Filial, Usuario } = require('./config/actions');
const documentoCondRoute = require("./routes/rotaDocumentoCondicionante");
const debitosRoute = require("./routes/rotaDebitosDocumentos");
const storageRoutes = require("./routes/storageRoutes");
const notificaoRoute = require("./routes/rotaNotificacoes");

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
app.use("/branch", filialRoute);
app.use("/document", documentoRoute);
app.use("/comment-document", comentarioDocumentoRoute);
app.use("/condition", condicionanteRoute);
app.use("/document-condition", documentoCondRoute);
app.use("/debit", debitosRoute);
app.use('/storage', storageRoutes);
app.use('/notifications', notificaoRoute);

// Configuração do servidor e Socket.IO
const PORT = 8080 || process.env.PORT;
const server = http.createServer(app); // Cria o servidor HTTP
const io = new Server(server, {  // Configura o Socket.IO com o servidor HTTP
  cors: {
    origin: 'http://10.11.3.42:5173', // Adapte para o seu front-end
    credentials: true, // Permite cookies/sessões
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  }
});

io.on("connection", (socket) => {
  console.log('Usuário conectado: ', socket.id);

    // Adicionar o usuário a uma sala específica
    socket.on("join", (userId) => {
      const room = `user_${userId}`;
      socket.join(room);
      console.log(`Usuário ${userId} entrou na sala: ${room}`);
    });

  socket.on("disconnect", () => {
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});

app.set("io", io);  // Salva o objeto io para uso posterior, se necessário

server.listen(PORT, '0.0.0.0', () => {
  console.table(
    settingsServer(packageName, PORT)
  );
});
