import { query } from "./mysql";
import jwt from "jsonwebtoken";

async function getUserByUsername(username: string) {
    return query(`SELECT * FROM user WHERE username = "${username}";`);
}

async function getUserByEmail(email: string) {
    return query(`SELECT * FROM user WHERE email = '${email}';`);
}

async function addUser(name: string, username: string, email: string, password: string) {
    return query(`INSERT INTO user (email, password, username, name, isAdmin) VALUES (
        '${email}',
        '${password}',
        '${username}',
        '${name}',
        0
    );`);
    
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

export { getUserByUsername, getUserByEmail , checkLoggedIn, addUser };