import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController, AlertController } from '@ionic/angular';
import { RutinasService } from 'src/app/services/rutinas.service';
import { Rutina } from '../../interfaces/interfaces';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-admin1',
  templateUrl: './admin1.page.html',
  styleUrls: ['./admin1.page.scss'],
})
export class Admin1Page implements OnInit{

  usuario: Usuario = {};
  rutina: Rutina = {};
  rutinas: any;
  nombre: string;
  //private rutinas: Rutina = {};
  //@Input() rutinas: Rutina = {};

  constructor(private usuarioService: UsuarioService,
              private rutinaService: RutinasService,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private uiService: UiServiceService) {}

  ngOnInit(){
    this.usuario = this.usuarioService.getUsuario();
    this.getRutinas();
  }

  async getRutinas(){
    this.rutinas = await this.rutinaService.getRutinas();
  }

  cargar(event){
    setTimeout(()=>{
      this.getRutinas();
      event.target.complete();
    }, 1500);
  }

  async crear(name: any){

    if(name != ""){
      this.rutina.nombre = name;
      this.rutina = await this.rutinaService.crearRutina(this.rutina);
      this.navCtrl.navigateRoot(`/create-routine/${this.rutina._id}`, {animated: true});
    }else{
      this.uiService.presentToast("El nombre es obligatorio");
      this.presentAlertPrompt();
    }
    
  }

  verPerfil(){
    this.navCtrl.navigateRoot('/profile', {animated: true});
  }

  logout(){
    this.usuarioService.logout();
  }

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Inserte el nombre',
      mode: "ios",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Crear',
          handler: data => {
            this.crear(data.name);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

}
