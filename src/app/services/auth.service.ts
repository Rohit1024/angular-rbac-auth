import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  User,
  sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = authState(this.auth);
  constructor(
    private auth: Auth,
  ) {}

  register(email: string, password: string): Observable<UserCredential> {
      const userCredentialPromise = createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      ).then(userCredential => {
        this.sendMail(userCredential.user);
        return userCredential;
      });
      return from(userCredentialPromise);
    }


  login(email: string, password: string):Observable<UserCredential> {
    const userCredentialPromise = signInWithEmailAndPassword(this.auth, email, password);
    return from(userCredentialPromise);
  }

  //TODO:Google Auth
  AuthLogin() {
    return 
  }

  async sendMail(user: User) {
    await sendEmailVerification(user);
    
  }

  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  // email varification
  sendEmailForVarification() {
    return this.currentUser.subscribe(user => {
      if(user) {
        if(!user.emailVerified) return from(sendEmailVerification(user));
        else return of(Error("Already email verified"));
      } else return of(Error("User not Exist"));
    })
  }

  logout(): Observable<any> {
    return from(this.auth.signOut());
  }
}
