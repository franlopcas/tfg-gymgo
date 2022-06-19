import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { RutinasService } from 'src/app/services/rutinas.service';
import { Rutina } from '../../interfaces/interfaces';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { RoutineComponent } from '../../components/routine/routine.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  usuario: Usuario = {};
  rol: string = '';
  rutinas: any;
  rutina: Rutina = {};

  constructor(private usuarioService: UsuarioService,
              private rutinaService: RutinasService,
              private navCtrl: NavController,
              private uiService: UiServiceService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {}

  ngOnInit(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
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

  async detalle(id: string){
    const modal = await this.modalCtrl.create({
      component: RoutineComponent,
      componentProps: {
        id
      }
    });
    modal.present();
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

  verPerfil(){
    this.navCtrl.navigateRoot('/profile', {animated: true});
  }

  logout(){
    this.usuarioService.logout();
  }

}
