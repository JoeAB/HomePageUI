export interface CoinGeckSDKOptions {}

export interface SimplePrice {
  id: string;
  symbol: string;
  usdValue: number | undefined;
}
export type SupportedVsCurrencies = string[];

export interface SimplePriceParams {
  ids: string;
  vs_currencies: string;
  include_market_cap?: boolean;
  include_24hr_vol?: boolean;
  include_24hr_change?: boolean;
  include_last_updated_at?: boolean;
}

export interface TokenPriceParams {
  contract_addresses: string;
  vs_currencies: string;
}

export interface CoinListParams {
  include_platform?: boolean;
}

export interface CoinMarketsParams {
  vs_currency: string;
  ids?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
}

export interface CoinParams {
  localization?: boolean;
  tickers?: boolean;
  market_data?: boolean;
  community_data?: boolean;
  developer_data?: boolean;
  sparkline?: boolean;
}

export interface CoinTickersParams {
  exchange_ids?: string;
  page?: number;
}

export interface CoinHistoryParams {
  date: string;
  localization?: boolean;
}

export interface MarketChartParams {
  vs_currency: string;
  days: number;
}

export interface MarketChartRangeParams {
  vs_currency: string;
  from: number;
  to: number;
}

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms?: Record<string, string>;
}
export type CoinList = CoinListItem[];

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export type CoinMarkets = CoinMarketData[];

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string | null;
  platforms: Record<string, string>;
  block_time_in_minutes: number;
  hashing_algorithm: string | null;
  categories: string[];
  description: Record<string, string>;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: Record<string, any>;
  last_updated: string;
  tickers: any[];
}

export interface CoinTickers {
  name: string;
  tickers: any[];
}

export interface CoinHistory {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
  };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
  };
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinCategory {
  category_id: string;
  name: string;
}

export type CoinCategories = CoinCategory[];

export interface CoinCategoryMarketData {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  content: string;
  top_3_coins: string[];
  volume_24h: number;
  updated_at: string;
}

export type CoinCategoriesMarketData = CoinCategoryMarketData[];
