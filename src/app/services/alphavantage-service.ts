import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { eTimeSeries } from '../interfaces/eTimeSeries';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GlobalQuoteDataJsObject, SearchResult } from '../interfaces/SearchResult';

@Injectable({
  providedIn: 'root'
})
export class AlphavantageService {
  private API_KEY = environment.alphavantageApiKey;
  private data: GlobalQuoteDataJsObject;

  constructor(private http: HttpClient) { }

  public getStockBySymbol(symbol: string, timeSeries: eTimeSeries) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&datatype=json&apikey=${this.API_KEY}`;

    return this.http.get<SearchResult[]>(url);
  }

  // GetMacd(symbol: string, intervallType: IntervallType, timeperiode = 10): Observable<any> {
  //     return this.http.get('function=MACD&symbol=' + symbol + '&interval=' + intervallType + '&time_period=' + timeperiode + '&series_type=open').pipe(map((response) => {
  //         return response.json() as any;
  //     }));
  // }

  // GetStockData(symbol: string, intervallPeriod: IntervallPeriod = IntervallPeriod.THIRTEEN): Observable<any> {
  //     return this.http.get('function=TIME_SERIES_DAILY&symbol=' + symbol + '&interval=' + intervallPeriod).pipe(map((response) => {
  //         return response.json() as any;
  //     }));
  // }

  // GetCurrentStockData(symbol: string): Observable<any> {
  //     return this.http.get('function=GLOBAL_QUOTE&symbol=' + symbol).pipe(map((response) => {
  //         return response.json() as any;
  //     }));
  // }

  // https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo

  GetSearch(searchQuery: string): Observable<any> {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${this.API_KEY}`;
    return this.http.get(url)
      .pipe(map((response) => {
        return response;
      }));
  }
}
