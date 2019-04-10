import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { eTimeSeries } from '../interfaces/eTimeSeries';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IQuoteEndpoint, GlobalQuoteData, GlobalQuoteOwn } from '../interfaces/SearchResult';

@Injectable({
  providedIn: 'root'
})
export class AlphavantageService {
  private API_KEY = environment.alphavantageApiKey;
  private globalQuoteData: GlobalQuoteOwn;

  constructor(private http: HttpClient) { }

  public getStockByWKN(sym: string, timeSeries: eTimeSeries) {
    console.log('Symbol');

    // const url = `https://www.alphavantage.co/query?function=${timeSeries}&symbol=${sym}&apikey=${this.API_KEY}`;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&datatype=json&apikey=${this.API_KEY}`;

    var object1 = JSON.parse('{"roll no":101, "name":"Mayank", "age":20}');
    console.log('Object 1', object1);
    console.log('Test', object1['roll no']);



    this.http
      .get<any[]>(url)
      .subscribe((data) => {
        this.mapGlobalQuoteDataToJsObject(data);
      })
  }

  public mapGlobalQuoteDataToJsObject(data) {
    console.log('Data', data);

    const temp = data['Global Quote'];

    this.globalQuoteData = new GlobalQuoteOwn(
      temp["01. symbol"],
      temp["02. open:"]
    );
    debugger;
    return;
    this.globalQuoteData.symbol = temp["01. symbol"];
    debugger;

    this.globalQuoteData.open = temp["02. open:"];
    this.globalQuoteData.high = temp["03. high:"];
    this.globalQuoteData.low = temp["04. low:"];
    this.globalQuoteData.price = this.globalQuoteData["05. price:"];
    this.globalQuoteData.changePercent = this.globalQuoteData["06. volume:"];
    this.globalQuoteData.volume = this.globalQuoteData["07. latest trading day:"];
    this.globalQuoteData.latestTradingDay = this.globalQuoteData["08. previous close:"];
    this.globalQuoteData.previousClose = this.globalQuoteData["09. change:"];
    this.globalQuoteData.change = this.globalQuoteData["10. change percent:"];

    console.log('Result', this.globalQuoteData);
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
