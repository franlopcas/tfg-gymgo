import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor(private alertController: AlertController,
              private toastController: ToastController) { }

  async alertaInformativa(message: string){
    const alert = await this.alertController.create({
      message,
      buttons: ['ok']
    });
    await alert.present();
  }

  async presentToast(message: string){
    const toast = await this.toastController.create({
      message, position: 'bottom', duration: 1500, color: "secondary"
    });

    toast.present();
  }

  async recomendacion(message: string){
    const toast = await this.toastController.create({
      message, position: 'top', duration: 5000, color: "success"
    });

    toast.present();
  }
}
