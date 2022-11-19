import mysql from "mysql";
import { ENV } from "./environment";

export const pool = mysql.createPool({
  host: ENV.DB_HOST,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  port: +String(ENV.DB_PORT),
});
