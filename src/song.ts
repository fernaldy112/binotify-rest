import { Song, SongDetails } from "./model/song";
import { query } from "./mysql";

async function getSongById(id: number) {
  return query(`SELECT * FROM song WHERE song_id = ${id};`);
}

async function insertSong(song: SongDetails) {
  const { judul, penyanyi_id, audio_path } = song;
  return query(`INSERT INTO song VALUES (
    NULL,
    '${judul}',
    ${penyanyi_id},
    '${audio_path}'
  );`);
}

async function updateSong(song: Song) {
  const { song_id, judul, penyanyi_id, audio_path } = song;
  let UPDATES = [];
  if (judul !== undefined) {
    UPDATES.push(`judul = ${judul}`);
  }
  if (penyanyi_id !== undefined) {
    UPDATES.push(`penyanyi_id = ${penyanyi_id}`);
  }
  if (audio_path !== undefined) {
    UPDATES.push(`audio_path = ${audio_path}`);
  }

  return query(
    `UPDATE song SET ${UPDATES.join(", ")} WHERE song_id = ${song_id}`
  );
}

async function deleteSongById(id: number) {
  return query(`DELETE FROM song WHERE song_id = ${id};`);
}

async function getSongCount() {
  return query(`SELECT COUNT(*) AS count FROM song;`).then((rawData) => {
    console.log(rawData);
    console.log(rawData[0]["count"]);
    return rawData[0]["count"];
  });
}

export { getSongById, insertSong, updateSong, deleteSongById, getSongCount };
