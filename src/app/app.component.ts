import { Component, OnInit } from '@angular/core';
import { AlphavantageService } from './services/alphavantage-service';
import { environment } from '../environments/environment';
import { WatchlistService } from './services/watchlist.service';
import { IStockInWatchlist } from './interfaces/IStockWatchlist';
import { GlobalQuoteDataJsObject } from './interfaces/SearchResult';
import { MessagingService } from './services/messaging-service/messaging.service';
import { AuthService } from './core/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment-business-days';

// impoart { c } from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public searchResult = [];
  private API_KEY = environment.alphavantageApiKey;
  public message;
  public isLoggedIn = false;
  private startTime;
  private endTime;
  private realtimeStock: GlobalQuoteDataJsObject;

  constructor(
    private alphavantageService: AlphavantageService,
    private watchlistService: WatchlistService,
    private messagingService: MessagingService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.configMomentJs();
  }

  ngOnInit() {
    const userId = localStorage.getItem('id');
    if (userId !== undefined) {
      this.messagingService.requestPermission(userId)
      this.messagingService.receiveMessage()
      this.message = this.messagingService.currentMessage;
    }

    console.log('Time', moment(moment(), 'DD-MM-YYYY').isBusinessDay());
    this.getCurrentPrices();
  }

  public configMomentJs() {
    moment.updateLocale('de', {
      workingWeekdays: [1, 2, 3, 4, 5]
    });
  }

  public login() {
    this.authService.signInWithGoogle();
  }

  private requestStockPrices() {
    let stockInWatchlist: IStockInWatchlist;
    if (this.watchlistService !== undefined) {
      this.watchlistService.getWatchlist()
        .then(stocks => {
          stocks.forEach(stock => {
            stockInWatchlist = Object.assign(stock);




            this.alphavantageService.getStockBySymbol(stock.symbol)
              .subscribe((realtimeStock) => {
                if (realtimeStock !== undefined) {
                  this.realtimeStock = this.mapGlobalQuoteDataToJsObject(realtimeStock);

                  if (stockInWatchlist.useLowLimit) {
                    if (this.realtimeStock.price <= stockInWatchlist.limitLow) {
                      this.toastr.warning('Unteren Schwellwert unterschritten', 'Aktie: ' + stockInWatchlist.name);
                    }
                  } else {
                    if (this.realtimeStock.price >= stockInWatchlist.limitHigh) {
                      this.toastr.warning('Oberen Schwellwert überschritten', 'Aktie');
                    }
                  }
                }
              });
          });
        });
    }
  }

  // trading days mo - fri
  // trading times 07:30 - 23:00
  private getCurrentPrices() {
    // Trading days mo - fri
    if (moment(moment(), 'DD-MM-YYYY').isBusinessDay()) {

      // Saturday and Sunday
    } else {
      console.log('Not a business day');
      const startTime = moment('07:30:00', 'HH:mm:ss');
      const endTime = moment('23:00:00', 'HH:mm:ss');


      if (moment().isBetween(startTime, endTime)) {
        console.log(' ******* Is Between ******');
        this.requestStockPrices();

      } else {
        console.log('###### OUt of Business Hours #####');

      }
    }
    setInterval(this.getCurrentPrices, 10000);
  }

  public mapGlobalQuoteDataToJsObject(data) {
    if (data !== undefined) {
      const globalQuote = data["Global Quote"];
      return new GlobalQuoteDataJsObject(
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
}
