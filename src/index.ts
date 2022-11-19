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
  const { judul, penyanyi_id, audio_path } = req.body;

  if (!judul || !penyanyi_id || !audio_path) {
    res.status(400);
    res.end();
    return;
  }

  await insertSong({
    judul,
    penyanyi_id,
    audio_path,
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
  let { judul, penyanyi_id, audio_path } = req.body;

  await updateSong({
    song_id: +songId,
    judul,
    penyanyi_id,
    audio_path,
  });

  if (!songId) {
    res.status(400);
    res.end();
    return;
  }

  res.end();
});

app.listen(ENV.PORT);
