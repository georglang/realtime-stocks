import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockListComponent } from './stock-list/stock-list.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';

const appRoutes = [
  { path: '', component: StockListComponent },
  {
    path: 'stock-details/:id', component: StockDetailsComponent
  },
  { path: 'watchlist', component: WatchlistComponent },
  // * wildcard if the requested URL doesn´t match any path in the URL
  // could also be a 404 page
  { path: '**', component: StockListComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
