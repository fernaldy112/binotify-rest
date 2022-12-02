import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./environment";
import {
  deleteSongById,
  getSongById,
  getSongs,
  insertSong,
  updateSong,
} from "./song";
import { allOf, anyOf, getClientUserId, isValidId, UserInfo } from "./util";
import {
  getUserByUsername,
  getUserByEmail,
  checkLoggedIn,
  addUser,
} from "./authentication";
import { getAllArtist } from "./artist";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Md5 } from "ts-md5";
import {
  getPendingSubscriptions,
  handleUpdateSubscription,
  getSubscriptionStatus,
} from "./subscription";
import fileUpload, { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { Song } from "./model/song";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));
app.use(fileUpload());

// middleware to check routes
app.use((req, res, next) => {
  const PUBLIC_URLS = [
    /^\/login$/,
    /^\/register$/,
    /^\/artistList$/,
    /^\/songList\/\d+\/\d+$/,
    /^\/assets\/.*$/,
  ];
  const USER_URLS = [/^\/song(\/\d+)?$/];
  const ADMIN_URLS = [
    ...USER_URLS,
    /^\/subscriptions((\/accept)|(\/reject))?$/,
  ]; ///^\/artistList$/,

  const isPublicUrl = PUBLIC_URLS.reduce(
    (yes, pattern) => yes || pattern.test(req.path),
    false
  );

  if (isPublicUrl) {
    // console.log("This url is accessible by anyone");
    next();
  } else {
    try {
      let token = req.headers.authorization!.split(" ")[1];
      const userJson: UserInfo = jwt.verify(token, "binotify") as JwtPayload;

      let valid = false;
      if (userJson.isAdmin) {
        for (let regexp of ADMIN_URLS) {
          valid = regexp.test(req.path);
          if (valid) {
            break;
          }
        }
      } else {
        for (let regexp of USER_URLS) {
          valid = regexp.test(req.path);
          if (valid) {
            break;
          }
        }
      }
      if (valid) {
        next();
      } else {
        res.status(404);
        res.end();
      }
    } catch (err) {
      res.status(400);
      res.end();
    }
  }
});

