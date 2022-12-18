import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  user$ = this.usersService.currentUserProfile$;
  constructor(
    private authService: AuthService,
    public usersService: UsersService,
    private router: Router,
  ) {}
  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  navigateToLogin(){
    this.router.navigate(['/auth/login']);
  }
}
