import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlphavantageService } from './alphavantage-service';
import { eTimeSeries } from '../interfaces/eTimeSeries';
import { IStockInWatchlist } from '../interfaces/IStockWatchlist';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  public watchlistCollection: AngularFirestoreCollection<IStockInWatchlist>;
  stock: Observable<IStockInWatchlist[]>;
  constructor(
    private db: AngularFirestore,
    private alphavantageService: AlphavantageService,
    private firestore: AngularFirestore
  ) {
    this.watchlistCollection = this.firestore.collection<IStockInWatchlist>('Watchlist');
  }

  public getWatchlist(): Promise<IStockInWatchlist[]> {
    return new Promise((resolve, reject) => {
      return this.watchlistCollection
        .snapshotChanges()
        .pipe(map(actions => actions.map(this.documentToDomainObject)))
        .subscribe((stocks: IStockInWatchlist[]) => {
          resolve(stocks);
        });
    });
  }

  documentToDomainObject = dToDO => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };

  public getStockByWKN(symbol: string, timeSeries: eTimeSeries) {
    return this.alphavantageService.getStockBySymbol(symbol, timeSeries);
  }

  public add(stock: IStockInWatchlist): Promise<any> {

    const _stock = JSON.parse(JSON.stringify(stock));
    return this.watchlistCollection
      .add(_stock)
      .then(docReference => {
        return docReference.id;
      })
      .catch(error => {
        console.error('Error adding watchlist: ', error);
      });
  }
}
