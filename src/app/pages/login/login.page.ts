import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;
  token: string;
  userEmail: string;
  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      nickName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    if(localStorage.getItem('token')) {
      this.router.navigateByUrl('/chat', { replaceUrl: true });
    }
  }
  async signUp() {
    const loading = await this.loadingController.create();
    await  loading.present();

    await this.chatService.signUp(this.credentialForm.value).then( user => {
      loading.dismiss();
      this.router.navigateByUrl('/chat', { replaceUrl: true });
      }, async err => {
      loading.dismiss();
      this.alertService.showAlert('Sign Up failed', err);
    });
  }
  async signIn() {
    const loading = await this.loadingController.create();
    await  loading.present();

    await this.chatService.signIn(this.credentialForm.value)
      .then( res => {
          res.user.getIdToken().then(result => localStorage.setItem('token', result))
          .then(() => {
            this.router.navigateByUrl('/chat', { replaceUrl: true });
          })
        loading.dismiss();
        }, async err => {
      loading.dismiss();
      this.alertService.showAlert(':(', err);
    });
  }

  get email() {
    return this.credentialForm.get('email');
  }
  get password() {
    return this.credentialForm.get('password');
  }

}