// Create
app.post("/song", async (req, res) => {
  const { judul } = req.body;
  const file = req.files!.audioFile as UploadedFile;
  const artistId = getClientUserId(req);

  if (anyOf(!!judul, !!artistId, !!file).is(false)) {
    res.status(400);
    res.end();
    return;
  }

  const filePath = path.parse(file.name);

  const audioPath = `${filePath.name}-${Date.now()}${filePath.ext}`;
  await file.mv(`./assets/${audioPath}`);

  await insertSong({
    judul,
    penyanyiId: artistId,
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

app.get("/song", async (req, res) => {
  const token = req.headers.authorization!.split(" ")[1];
  const user: UserInfo = jwt.verify(token, "binotify") as JwtPayload;
  const artistId = user.user_id;

  const rawData = !user.isAdmin ? await getSongs(+artistId) : await getSongs();

  res.json(rawData);
  res.end();
});

// Update
app.put("/song/:id", async (req, res) => {
  const songId = req.params.id;
  const { judul } = req.body;
  const file = req.files ? req.files.audioFile as UploadedFile : undefined;
  const artistId = getClientUserId(req);

  if (
    allOf(!judul, !artistId, !file).is(true) ||
    !songId ||
    !isValidId(songId)
  ) {
    res.status(400);
    res.end();
    return;
  }

  let audioPath = undefined;

  if (file) {
    const filePath = path.parse(file.name);
    audioPath = `${filePath.name}-${Date.now()}${filePath.ext}`;
    await file.mv(`./assets/${audioPath}`);
  }


  await updateSong({
    songId: +songId,
    judul,
    penyanyiId: artistId,
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

  res.json(rawData);
  res.end();
});

//list lagu
app.get("/songList/:user/:penyanyi", async (req, res) => {
  const userID = req.params.user;
  const singerID = req.params.penyanyi;

  if (!userID || !isValidId(userID) || !singerID || !isValidId(singerID)) {
    res.status(400);
    res.end();
    return;
  }

  let status = await getSubscriptionStatus(+singerID, +userID);
  console.log(`Status: ${status}`);
  if (status === "ACCEPTED") {
    let rawData = await getSongs(+singerID);
    res.json(rawData);
  } else {
    res.status(200).json({
      note: "subscription have not been accepted",
    });
  }
  res.end();
});

// Login
app.post("/login", async (req, res) => {
  const credential = req.body.cred;
  const password = Md5.hashStr(req.body.pass);
  let validCode: number = 0;
  // 1: login with email
  // 2: login with username

  try {
    let user: any[] = await getUserByUsername(credential);

    // check if username exists
    if (user.length === 0) {
      // username doesn't exist

      let user: any[] = await getUserByEmail(credential);

      // check if email exists
      if (user.length !== 0) {
        // email exists
        if (password === user[0]["password"]) {
          validCode = 1; // email
        }
      }
    } else {
      if (password === user[0]["password"]) {
        validCode = 2; //username
      }
    }

    // if valid
    if (validCode !== 0) {
      // jwt
      if (validCode === 1) {
        user = await getUserByEmail(credential);
      } else {
        user = await getUserByUsername(credential);
      }
      if (user.length !== 0) {
        let userJson = {
          user_id: user[0]["user_id"],
          username: user[0]["username"],
          isAdmin: user[0]["isAdmin"],
        };

        const token = jwt.sign(userJson, "binotify");
        // res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
          isAdmin: user[0]["isAdmin"],
          token: token,
        });
      }
    } else {
      res.status(401);
    }
  } catch (err) {
    res.status(500);
  }

  res.end();
});

// Register
app.post("/register", async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = Md5.hashStr(req.body.pass);
  const password2 = Md5.hashStr(req.body.pass2);
  let registerErrorCode: number = 0;
  // 1: username already exist
  // 2: email already exist
  // 3: passwords don't match
  try {
    let user: any[] = await getUserByUsername(username);

    // check if username exists
    if (user.length === 0) {
      // username doesn't exist

      let user: any[] = await getUserByEmail(email);

      // check if email exists
      if (user.length !== 0) {
        // email exists
        registerErrorCode = 2; // email
      }
    } else {
      registerErrorCode = 1;
    }

    if (registerErrorCode === 0 && password !== password2) {
      registerErrorCode = 3;
    }

    // if valid
    if (registerErrorCode === 0) {
      await addUser(name, username, email, password);
      let user: any[] = await getUserByUsername(username);
      // jwt
      if (user.length !== 0) {
        let userJson = {
          user_id: user[0]["user_id"],
          username: user[0]["username"],
          isAdmin: user[0]["isAdmin"],
        };
        const token = jwt.sign(userJson, "binotify");
        // res.cookie("token", token, { httpOnly: true });
        res.status(200).json({
          isAdmin: user[0]["isAdmin"],
          token: token,
        });
      }
    } else if (registerErrorCode === 1) {
      res.status(401).json({
        note: "Username already exists",
      });
    } else if (registerErrorCode === 2) {
      res.status(401).json({
        note: "Email already exists",
      });
    } else if (registerErrorCode === 3) {
      res.status(401).json({
        note: "Confirm password doesn't match",
      });
    }
  } catch (err) {
    res.status(500);
  }

  res.end();
});

app.get("/testLoggedIn", async (req, res) => {
  let isLoggedIn = checkLoggedIn(req.cookies.token);

  if (isLoggedIn) {
    res.status(200).json({
      valid: true,
    });
  } else {
    res.clearCookie("token");
    res.status(200).json({
      valid: false,
    });
  }

  res.end();
});

app.get("/subscriptions", async (req, res) => {
  // let page = req.query.page;
  const page =
    req.query.page && isValidId(req.query.page as string) ? +req.query.page : 1;
  const subscriptions = (await getPendingSubscriptions(page)) || [];

  const lastPage = subscriptions.length != 21;
  const firstPage = page == 1;
  if (subscriptions.length == 21) {
    subscriptions.pop();
  }

  res.json({ firstPage, lastPage, subscriptions });
  res.end();
});

app.post("/subscriptions/accept", async (req, res) => {
  handleUpdateSubscription(req, res, "ACCEPTED");
});

app.post("/subscriptions/reject", async (req, res) => {
  handleUpdateSubscription(req, res, "REJECTED");
});

if (!fs.existsSync("./assets")) {
  fs.mkdirSync("./assets");
}

app.listen(ENV.PORT);
