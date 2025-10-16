import homepage_api_address from "../globalConfig/HomepageBackend";
import type { BookResult, SteamGame, Track } from "../sharedTypes/BackendServiceTypes";
import type { ListItem } from "../sharedTypes/WidgetListTypes";


export class HomepageBackendService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = homepage_api_address;
  }

  async getRecentlyPlayedSteamGames(): Promise<ListItem[]> {
    const response = await fetch(`${this.baseUrl}/steam/recently-played`);

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played games: ${response.status}`);
    }

    const games: SteamGame[] = await response.json();

    return games.map((game) => ({
      title: game.name,
      link: `https://store.steampowered.com/app/${game.appid}`,
      imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/library_600x900_2x.jpg`
    }));
  }

async getRecentlyListenedToTracks(): Promise<ListItem[]> {
    const response = await fetch(`${this.baseUrl}/music/recently-played`);

    if (!response.ok) {
      throw new Error(`Failed to fetch recently played tracks: ${response.status}`);
    }

    const tracks: Track[] = await response.json();

        const uniqueTracks = tracks.filter((track, index, self) =>
            index === self.findIndex(
                (t) =>
                t.name.toLowerCase() === track.name.toLowerCase() &&
                t.artist.name.toLowerCase() === track.artist.name.toLowerCase()
            )
        );

    return uniqueTracks.map((track) => ({
      title: track.name,
      link: track.url,
      imageUrl: track.image as string
    }));
  }

  async getCurrentReadingBooks(): Promise<ListItem[]> {
    const response = await fetch(`${this.baseUrl}/books/currentlyReading`);

    if (!response.ok) {
      throw new Error(`Failed to fetch currently reading books: ${response.status}`);
    }

    const books: BookResult[] = await response.json();

    return books.map((book) => ({
      title: book.book.title,
      link: '',
      imageUrl: book.book.image.url
    }));
  }

}
