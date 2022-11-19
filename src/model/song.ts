export interface SongDetails {
  judul?: string;
  penyanyi_id?: number;
  audio_path?: string;
}

export interface Song extends SongDetails {
  song_id: number;
}
