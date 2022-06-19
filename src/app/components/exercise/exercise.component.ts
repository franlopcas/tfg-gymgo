import { Component, Input, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { Usuario, Ejercicio } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {

  usuario: Usuario = {};
  ejercicio: Ejercicio = {};
  favoritos: any;
  fav: boolean;
  @Input() id: any;
  cover: string = '';
  rol: string = '';
  estrella = 'heart-outline';

  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private ejercicioService: EjerciciosService,
              private uiService: UiServiceService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getUsuario();
    this.getEjercicio();
    this.getFavoritos();
  }

  getUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async getEjercicio(){
    this.ejercicio = await this.ejercicioService.getEjercicio(this.id);
    this.cover = this.ejercicioService.verCover(this.ejercicio.cover);
  }

  async getFavoritos(){
    this.favoritos = await this.usuarioService.listaFavoritos();
    this.esFavorito();
  }

  esFavorito(){
    this.fav = this.favoritos.includes(this.ejercicio._id);
    if(this.fav){
      this.estrella = 'heart';
    }else{
      this.estrella = 'heart-outline';
    }
  }

  async back(){
    this.modalCtrl.dismiss();
  }

  async editar(){
      this.navCtrl.navigateRoot(`/edit-exercise/${this.id}`, {animated: true});
      this.modalCtrl.dismiss();
  }

  async eliminar() {
    const alert = await this.alertCtrl.create({
      message: `¿Desea eliminar ${this.ejercicio.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            const confirm = await this.ejercicioService.eliminarEjercicio(this.ejercicio);
            if(confirm){
              this.uiService.presentToast("Ejercicio eliminado");
              this.back();
            }else{
              this.uiService.presentToast("Error al eliminar");
            }
          }
        }, 
        {
          text: 'Cancelar',
          role: 'cancel',
          id: 'cancel-button',
          handler: () => {
            console.log("Cancelado");
          }
        }
      ]
    });

    await alert.present();
  }

  async favorito(){
    
    if(this.fav){
      this.fav = false;
      const confirm = await this.usuarioService.eliminarFavorito(this.ejercicio);
      if(confirm){
        this.uiService.presentToast("Eliminado de favoritos");
        this.estrella = 'heart-outline';
      }
    }else{
      this.fav = true;
      const confirm = await this.usuarioService.agregarFavorito(this.ejercicio);
      if(confirm){
        this.uiService.presentToast("Añadido a favoritos");
        this.estrella = 'heart';
      }
    }
  }

}
