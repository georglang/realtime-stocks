import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { HeaderComponent } from './header/header.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';

// Angular Material
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatMenuModule,
  MatToolbarModule,
  MatTabsModule,
  MatTableModule,
  MatDialogModule
} from '@angular/material';

const appRoutes = [
  { path: '', component: StockListComponent },
  {
    path: 'stock-details/:id', component: StockDetailsComponent
  },
  { path: 'watchlist', component: WatchlistComponent },
  // * wildcard if the requested URL doesn´t match any path in the URL
  // could also be a 404 page
  // { path: '**', component: StockListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    StockListComponent,
    HeaderComponent,
    StockDetailsComponent,
    WatchlistComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
