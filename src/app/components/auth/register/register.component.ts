import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/user.service';
import Validation from 'src/app/shared/Validation';
import { switchMap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  passwordHide = true;
  confirmPasswordHide = true;

  registerForm = this.fb.group(
    {
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: Validation.match('password', 'confirmPassword'),
    }
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    private toast: HotToastService,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {}

  public handleErrorRegister = (controlName: string, errorName: string) => {
    return (
      this.registerForm.get(controlName)?.touched &&
      this.registerForm.get(controlName)?.errors &&
      this.registerForm.get(controlName)?.hasError(errorName)
    );
  };

  submit() {
    const { displayName, email, password } = this.registerForm.value;

    if (!this.registerForm.valid || !displayName || !password || !email) {
      return;
    }
    this.authService
      .register(email, password)
      .pipe(
        switchMap(( { user: { uid } }) =>
          this.usersService.addUser({
            uid,
            email,
            displayName: displayName,
            role: ["user"],
          })
        ),
        this.toast.observe({
          success: 'Congrats! You are all Registered.',
          loading: 'Signing up...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/auth/verify-email']);
      });
  }
}
