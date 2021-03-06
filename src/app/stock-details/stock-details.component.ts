import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../services/watchlist.service';
import { ActivatedRoute, Params } from '@angular/router';
import { eTimeSeries } from '../interfaces/eTimeSeries';
import { AlphavantageService } from '../services/alphavantage-service';
import { GlobalQuoteDataJsObject } from '../interfaces/SearchResult';
import { StockInWatchlist } from '../interfaces/IStockWatchlist';
import { MatInputModule, MatButtonModule } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

interface IWatchlistFormData {
  limitHigh: string;
  limitLow: string;
  useLimitLow: boolean;
}

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.sass']
})

export class StockDetailsComponent implements OnInit {
  public data;
  public name: string;
  private currency: string;
  public limitHigh: string;
  public limitLow: string;
  public useLimitLow: boolean;

  constructor(
    private watchlistService: WatchlistService,
    private alphavantageService: AlphavantageService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log('Params', params);
      this.name = params.name;
      this.currency = params.currency;
      this.alphavantageService.getStockBySymbol(params.id)
        .subscribe(data => {
          this.mapGlobalQuoteDataToJsObject(data);
        }, err => {
          console.log("Error occured.", err);
        });
    })
  }

  public mapGlobalQuoteDataToJsObject(data) {
    const globalQuote = data["Global Quote"];

    if (globalQuote !== undefined) {
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

  public addToWatchlist(form: IWatchlistFormData) {
    this.watchlistService.add(new StockInWatchlist(
      this.data.symbol,
      this.name,
      this.currency,
      form.limitHigh,
      form.limitLow,
      form.useLimitLow
    )).then(firebaseId => {
      this.showSuccess();
    });
  }

  showSuccess() {
    this.toastr.success('Aktie zu Watchlist hinzugefügt', 'Erfolgreich!');
  }

  public onSubmit(form: IWatchlistFormData) {
    this.addToWatchlist(form);
  }
}
