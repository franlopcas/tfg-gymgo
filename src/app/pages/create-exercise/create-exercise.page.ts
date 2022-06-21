import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { UiServiceService } from '../../services/ui-service.service';
import { NgForm } from '@angular/forms';
import { Usuario, Ejercicio } from '../../interfaces/interfaces';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.page.html',
  styleUrls: ['./create-exercise.page.scss'],
})
export class CreateExercisePage implements OnInit {
  tempImage: string = '';
  existe: boolean = false;
  usuario: Usuario = {};
  ejercicio: Ejercicio = {};
  tipos: string[] = ['Piernas', 'Brazos', 'Pecho', 'Espalda', 'Hombros'];
  nombre: any;
  cover: string = '';
  rol: string = '';

  registerEjercicio = {
    nombre: '',
    preparacion: '',
    ejecucion: '',
    recomendacion: '',
    tipo: ''
  };

  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private ejercicioService: EjerciciosService,
              private uiService: UiServiceService,
              private alertCtrl: AlertController,
              private camera: Camera) { }

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async back(){
    this.tempImage = '';
    this.navCtrl.navigateRoot('/main/tabs/tab3', {animated: true});
  }

  async crearEjercicio(fCrear: NgForm){
    if(!this.existe){
      this.uiService.alertaInformativa('Es obligatorio insertar una cover');
    }
    if(fCrear.invalid){
      this.uiService.alertaInformativa('Debe rellenar todos los campos obligatorios');
      return;
    }

    const valido = await this.ejercicioService.crearEjercicio(this.registerEjercicio);

    if(valido){
      // Navegar a tabs
      this.navCtrl.navigateRoot('/main/tabs/tab3', {animated: true});
    }else{
      // Mostrar alerta de usuario y contraseña no correctos
      this.uiService.presentToast('No se pudo crear el ejercicio');
    }
    
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
      this.existe = true;
     }, (err) => {
      // Handle error
     });
  }

}
