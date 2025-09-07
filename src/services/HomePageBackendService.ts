import homepage_api_address from "../globalConfig/HomepageBackend";
import type { SteamGame } from "../sharedTypes/BackendServiceTypes";
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
}