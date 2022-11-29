import { query } from "./mysql";

async function getAllArtist() {
    return query(`SELECT user_id, name FROM user WHERE isAdmin = 0;`);
}

export { getAllArtist };