import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmDeleteDialogComponent } from '../confirm-delete/confirm-delete-dialog.component';
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
    private router: Router,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getStocksInWatchlist();
    this.getStocksLimitReached();
  }

  public getStocksInWatchlist() {
    this.watchlistService.getWatchlist()
      .then((stocks: IStockInWatchlist[]) => {
        this.stocksInWatchlist = stocks;
        this.dataSource = new MatTableDataSource(this.stocksInWatchlist);
        this.dataSource.sort = this.sort;
      });
  }

  public getStocksLimitReached() {
    this.firestoreService.getLimitReachedCollection()
      .then((stocks: any) => {
        this.stocksLimitReached = stocks;
        this.dataSourceLimitReached = new MatTableDataSource(this.stocksLimitReached);
      });
  }

  public deleteStockInWatchlistCollection(stockId) {
    // this.openDeleteRecordDialog(recordId);
    this.firestoreService.deleteStockInWatchlistCollection(stockId)
      .then(() => {

      })
  }

  public deleteStockInLimitReachedCollection(id: string, symbol: string) {
    this.firestoreService.deleteStockInLimitReachedCollection(id)
      .then((data) => {
        if (this.stocksLimitReached.length > 0) {
          debugger;
          const stocksLimitReached = this.stocksLimitReached.filter(stock => stock.symbol !== symbol);
          this.dataSourceLimitReached = new MatTableDataSource(stocksLimitReached);
        }
      });
  }

  public openDeleteRecordDialog(stockId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: 'Löschen'
    };
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.firestoreService.deleteStockInWatchlist().then(data => {
        //   // load records after deletion
        //   this.getRecords(this.paramId);
        //   // delete record in indexedDB orders table
        //   this.indexDbService.deleteRecordInOrdersTable(this.paramId, _recordId).then(() => {
        //     this.messageService.recordDeletedSuccessful();
        //   });
        // });
      }
    });
  }

}
