const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para analisar o corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve arquivos estáticos da pasta "public"

// Rota para enviar feedback
app.post("/feedback", (req, res) => {
  const newFeedback = req.body;

  // Lê os feedbacks existentes
  fs.readFile("feedbacks.json", (err, data) => {
    if (err) {
      return res.status(500).send("Erro ao ler feedbacks.");
    }
    const feedbacks = JSON.parse(data);
    feedbacks.push(newFeedback);

    // Salva os feedbacks atualizados
    fs.writeFile("feedbacks.json", JSON.stringify(feedbacks), (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar feedback.");
      }
      res.status(201).send("Feedback recebido com sucesso!");
    });
  });
});

// Rota para obter todos os feedbacks
app.get("/feedback", (req, res) => {
  fs.readFile("feedbacks.json", (err, data) => {
    if (err) {
      return res.status(500).send("Erro ao ler feedbacks.");
    }
    res.json(JSON.parse(data));
  });
});

// Rota principal para servir a página HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Envia o arquivo HTML
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
