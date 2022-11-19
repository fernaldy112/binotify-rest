import express from "express";
import cors from "cors";
import { ENV } from "./environment";
import { deleteSongById, getSongById, insertSong, updateSong } from "./song";
import { allOf, anyOf, isValidId } from "./util";

const app = express();

app.use(cors());
app.use(express.json());

// TODO: add endpoints

// Create
app.post("/song", async (req, res) => {
  const { judul, penyanyiId, audioPath } = req.body;

  if (anyOf(!!judul, !!penyanyiId, !!audioPath).is(false)) {
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

  if (!songId || !isValidId(songId)) {
    res.status(400);
    res.end();
    return;
  }

  const rawData = await getSongById(+songId);

  if (rawData.length == 0) {
    res.status(404);
    res.end();
    return;
  }

  res.json(rawData[0]);
  res.end();
});

// Update
app.put("/song/:id", async (req, res) => {
  const songId = req.params.id;
  let { judul, penyanyiId, audioPath } = req.body;

  if (
    allOf(!judul, !penyanyiId, !audioPath).is(true) ||
    !songId ||
    !isValidId(songId)
  ) {
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

// Delete
app.delete("/song/:id", async (req, res) => {
  const songId = req.params.id;

  if (!songId || !isValidId(songId)) {
    res.status(400);
    res.end();
    return;
  }

  await deleteSongById(+songId);

  res.end();
});

app.listen(ENV.PORT);
