import { Component, OnInit } from '@angular/core';
import { AlphavantageService } from './services/alphavantage-service';
import { environment } from '../environments/environment';
import { WatchlistService } from './services/watchlist.service';
import { IStockInWatchlist, StockInWatchlist } from './interfaces/IStockWatchlist';
import { GlobalQuoteDataJsObject, ISearchResult } from './interfaces/SearchResult';
import { MessagingService } from './services/messaging-service/messaging.service';
import { AuthService } from './core/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment-business-days';
import { FirestoreService } from './services/firestore.service/firestore-service.service';
import { AngularFireMessaging } from '@angular/fire/messaging';


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


  constructor(
    private alphavantageService: AlphavantageService,
    private watchlistService: WatchlistService,
    private messagingService: MessagingService,
    public authService: AuthService,
    private angularFireMessaging: AngularFireMessaging,
    private firestoreService: FirestoreService,
    private toastr: ToastrService
  ) {
    this.configMomentJs();
  }

  ngOnInit() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        alert(payload);
      });
    // alle 45 Minuten abfragen 2700000ms
    setInterval(this.getCurrentPrices.bind(this), 2700000);
  }

  public configMomentJs() {
    moment.updateLocale('de', {
      workingWeekdays: [1, 2, 3, 4, 5]
    });
  }

  public login() {
    this.authService.googleSignin();
  }

  // if more then five stocks, separate it in five per array because of amount of free
  // alphavantage api calls (5 per minute)
  private requestRealtimeStocks(stocks) {
    const waitingStocks1 = [];
    const waitingStocks2 = [];
    const waitingStocks3 = [];
    const waitingStocks4 = [];

    if (stocks.length > 5) {
      for (let index = 0; index < stocks.length; index++) {
        if (index <= 4) {
          waitingStocks1.push(stocks[index]);
        } else if (index > 4 && index <= 9) {
          waitingStocks2.push(stocks[index]);
        } else if (index > 9 && index <= 14) {
          waitingStocks3.push(stocks[index]);
        } else if (index > 14) {
          waitingStocks4.push(stocks[index]);
        }
      }
    } else {
      stocks.forEach(stock => {
        waitingStocks1.push(stock);
      });
    }

    if (waitingStocks1.length > 0) {
      waitingStocks1.forEach(stock => {
        console.log('Array 1', (Date.now()));
        this.checkIfLimitIsReached(stock);
      });
    }

    setTimeout(() => {
      if (waitingStocks2.length > 0) {
        waitingStocks2.forEach(stock => {
          console.log('Array 2', (Date.now()));
          this.checkIfLimitIsReached(stock);
        });
        setTimeout(() => {
          if (waitingStocks3.length > 0) {
            waitingStocks3.forEach(stock => {
              console.log('Array 3', (Date.now()));
              this.checkIfLimitIsReached(stock);
            });
            setTimeout(() => {
              if (waitingStocks4.length > 0) {
                waitingStocks4.forEach(stock => {
                  console.log('Array 4', (Date.now()));
                  this.checkIfLimitIsReached(stock);
                });
              }
            }, 66000)
          }
        }, 66000)
      }
    }, 66000)
  }

  public checkIfLimitIsReached(stockInWatchlist: IStockInWatchlist) {
    this.checkIfStockIsInLimitReachedCollection(stockInWatchlist)
      .then((isStockAlreadyInFirestore) => {
        if (!isStockAlreadyInFirestore) {
          this.alphavantageService.getStockBySymbol(stockInWatchlist.symbol)
            .subscribe((realtimeStock: any) => {
              if (realtimeStock !== undefined) {
                const stock = this.mapGlobalQuoteDataToJsObject(realtimeStock);

                if (stock !== undefined) {

                  if (stockInWatchlist.useLowLimit) {
                    if (stock.price <= stockInWatchlist.limitLow) {
                      this.toastr.warning('Unteren Schwellwert unterschritten', 'Aktie: ' + stockInWatchlist.name);
                      this.firestoreService.addToLimitReachedCollection(stock);
                      // return resolve(true);
                    }
                  } else {
                    if (stock.price >= stockInWatchlist.limitHigh) {
                      this.toastr.warning('Oberen Schwellwert überschritten', 'Aktie');
                      this.firestoreService.addToLimitReachedCollection(stock);
                      // return resolve(true);
                    }
                  }
                }
              }
              // });
            });
        }
      });
  }

  private checkIfStockIsInLimitReachedCollection(stock) {
    let isStockAlreadyInCollection = false;
    return new Promise((resolve, reject) => {
      this.firestoreService.getLimitReachedCollection()
        .then((stocksInLimitReachedCollection) => {
          stocksInLimitReachedCollection.forEach(stockInCollection => {
            if (stock.symbol === stockInCollection.symbol) {
              isStockAlreadyInCollection = true;
            }
          });
          if (isStockAlreadyInCollection) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }


  public requestStockPrices() {
    if (this.watchlistService !== undefined) {
      this.watchlistService.getWatchlist()
        .then(stocks => {
          if (stocks.length > 0) {
            this.requestRealtimeStocks(stocks);
          }
        });
    }
  }

  // trading days mo - fri
  // trading times 07:30 - 23:00
  public getCurrentPrices() {
    console.log('Called Timestamp', Date.now());
    // Trading days mo - fri
    if (moment(moment(), 'DD-MM-YYYY').isBusinessDay()) {
      const startTime = moment('07:30:00', 'HH:mm:ss');
      const endTime = moment('23:00:00', 'HH:mm:ss');
      if (moment().isBetween(startTime, endTime)) {
        this.requestStockPrices();
      }
    } else {
      // Saturday and Sunday
      console.log('Not a business day');
    }
  }

  public mapGlobalQuoteDataToJsObject(data) {
    if (data !== undefined) {
      const globalQuote = data["Global Quote"];

      if (globalQuote !== undefined) {
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
}