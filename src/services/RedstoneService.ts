import redstone from 'redstone-api';

export interface RedStonePriceData {
  value: number;
  timestamp: number;
  provider: string;
  permawebTx: string;
  source: Record<string, number>;
}

export interface RedStonePricesData {
  [symbol: string]: RedStonePriceData;
}

export interface RedStoneHistoricalOptions {
  date?: string | number | Date;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  interval?: number;
  offset?: number;
  limit?: number;
  verifySignature?: boolean;
}

export interface RedStoneClientOptions {
  cacheApiUrl?: string;
  useCache?: boolean;
  verifySignature?: boolean;
}

export class RedStoneClient {
  private apiClient: any;
  private defaultOptions: RedStoneClientOptions;

  constructor(options: RedStoneClientOptions = {}) {
    this.defaultOptions = {
      useCache: true,
      verifySignature: false,
      ...options
    };

    // Initialize RedStone API client with custom options if provided
    if (options.cacheApiUrl || options.useCache === false) {
      this.apiClient = new redstone.Api({
        cacheApiUrl: options.cacheApiUrl,
        useCache: options.useCache
      });
    } else {
      this.apiClient = redstone;
    }

    // Set custom cache API URL if provided
    if (options.cacheApiUrl && !options.useCache) {
      redstone.setCacheApiUrl(options.cacheApiUrl);
    }
  }

  /**
   * Get the latest price for a single token
   * @param symbol Token symbol (e.g., "AR", "BTC", "ETH")
   * @param options Optional verification settings
   */
  public async getPrice(symbol: string, options: { verifySignature?: boolean } = {}): Promise<RedStonePriceData> {
    const verifySignature = options.verifySignature ?? this.defaultOptions.verifySignature;
    return await this.apiClient.getPrice(symbol, { verifySignature });
  }

  /**
   * Get the latest prices for multiple tokens
   * @param symbols Array of token symbols
   * @param options Optional verification settings
   */
  public async getPrices(symbols: string[], options: { verifySignature?: boolean } = {}): Promise<RedStonePricesData> {
    const verifySignature = options.verifySignature ?? this.defaultOptions.verifySignature;
    return await this.apiClient.getPrice(symbols, { verifySignature });
  }

  /**
   * Get the latest prices for all available tokens
   * @param options Optional verification settings
   */
  public async getAllPrices(options: { verifySignature?: boolean } = {}): Promise<RedStonePricesData> {
    const verifySignature = options.verifySignature ?? this.defaultOptions.verifySignature;
    return await this.apiClient.getAllPrices({ verifySignature });
  }

  /**
   * Get historical price for a single token at a specific date
   * @param symbol Token symbol
   * @param options Historical price options
   */
  public async getHistoricalPrice(symbol: string, options: RedStoneHistoricalOptions): Promise<RedStonePriceData | RedStonePriceData[]> {
    const requestOptions: any = {};
    
    if (options.date) {
      requestOptions.date = options.date;
    }

    if (options.startDate && options.endDate) {
      requestOptions.startDate = options.startDate;
      requestOptions.endDate = options.endDate;
      
      if (options.interval) {
        requestOptions.interval = options.interval;
      }
    }

    if (options.offset !== undefined) {
      requestOptions.offset = options.offset;
    }

    if (options.limit !== undefined) {
      requestOptions.limit = options.limit;
    }

    if (options.verifySignature !== undefined) {
      requestOptions.verifySignature = options.verifySignature;
    } else if (this.defaultOptions.verifySignature) {
      requestOptions.verifySignature = this.defaultOptions.verifySignature;
    }

    return await this.apiClient.getHistoricalPrice(symbol, requestOptions);
  }

  /**
   * Get historical prices for multiple tokens at a specific date
   * @param symbols Array of token symbols
   * @param options Historical price options (must include date)
   */
  public async getHistoricalPrices(symbols: string[], options: RedStoneHistoricalOptions): Promise<RedStonePricesData> {
    if (!options.date) {
      throw new Error('Date is required for historical prices of multiple tokens');
    }

    const requestOptions: any = {
      date: options.date
    };

    if (options.verifySignature !== undefined) {
      requestOptions.verifySignature = options.verifySignature;
    } else if (this.defaultOptions.verifySignature) {
      requestOptions.verifySignature = this.defaultOptions.verifySignature;
    }

    return await this.apiClient.getHistoricalPrice(symbols, requestOptions);
  }

  /**
   * Get historical prices in a time range for a single token
   * @param symbol Token symbol
   * @param startDate Start date
   * @param endDate End date
   * @param interval Interval in milliseconds (optional)
   */
  public async getPricesInRange(
    symbol: string,
    startDate: string | number | Date,
    endDate: string | number | Date,
    interval?: number
  ): Promise<RedStonePriceData[]> {
    const options: RedStoneHistoricalOptions = {
      startDate,
      endDate
    };

    if (interval) {
      options.interval = interval;
    }

    return this.getHistoricalPrice(symbol, options) as Promise<RedStonePriceData[]>;
  }

  /**
   * Get 1 year of historical prices for a token
   * @param symbol Token symbol
   * @param interval Interval in milliseconds (default: 1 day)
   */
  public async get1YearPrices(symbol: string, interval: number = 24 * 60 * 60 * 1000): Promise<RedStonePriceData[]> {
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

    return this.getPricesInRange(symbol, oneYearAgo, now, interval);
  }

  /**
   * Get paginated historical prices for a token
   * @param symbol Token symbol
   * @param offset Number of records to skip
   * @param limit Number of records to return
   */
  public async getPaginatedPrices(
    symbol: string,
    offset: number,
    limit: number
  ): Promise<RedStonePriceData[]> {
    const options: RedStoneHistoricalOptions = {
      offset,
      limit
    };

    return this.getHistoricalPrice(symbol, options) as Promise<RedStonePriceData[]>;
  }

  /**
   * Set custom cache API URL
   * @param url Custom cache API URL
   */
  public setCacheApiUrl(url: string): void {
    redstone.setCacheApiUrl(url);
  }

  /**
   * Use fluent interface for complex queries
   * @returns RedStone query builder
   */
  public query(): any {
    return redstone.query();
  }

  /**
   * Get client configuration
   */
  public getConfig(): RedStoneClientOptions {
    return { ...this.defaultOptions };
  }
}