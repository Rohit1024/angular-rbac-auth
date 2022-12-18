import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit{
  loggedInUserEmail: string | null | undefined;
  SendVerificationMail() {
    this.authService.sendEmailForVarification();
  }

  constructor(public authService: AuthService, public router: Router, private toast: HotToastService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => this.loggedInUserEmail = user?.email)
  }

  navigate() {
    this.router.navigate(['/auth/login']);
  }
}
