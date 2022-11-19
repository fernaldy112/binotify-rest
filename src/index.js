import express from "express";
import { ENV } from "./environment.js";

const app = express();

// TODO: add endpoints

app.listen(ENV.PORT);
