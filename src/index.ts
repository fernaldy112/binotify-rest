import express from "express";
import { ENV } from "./environment";

const app = express();

// TODO: add endpoints

app.listen(ENV.PORT);
