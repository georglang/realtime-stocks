import { Component, OnInit } from '@angular/core';
import { IStockInWatchlist } from '../interfaces/IStockWatchlist';
import { MatTableDataSource } from '@angular/material';
import { WatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';
import { ILimitReachedStock } from '../interfaces/ILimitReachedStock';
import { FirestoreService } from '../services/firestore.service/firestore-service.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent implements OnInit {
  public displayedColumns = ['name', 'symbol', 'currency', 'LH', 'LL', 'ULL'];
  public displayedColumnsLimitReached = ['symbol', 'price', 'changePercent'];

  public dataSource: MatTableDataSource<IStockInWatchlist>;
  public dataSourceLimitReached: MatTableDataSource<ILimitReachedStock>

  constructor(
    private watchlistService: WatchlistService,
    private router: Router,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.watchlistService.getWatchlist()
      .then((stocks: IStockInWatchlist[]) => {
        this.dataSource = new MatTableDataSource(stocks);
        console.log('Stocks: ', stocks);
      })

      this.firestoreService.getLimitReachedCollection()
      .then(stocks => {
        this.dataSourceLimitReached = new MatTableDataSource(stocks);
      })
  }

  public navigateToStockDetails(row) {
    this.router.navigate(['./stock-details/' + row.symbol, {name: row.name, curr: row.currency}]);
  }

}
