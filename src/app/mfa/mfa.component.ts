import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RecaptchaVerifier, signInWithPhoneNumber, Auth, ConfirmationResult, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MfaComponent implements OnInit {
  @Input() phoneNumber: string = '';
  @Output() verificationSuccess: EventEmitter<void> = new EventEmitter();
  @Output() verificationFailed: EventEmitter<any> = new EventEmitter();

  appVerifier: any;
  verificationCode: string = '';
  verificationId: string = '';
  codeSent: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.initializeRecaptcha();
  }

  initializeRecaptcha() {
    const auth: Auth = this.firebaseService.getAuthInstance();
    this.appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: (response: string) => {
        console.log('reCAPTCHA completed:', response);
      }
    });
  }

  async sendVerificationCode() {
    const auth: Auth = this.firebaseService.getAuthInstance();
    try {
      const confirmationResult: ConfirmationResult = await signInWithPhoneNumber(auth, this.phoneNumber, this.appVerifier);
      console.log('Verification code sent');
      this.verificationId = confirmationResult.verificationId;
      this.codeSent = true;
    } catch (error) {
      console.error('Failed to send code:', error);
      this.verificationFailed.emit(error);
    }
  }

  async verifyCode(code: string) {
    const auth: Auth = this.firebaseService.getAuthInstance();
    try {
      if (!this.verificationId || !code) {
        console.error('Verification ID or code is missing');
        return;
      }

      const credential = PhoneAuthProvider.credential(this.verificationId, code);
      await signInWithCredential(auth, credential);
      console.log('Phone number verified successfully');
      this.verificationSuccess.emit();  // Emit success after the code is successfully verified
    } catch (error) {
      console.error('Failed to verify the code:', error);
      this.verificationFailed.emit(error);
    }
  }
}
