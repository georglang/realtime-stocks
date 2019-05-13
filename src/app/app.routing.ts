import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { SearchComponent } from './search/search.component';

const appRoutes = [

  {path: '', redirectTo: 'watchlist', pathMatch: 'full'},
  {
    path: 'stock-details/:id', component: StockDetailsComponent
  },
  {
    path: 'search', component: SearchComponent
  },
  {
    path: 'watchlist', component: WatchlistComponent
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
