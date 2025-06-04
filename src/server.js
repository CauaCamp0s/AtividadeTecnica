const express = require("express");
const cors = require("cors");
const connectWithRetry = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsConfig");

const app = express();

// config do cors
app.use(cors(corsOptions));

app.use(express.json());

// conect com o db
connectWithRetry();

// Rotas da API
app.use("/api/products", require("./routes/products"));
app.use("/api/reviews", require("./routes/reviews"));

// middleware para tratar os erros
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
