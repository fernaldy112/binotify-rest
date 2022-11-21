import { query } from "./mysql";

async function getAllArtist() {
    return query(`SELECT user.name FROM user, song WHERE user.user_id=song.penyanyi_id;`);
}

export { getAllArtist };