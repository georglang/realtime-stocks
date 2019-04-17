import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public logout() {
    this.authService.signOut();
  }

  public login() {
    this.authService.signInWithGoogle();
  }

}
