import { Component, OnInit } from '@angular/core';
import { AlphavantageService } from '../services/alphavantage-service';
import { SearchResult, ISearchResult } from '../interfaces/SearchResult';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.sass']
})
export class StockListComponent implements OnInit {
  public searchResult: SearchResult[];
  public formatedSearchResult: ISearchResult[] = [];
  public displayedColumns = ['name', 'symbol', 'region', 'currency', 'details'];
  public dataSource: MatTableDataSource<ISearchResult>;
  constructor(private alphavantageService: AlphavantageService, private router: Router) { }

  ngOnInit() {
  }

  // search stock by name or WKN
  private searchStock(symbol: string) {
    debugger;

    this.alphavantageService.GetSearch(symbol).subscribe((data: any) => {
      this.searchResult = data.bestMatches;

      this.searchResult.forEach(element => {
        const newElement = {
          name: element['2. name'],
          symbol: element['1. symbol'],
          region: element['4. region'],
          currency: element['8. currency'],
        }

        this.formatedSearchResult.push(newElement);



      });
      console.log('Result', this.formatedSearchResult);
      this.dataSource = new MatTableDataSource<ISearchResult>(this.formatedSearchResult);
    });

  }

  public onClickSearchButton(value) {
    debugger;

    this.searchStock(value);
  }

  public navigateToStockDetails(row) {
    this.router.navigate(['./stock-details/' + row.symbol]);
  }

}
