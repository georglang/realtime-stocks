export interface IStockInWatchlist {
  symbol: string,
  name: string,
  limitHigh: string,
  limitLow: string,
  useLowLimit: boolean
}

export class StockInWatchlist implements IStockInWatchlist {
  public symbol: string;
  public name: string;
  public limitHigh: string;
  public limitLow: string;
  public useLowLimit: boolean;
  constructor(symbol: string, name: string, limitHigh: string, limitLow: string, useLowLimit: boolean) {
    this.symbol = symbol,
    this.name = name,
    this.limitHigh = limitHigh,
    this.limitLow = limitLow,
    this.useLowLimit = useLowLimit
  }
}