import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  private returnUrl: string;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

}
