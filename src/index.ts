import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./environment";
import { deleteSongById, getSongById, insertSong, updateSong } from "./song";
import { allOf, anyOf, isValidId } from "./util";
import { getUserByUsername, getUserByEmail, checkLoggedIn } from "./authentication";
import { getAllArtist } from "./artist";
import jwt from "jsonwebtoken";
import { Md5 } from "ts-md5";

const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser());

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

// list penyanyi
app.get("/artistList", async (req, res) => {

  let rawData = await getAllArtist();



  res.json(rawData[0]);
  res.end();
});


// Login
app.post("/login", async (req, res) => {

  const credential = req.body.cred;
  const password = Md5.hashStr(req.body.pass);
  let validCode: number = 0;

  try {

    let user = await getUserByUsername(credential);

    // check if username exists
    if (!user) { // username doesn't exist

      let user = await getUserByEmail(credential);

      // check if email exists
      if (user) { // email exists
        if (password === user[0 as keyof typeof user]["password"]) {
          validCode = 1; // email
        }
      }

    } else {
      if (password === user[0 as keyof typeof user]["password"]) {
        validCode = 2; //username
      }
    }

    // if valid
    if (validCode !== 0) {
      // jwt
      if (user) {
        let userJson = {
          user_id: user[0 as keyof typeof user]["user_id"],
          password: user[0 as keyof typeof user]["password"]
        }
        const token = jwt.sign(userJson, "binotify");
        res.cookie("token", token);
        res.status(200).json({
          valid: true
        });
      }
    } else {
      res.status(200).json({
        valid: false,
        note: "Credential not valid"
      });
    }

  } catch (err) {
    res.status(500).json({
      note: "Something wrong with the server"
    });
  }

  res.end();

});

app.get("/testLoggedIn", async (req, res) => {
  let isLoggedIn = checkLoggedIn(req.cookies.token);

  if (isLoggedIn) {
    res.status(200).json({
      valid: true
    });
  } else {
    res.clearCookie("token");
    res.status(200).json({
      valid: false
    });
  }

  res.end();
});


app.listen(ENV.PORT);
