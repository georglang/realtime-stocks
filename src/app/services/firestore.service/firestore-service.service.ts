import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IStockInWatchlist } from '../../interfaces/IStockWatchlist';
import { ILimitReachedStock } from '../../interfaces/ILimitReachedStock';
import { map } from 'rxjs/operators';
import { IToken } from '../../interfaces/IToken';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public watchlistCollection: AngularFirestoreCollection<IStockInWatchlist>;
  public limitReachedCollection: AngularFirestoreCollection<IStockInWatchlist>;
  public fcmTokensCollection: AngularFirestoreCollection<IToken>;

  constructor(
    private firestore: AngularFirestore
  ) {
    this.watchlistCollection = this.firestore.collection<IStockInWatchlist>('Watchlist');
    this.limitReachedCollection = this.firestore.collection<IStockInWatchlist>('LimitReached');
    this.fcmTokensCollection = this.firestore.collection<IToken>('fcmTokens');

  }

  public addToLimitReachedCollection(stock: ILimitReachedStock): Promise<any> {
    const _stock = JSON.parse(JSON.stringify(stock));
    return this.limitReachedCollection
      .add(_stock)
      .then(docReference => {
        return docReference.id;
      })
      .catch(error => {
        console.error('Error adding limitReachedCollection: ', error);
      });
  }

  public getLimitReachedCollection(): Promise<ILimitReachedStock[]> {
    return new Promise((resolve, reject) => {
      return this.limitReachedCollection
        .snapshotChanges()
        .pipe(map(actions => actions.map(this.documentToDomainObject)))
        .subscribe((stocksLimitReached: ILimitReachedStock[]) => {
          resolve(stocksLimitReached);
        });
    });
  }

  documentToDomainObject = dToDO => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };

  deleteStockInWatchlistCollection(firestoreId: string) {
    return this.watchlistCollection
      .doc(firestoreId)
      .delete()
      .then(data => {
        return data;
      });
  }

  deleteStockInLimitReachedCollection(firestoreId: string) {
    return this.limitReachedCollection
      .doc(firestoreId)
      .delete()
      .then(data => {
        debugger;
        return data;
      });
  }
}
