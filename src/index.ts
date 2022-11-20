import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./environment";
import { getSongById } from "./song";
import { getUserByUsername, getUserByEmail, checkLoggedIn } from "./authentication";
import jwt from "jsonwebtoken";
import { Md5 } from "ts-md5";

const app = express();

app.use(cors());

app.use(cookieParser());

app.use(express.json());

// TODO: add endpoints
app.get("/song/:id", async (req, res) => {
    const songId = req.params.id;

    res.json(await getSongById(+songId));

    res.end();
});

// docker run --rm --name hoppscotch -p 3000:3000 hoppscotch/hoppscotch:latest
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
            if (user){ // email exists
                if (password === user[0 as keyof typeof user]["password"]){
                    validCode = 1; // email
                }
            }

        } else {
            if (password === user[0 as keyof typeof user]["password"]){
                validCode = 2; //username
            }
        }

        // if valid
        if (validCode !== 0){
            // jwt
            if (user){
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

app.get("/testLoggedIn", async(req, res) => {
    let isLoggedIn = checkLoggedIn(req.cookies.token);

    if (isLoggedIn){
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

app.get("/test", async (req, res) => {
    res.write("Hello World!");
    
    res.end();
});

app.listen(ENV.PORT);
