import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from './core/core.module';

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


// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { HeaderComponent } from './header/header.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { MessagingService } from './services/messaging-service/messaging.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '../environments/environment';
import { RouterModule, CanActivate } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './auth.guard';
import { SearchComponent } from './search/search.component';
import { ToastrModule } from 'ngx-toastr';
import { AddToWatchlistComponent } from './add-to-watchlist/add-to-watchlist.component';
import { AuthService } from './core/auth-service/auth.service';
import { ConfirmDeleteDialogComponent } from './confirm-delete/confirm-delete-dialog.component';


const appRoutes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: 'add-to-watchlist/:id', component: AddToWatchlistComponent, canActivate: [AuthGuard] },
  {
    path: 'search', component: SearchComponent, canActivate: [AuthGuard]
  },
  {
    path: 'stocklist', component: StockListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'stock-details/:id', component: StockDetailsComponent
  },
  { path: '', component: WatchlistComponent, canActivate: [AuthGuard] },
  // { path: 'watchlist', component: WatchlistComponent },

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
    WatchlistComponent,
    SignInComponent,
    SearchComponent,
    AddToWatchlistComponent,
    ConfirmDeleteDialogComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    //AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    RouterModule.forRoot(appRoutes),
    AngularFireMessagingModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    MessagingService,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
