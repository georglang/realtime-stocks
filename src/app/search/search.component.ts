import { Component, OnInit } from '@angular/core';
import { AlphavantageService } from '../services/alphavantage-service';
import { SearchResult, ISearchResult } from '../interfaces/SearchResult';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { WatchlistService } from '../services/watchlist.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit {

  public searchResult: SearchResult[];
  public formatedSearchResult: ISearchResult[] = [];
  public displayedColumns = ['name', 'symbol', 'region', 'currency', 'details'];
  public dataSource: MatTableDataSource<ISearchResult>;
  constructor(
    private alphavantageService: AlphavantageService,
    private watchlistService: WatchlistService,
    private router: Router) { }

  ngOnInit() {}

  // search stock by name or WKN
  private searchStock(symbol: string) {
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
    this.searchStock(value);
  }

  public navigateToStockDetails(row) {
    this.router.navigate(['./stock-details/' + row.symbol, {name: row.name, curr: row.currency}]);
  }
}