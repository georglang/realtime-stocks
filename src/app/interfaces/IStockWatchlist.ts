export interface IStockInWatchlist {
  symbol: string,
  limitHigh: string,
  limitLow: string,
  useLowLimit: boolean
}

export class StockInWatchlist implements IStockInWatchlist {
  public symbol: string;
  public limitHigh: string;
  public limitLow: string;
  public useLowLimit: boolean;
  constructor(symbol: string, limitHigh: string, limitLow: string, useLowLimit: boolean) {
    this.symbol = symbol,
    this.limitHigh = limitHigh,
    this.limitLow = limitLow,
    this.useLowLimit = useLowLimit
  }
}