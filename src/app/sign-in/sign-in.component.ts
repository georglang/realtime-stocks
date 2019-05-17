import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service/auth.service';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/IUser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe((user: IUser) => {
      console.log('User', user);
      this.router.navigate(['./watchlist']);
    })
  }

}
