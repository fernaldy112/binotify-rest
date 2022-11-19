export interface SongDetails {
  judul?: string;
  penyanyiId?: number;
  audioPath?: string;
}

export interface Song extends SongDetails {
  songId: number;
}
