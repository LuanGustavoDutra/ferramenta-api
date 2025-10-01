const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve o index.html da pasta atual

app.post("/executar-requisicoes", async (req, res) => {
  const { metodo, endpoint, body, destinos } = req.body;
  const resultados = [];

  for (const destino of destinos) {
    const url = `${destino.url}${endpoint}`;
    const token = destino.token;

    try {
      const response = await axios({
        method: metodo,
        url,
        headers: {
          Authorization: `KONVIVA ${token}`,
          "Content-Type": "application/json"
        },
        data: metodo !== "GET" ? body : undefined
      });

      resultados.push({
        url,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      resultados.push({
        url,
        status: error.response?.status || 500,
        data: error.response?.data || error.message
      });
    }
  }

  res.json(resultados);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
