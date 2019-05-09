import { Component, OnInit } from '@angular/core';
import { IStockInWatchlist } from '../interfaces/IStockWatchlist';
import { MatTableDataSource } from '@angular/material';
import { WatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent implements OnInit {
  public displayedColumns = ['name', 'symbol', 'currency', 'LH', 'LL', 'ULL'];
  public dataSource: MatTableDataSource<IStockInWatchlist>;
  constructor(
    private watchlistService: WatchlistService,
    private router: Router
  ) { }

  ngOnInit() {
    this.watchlistService.getWatchlist()
      .then((stocks: IStockInWatchlist[]) => {
        this.dataSource = new MatTableDataSource(stocks);
        console.log('Stocks: ', stocks);
      })
  }

  public navigateToStockDetails(row) {
    this.router.navigate(['./stock-details/' + row.symbol, {name: row.name, curr: row.currency}]);
  }

}
