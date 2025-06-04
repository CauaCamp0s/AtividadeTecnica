const mongoose = require("mongoose");
require("dotenv").config();

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
        console.log("Tentando novamente em 5 segundos...");
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

module.exports = connectWithRetry;
