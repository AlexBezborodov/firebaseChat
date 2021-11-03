import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;
  token: string;
  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  async signUp() {
    const loading = await this.loadingController.create();
    await  loading.present();

    await this.chatService.signUp(this.credentialForm.value).then( user => {
      loading.dismiss();
      this.router.navigateByUrl('/chat', { replaceUrl: true });
      }, async err => {
      loading.dismiss();
      const alert = await  this.alertController.create({
        header: 'Sign Up failed',
        message: err.message,
        buttons: ['OK']
      });

      await  alert.present();
    });
  }
  async signIn() {
    const loading = await this.loadingController.create();
    await  loading.present();

    this.chatService.signIn(this.credentialForm.value)
      .then( res => {
        res.user.getIdToken().then(result => localStorage.setItem('token', result));
        loading.dismiss();
        this.router.navigateByUrl('/chat', { replaceUrl: true });
        }, async err => {
      loading.dismiss();
      const alert = await  this.alertController.create({
        header: ':(',
        message: err.message,
        buttons: ['OK']
      });

      await  alert.present();
    });
  }

  get email() {
    return this.credentialForm.get('email');
  }
  get password() {
    return this.credentialForm.get('password');
  }

}
