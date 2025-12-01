import type {
  CoinGeckSDKOptions,
  SimplePrice,
  SupportedVsCurrencies,
  CoinList,
  CoinMarkets,
  CoinData,
  CoinTickers,
  CoinHistory,
  CoinMarketChart,
  CoinCategories,
  CoinCategoriesMarketData,
  SimplePriceParams,
  TokenPriceParams,
  CoinListParams,
  CoinMarketsParams,
  CoinParams,
  CoinTickersParams,
  CoinHistoryParams,
  MarketChartParams,
  MarketChartRangeParams,
} from '../sharedTypes/CoinGeckTypes';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export class CoinGeckoClient {
  constructor(_options: CoinGeckSDKOptions = {}) {
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  getSimplePrice(params: SimplePriceParams) {
    return this.request<SimplePrice>('/simple/price', params);
  }

  getTokenPrice(chainId: string, params: TokenPriceParams) {
    return this.request<SimplePrice>(
      `/simple/token_price/${chainId}`,
      params
    );
  }

  getSupportedCurrencies() {
    return this.request<SupportedVsCurrencies>(
      '/simple/supported_vs_currencies'
    );
  }

  getCoinsList(params: CoinListParams = {}) {
    return this.request<CoinList>('/coins/list', params);
  }

  getMarkets(params: CoinMarketsParams) {
    return this.request<CoinMarkets>('/coins/markets', params);
  }

  getCoin(id: string, params: CoinParams = {}) {
    return this.request<CoinData>(`/coins/${id}`, params);
  }

  getCoinTickers(id: string, params: CoinTickersParams = {}) {
    return this.request<CoinTickers>(`/coins/${id}/tickers`, params);
  }

  getCoinHistory(id: string, params: CoinHistoryParams) {
    return this.request<CoinHistory>(`/coins/${id}/history`, params);
  }

  getMarketChart(id: string, params: MarketChartParams) {
    return this.request<CoinMarketChart>(
      `/coins/${id}/market_chart`,
      params
    );
  }

  getMarketChartRange(id: string, params: MarketChartRangeParams) {
    return this.request<CoinMarketChart>(
      `/coins/${id}/market_chart/range`,
      params
    );
  }

  getCoinByContract(
    chainId: string,
    contractAddress: string,
    params: CoinParams = {}
  ) {
    return this.request<CoinData>(
      `/coins/${chainId}/contract/${contractAddress}`,
      params
    );
  }

  getCategoryList() {
    return this.request<CoinCategories>(
      '/coins/categories/list'
    );
  }

  getCategories() {
    return this.request<CoinCategoriesMarketData>(
      '/coins/categories'
    );
  }
}

export function createCoinGeckoClient(
  options: CoinGeckSDKOptions = {}
) {
  return new CoinGeckoClient(options);
}
