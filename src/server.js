import app from "./app.js";
import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";

dotenv.config();

const HTTPS_PORT = process.env.PORT || 5000;
const HTTP_PORT = 8081;

// ----------------------
// Redirection HTTP → HTTPS
// ----------------------
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, {
    Location: `https://localhost:${HTTPS_PORT}${req.url}`,
  });
  res.end();
});

httpServer.listen(HTTP_PORT, () => {
  console.log(
    `🚀 Serveur HTTP démarré sur le port ${HTTP_PORT} (redirection vers HTTPS)`
  );
});

// ----------------------
// Serveur HTTPS
// ----------------------
const httpsOptions = {
  key: fs.readFileSync("./config/key.pem"),
  cert: fs.readFileSync("./config/cert.pem"),
};

const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`🚀 Serveur HTTPS démarré sur le port ${HTTPS_PORT}`);
});
