import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { NgForm} from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', {static: false}) slides: IonSlides;
  
  avatarSlide = {
    slidesPerView: 3.5
  };

  loginUser = {
    email: 'hinotama92@gmail.com',
    password: '123'
  };

  registerUser = {
    email: 'test@gmail.com',
    password: '123456',
    nombre: 'Test',
    avatar: 'av-1.png'
  };

  constructor(private usuarioService: UsuarioService, 
              private navCtrl: NavController,
              private uiService: UiServiceService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.slides.lockSwipes(true);
  }

  async login(fLogin: NgForm){

    if(fLogin.invalid){
      this.uiService.alertaInformativa('Email y/o contraseña no son correctos');
      return;
    }
    
    const valido = await this.usuarioService.login(this.loginUser.email, this.loginUser.password);
    if(valido){
      // Navega a tabs
      const rol = await this.usuarioService.comprobarRol();
      if(rol){
        this.navCtrl.navigateRoot('/main/tabs/tab2', {animated: true});
      }else{
        this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
      }
    }else{
      this.uiService.alertaInformativa('Email y/o contraseña no son correctos');
    }
  }

  async registro(fRegistro: NgForm){
    if(fRegistro.invalid){
      this.uiService.alertaInformativa('Es obligatorio rellenar todos los campos');
      return;
    }

    const valido = await this.usuarioService.registro(this.registerUser);

    if(valido){
      // Navegar a tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1',{animated: true});
    }else{
      // Mostrar alerta de usuario y contraseña no correctos
      this.uiService.alertaInformativa('El correo electrónico ya existe');
    }
    
  }

  mostrarRegistro(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

  mostrarLogin(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

}
