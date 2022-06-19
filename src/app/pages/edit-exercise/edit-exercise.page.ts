import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario, Ejercicio } from '../../interfaces/interfaces';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

declare var window: any;

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.page.html',
  styleUrls: ['./edit-exercise.page.scss'],
})
export class EditExercisePage implements OnInit {

  usuario: Usuario = {};
  ejercicio: Ejercicio = {};
  id: any;
  cover: string = '';
  rol: string = '';
  mitipo: string;
  tipos: string[] = ['Piernas', 'Brazos', 'Pecho', 'Espalda', 'Hombros'];
  tempImage: string = '';
  cambiado: boolean = false;

  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private ejercicioService: EjerciciosService,
              private activatedRoute: ActivatedRoute,
              private uiService: UiServiceService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private camera: Camera) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("_id");
    this.getUsuario();
    this.getEjercicio();
    this.mitipo = this.ejercicio.tipo;
    this.cambiado = false;
  }

  getUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async getEjercicio(){
    this.ejercicio = await this.ejercicioService.getEjercicio(this.id);
    this.cover = this.ejercicioService.verCover(this.ejercicio.cover);
    this.tempImage = this.cover;
  }
  async actualizarEjercicio(fActualizar: NgForm){
    const alert = await this.alertCtrl.create({
      message: `¿Desea actualizar ${this.ejercicio.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            if(fActualizar.invalid){
              this.uiService.alertaInformativa('Debe rellenar todos los campos obligatorios');
              return;
            }
  
            const actualizado = await this.ejercicioService.actualizarEjercicio(this.ejercicio, this.cambiado);
        
            if(actualizado){
              this.uiService.alertaInformativa('Ejercicio actualizado');
              this.navCtrl.navigateRoot(`/main/tabs/tab3`, {animated: true});
            }else{
              this.uiService.presentToast('No se pudo actualizar');
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

  async detalle(id: string){
    const modal = await this.modalCtrl.create({
      component: ExerciseComponent,
      componentProps: {
        id
      }
    });
    modal.present();
  }

  back(){
    this.modalCtrl.dismiss();
  }

  libreria(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    
    this.procesarImagen(options);
  }

  procesarImagen(options: CameraOptions){
    this.camera.getPicture(options).then( ( imageData ) => {

      const img = window.Ionic.WebView.convertFileSrc( imageData );
      this.ejercicioService.subirImagen(imageData);
      this.tempImage = img;
      this.cambiado = true;
     }, (err) => {
      // Handle error
     });
  }

  async cancelar() {
    const alert = await this.alertCtrl.create({
      message: `¿Desea cancelar la edición?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
              this.uiService.presentToast("Edición cancelada");
              this.navCtrl.navigateRoot('/main/tabs/tab3', {animated: true});
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

}
