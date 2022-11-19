import { pool } from "./mysql";

async function getSongById(id: number) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      connection.query(
        `SELECT * FROM song WHERE song_id = ${id};`,
        (err, result, fields) => {
          connection.release();

          if (err) {
            reject(err);
          }

          resolve(result);
        }
      );
    });
  });
}

export { getSongById };
