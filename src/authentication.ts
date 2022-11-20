import { pool } from "./mysql";
import jwt from "jsonwebtoken";

async function getUserByUsername(username: string) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      connection.query(
        `SELECT * FROM user WHERE username = "${username}";`,
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

async function getUserByEmail(email: string) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
  
        connection.query(
          `SELECT * FROM user WHERE email = '${email}';`,
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

function checkLoggedIn(token: string) {

    let isLoggedIn = true;
    try {
        const userJson = jwt.verify(token, "binotify");
    } catch (err){
        isLoggedIn = false;
    }
    
    return isLoggedIn;
}

export { getUserByUsername, getUserByEmail , checkLoggedIn};