import express from "express";
import cors from "cors";
import { ENV } from "./environment";
import { getSongById } from "./song";

const app = express();

app.use(cors());

// TODO: add endpoints
app.get("/song/:id", async (req, res) => {
  const songId = req.params.id;

  res.json(await getSongById(+songId));

  res.end();
});

app.get("/test", async (req, res) => {
  res.write("Hello World!");

  res.end();
});

app.listen(ENV.PORT);
