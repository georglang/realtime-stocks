import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { FirestoreService } from '../services/firestore.service/firestore-service.service';
import { WatchlistService } from '../services/watchlist.service';
import { IStockInWatchlist } from '../interfaces/IStockWatchlist';
import { ILimitReachedStock } from '../interfaces/ILimitReachedStock';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns = ['name', 'symbol', 'currency', 'LH', 'LL', 'ULL', 'delete'];
  public displayedColumnsLimitReached = ['name', 'symbol', 'price', 'changePercent', 'delete'];

  private stocksInWatchlist: IStockInWatchlist[];
  private stocksLimitReached: ILimitReachedStock[];
  public dataSource: MatTableDataSource<IStockInWatchlist>;
  public dataSourceLimitReached: MatTableDataSource<ILimitReachedStock>

  constructor(
    private watchlistService: WatchlistService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getStocksInWatchlist();
    this.getStocksLimitReached();
  }

  public getStocksInWatchlist(): void {
    this.watchlistService.getWatchlist()
      .then((stocks: IStockInWatchlist[]) => {
        this.stocksInWatchlist = stocks;
        this.dataSource = new MatTableDataSource(this.stocksInWatchlist);
        this.dataSource.sort = this.sort;
      });
  }

  public getStocksLimitReached(): void {
    this.firestoreService.getLimitReachedCollection()
      .then((stocks: any) => {
        this.stocksLimitReached = stocks;
        this.dataSourceLimitReached = new MatTableDataSource(this.stocksLimitReached);
        this.dataSourceLimitReached.sort = this.sort;
      });
  }

  public deleteStockInWatchlistCollection(firestoreId: string, symbol: string): void {
    this.openDeleteDialog(firestoreId, symbol, true);
  }

  public deleteStockInLimitReachedCollection(firestoreId: string, symbol: string): void {
    this.openDeleteDialog(firestoreId, symbol, false);
  }

  public openDeleteDialog(firestoreId: string, symbol: string, shouldDeleteFromWatchlist: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '110px';
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogRef => {
      if (dialogRef.data) {
        if (shouldDeleteFromWatchlist) {
          this.firestoreService.deleteStockInWatchlistCollection(firestoreId)
            .then((data) => {
              if (this.stocksInWatchlist.length > 0) {
                const stocksInWatchlist = this.stocksInWatchlist.filter(stock => stock.symbol !== symbol);
                this.dataSource = new MatTableDataSource(stocksInWatchlist);
                this.dataSourceLimitReached.sort = this.sort;
              }
            });
        } else {
          this.firestoreService.deleteStockInLimitReachedCollection(firestoreId)
            .then((data) => {
              if (this.stocksLimitReached.length > 0) {
                const stocksLimitReached = this.stocksLimitReached.filter(stock => stock.symbol !== symbol);
                this.dataSourceLimitReached = new MatTableDataSource(stocksLimitReached);
                this.dataSourceLimitReached.sort = this.sort;
              }
            });
        }
      }
    });
  }
}
