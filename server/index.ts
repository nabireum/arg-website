import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_EMAIL = "sammcost4@gmail.com";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  app.post("/api/hardmode-submission", async (req, res) => {
    const { question, name, completionSeconds } = req.body ?? {};

    if (!question || !name) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM_EMAIL;

    if (!resendApiKey || !resendFrom) {
      console.log("[hardmode-submission] Resend não configurado.", {
        name,
        question,
        completionSeconds,
      });
      return res.status(503).json({
        message: "Serviço de e-mail indisponível no momento.",
      });
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [TARGET_EMAIL],
          subject: "[ARG] Nova submissão do hard mode",
          text: `Nova submissão recebida\n\nNome: ${name}\nPergunta: ${question}\nTempo hard mode (s): ${completionSeconds ?? "indisponível"}`,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("Falha Resend:", detail);
        return res.status(502).json({ message: "Falha no envio do e-mail." });
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Erro ao enviar e-mail hard mode:", error);
      return res.status(500).json({ message: "Falha ao enviar e-mail." });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const portApp = process.env.PORT || 3000;

  server.listen(portApp, () => {
    console.log(`Server running on http://localhost:${portApp}/`);
  });
}

startServer().catch(console.error);
