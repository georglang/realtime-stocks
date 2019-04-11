import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../services/watchlist.service';
import { ActivatedRoute, Params } from '@angular/router';
import { eTimeSeries } from '../interfaces/eTimeSeries';
import { AlphavantageService } from '../services/alphavantage-service';
import { GlobalQuoteDataJsObject } from '../interfaces/SearchResult';


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  public data;

  constructor(
    private watchlistService: WatchlistService,
    private alphavantageService: AlphavantageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log('Params', params);
      this.alphavantageService.getStockByWKN(params.id, eTimeSeries.INTRADAY)
        .subscribe(data => {
          this.mapGlobalQuoteDataToJsObject(data);
        }, err => {
          console.log("Error occured.", err);
        });
    })
  }

  public mapGlobalQuoteDataToJsObject(data) {
    const globalQuote = data["Global Quote"];
    this.data = new GlobalQuoteDataJsObject(
      globalQuote["01. symbol"],
      globalQuote["02. open"],
      globalQuote["03. high"],
      globalQuote["04. low"],
      globalQuote["05. price"],
      globalQuote["06. volume"],
      globalQuote["07. latest trading day"],
      globalQuote["08. previous close"],
      globalQuote["09. change"],
      globalQuote["10. change percent"]
    );

  }
}
