export interface SteamGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
}

export interface Track {
  name: string;
  artist: {
    name: string;
    mbid: string | null;
    url: string | null;
  };
  album: {
    name: string | null;
    mbid: string | null;
    url: string | null;
  };
  mbid: string | null;
  url: string;
  image: string | null;
  images: {
    small: string | null;
    medium: string | null;
    large: string | null;
    extralarge: string | null;
  };
  streamable: boolean;
  is_now_playing: boolean;
  played_at: {
    timestamp: number;
    formatted: string;
    iso: string;
  } | null;
}

export interface BookResult{
  book_id: number;
  book: Book;
}

export interface Book{
  title: string;
  image: BookImage
}

export interface BookImage{
  url: string;
}