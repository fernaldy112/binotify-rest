import mysql from "mysql";
import { ENV } from "./environment";

export const pool = mysql.createPool({
  host: ENV.DB_HOST,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  port: +String(ENV.DB_PORT),
});

export function query(query: string) {
  return new Promise<any[]>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      connection.query(query, (err, result, _) => {
        connection.release();

        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  });
}
