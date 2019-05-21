import { Component, OnInit, ViewChild } from '@angular/core';
import { IStockInWatchlist } from '../interfaces/IStockWatchlist';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { WatchlistService } from '../services/watchlist.service';
import { Router } from '@angular/router';
import { ILimitReachedStock } from '../interfaces/ILimitReachedStock';
import { FirestoreService } from '../services/firestore.service/firestore-service.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete/confirm-delete-dialog.component';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns = ['name', 'symbol', 'currency', 'LH', 'LL', 'ULL', 'delete'];
  public displayedColumnsLimitReached = ['symbol', 'price', 'changePercent'];

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

    this.firestoreService.getLimitReachedCollection()
      .then(stocks => {
        this.dataSourceLimitReached = new MatTableDataSource(stocks);
      });
  }

  public getStocksInWatchlist() {
    this.watchlistService.getWatchlist()
      .then((stocks: IStockInWatchlist[]) => {
        this.dataSource = new MatTableDataSource(stocks);
        this.dataSource.sort = this.sort;
      });
  }

  public deleteStock(stockId) {
    // this.openDeleteRecordDialog(recordId);
    this.firestoreService.deleteStockInWatchlist(stockId)
      .then(() => {

      })
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
