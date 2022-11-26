import { Song, SongDetails } from "./model/song";
import { query } from "./mysql";

async function getSongById(id: number) {
  return query(`SELECT * FROM song WHERE song_id = ${id};`);
}

async function insertSong(song: SongDetails) {
  const { judul, penyanyiId, audioPath } = song;
  return query(`INSERT INTO song VALUES (
    NULL,
    '${judul}',
    ${penyanyiId},
    '${audioPath}'
  );`);
}

async function updateSong(song: Song) {
  const { songId, judul, penyanyiId, audioPath } = song;
  let UPDATES = [];
  if (judul !== undefined) {
    UPDATES.push(`judul = '${judul}'`);
  }
  if (penyanyiId !== undefined) {
    UPDATES.push(`penyanyi_id = ${penyanyiId}`);
  }
  if (audioPath !== undefined) {
    UPDATES.push(`audio_path = '${audioPath}'`);
  }

  return query(
    `UPDATE song SET ${UPDATES.join(", ")} WHERE song_id = ${songId}`
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

async function getSongs(artistId?: number) {
  let cond = "";

  if (artistId) {
    cond = ` WHERE penyanyi_id = ${artistId}`;
  }

  return query(`SELECT * FROM song${cond};`).then((rawData) => {
    return rawData;
  });
}

export {
  getSongById,
  insertSong,
  updateSong,
  deleteSongById,
  getSongCount,
  getSongs,
};
