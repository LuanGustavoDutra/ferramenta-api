const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();

// Usar porta fornecida pelo Render, ou 3000 localmente
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta atual (index.html, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Endpoint para executar requisições
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

// Servir index.html para todas as rotas que não sejam a API
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em ${PORT} (acessível em https://ferramenta-api.onrender.com)`);
});
