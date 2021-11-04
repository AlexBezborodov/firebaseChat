import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
  ) { }

  async showAlert(header: string, err) {
    const alert = await  this.alertController.create({
      header: header,
      message: err.message,
      buttons: ['OK']
    });
    await  alert.present();
  }

}
