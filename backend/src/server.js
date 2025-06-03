const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configuração do CORS para permitir requisições do frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost",
      "http://127.0.0.1",
      "http://localhost:80",
      "http://127.0.0.1:80",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// verifica se o MongoDB ta conectado
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Serviço temporariamente indisponível. Banco de dados não está conectado.",
      error: "DATABASE_CONNECTION_ERROR",
    });
  }
  next();
};

// aplica o middleware nas rotas da API
app.use("/api", checkMongoConnection);

//   tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Função para conectar ao MongoDB
const connectWithRetry = async () => {
  const maxRetries = 5;
  let retries = 0;

  const tryConnect = async () => {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI ||
          "mongodb://localhost:27017/product-review-api",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log("Conectado ao MongoDB");
    } catch (err) {
      console.error(
        `Tentativa ${retries + 1} de ${maxRetries} falhou:`,
        err.message
      );
      retries++;

      if (retries < maxRetries) {
        console.log(`Tentando novamente em 5 segundos...`);
        setTimeout(tryConnect, 5000);
      } else {
        console.error(
          "Não foi possível conectar ao MongoDB após várias tentativas"
        );
        process.exit(1);
      }
    }
  };

  await tryConnect();
};

connectWithRetry();

// Rotas da API
app.use("/api/products", require("./routes/products"));
app.use("/api/reviews", require("./routes/reviews"));

// porta que o servidor ira usar
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
