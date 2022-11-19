import express from "express";
import cors from "cors";
import { ENV } from "./environment";
import { getSongById, insertSong, updateSong } from "./song";

const app = express();

app.use(cors());
app.use(express.json());

// TODO: add endpoints

// Create
app.post("/song", async (req, res) => {
  const { judul, penyanyiId, audio_path: audioPath } = req.body;

  if (!judul || !penyanyiId || !audioPath) {
    res.status(400);
    res.end();
    return;
  }

  await insertSong({
    judul,
    penyanyiId,
    audioPath,
  });

  res.end();
});

// Read
app.get("/song/:id", async (req, res) => {
  const songId = req.params.id;

  if (!songId) {
    res.status(400);
    res.end();
    return;
  }

  res.json(await getSongById(+songId));

  res.end();
});

// Update
app.put("/song/:id", async (req, res) => {
  const songId = req.params.id;
  let { judul, penyanyiId, audioPath } = req.body;

  if (!judul && !penyanyiId && !audioPath) {
    res.status(400);
    res.end();
    return;
  }

  if (!songId) {
    res.status(400);
    res.end();
    return;
  }

  await updateSong({
    songId: +songId,
    judul,
    penyanyiId,
    audioPath,
  });

  res.end();
});

app.listen(ENV.PORT);
