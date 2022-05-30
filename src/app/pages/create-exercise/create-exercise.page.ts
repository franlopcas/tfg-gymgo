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
  //tempImages: string[] = [];
  tempImage: string = '';
  usuario: Usuario = {};
  ejercicio: Ejercicio = {};
  tipos: string[] = ['Piernas', 'Brazos', 'Pecho', 'Espalda', 'Hombros'];
  nombre: any;
  cover: string = '';
  rol: string = '';
  //path: string = "";

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
    const rol = await this.usuarioService.comprobarRol();
    if(rol){
      this.navCtrl.navigateRoot('/main/admin/admin2', {animated: true});
    }else{
      this.navCtrl.navigateRoot('/main/tabs/tab3', {animated: true});
    }
  }

  async crearEjercicio(fCrear: NgForm){
    if(fCrear.invalid){
      this.uiService.alertaInformativa('Es obligatorio rellenar todos los campos');
      return;
    }

    const valido = await this.ejercicioService.crearEjercicio(this.registerEjercicio);

    if(valido){
      console.log("Valido",valido);
      // Navegar a tabs
      this.navCtrl.navigateRoot('/main/admin/admin2',{animated: true});
    }else{
      console.log("No valido",valido);
      // Mostrar alerta de usuario y contraseña no correctos
      this.uiService.presentToast('No se pudo crear el ejercicio');
    }
    
  }

  camara(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    
    this.procesarImagen(options);
  
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
     }, (err) => {
      // Handle error
     });
  }

}
