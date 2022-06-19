import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usuario: Usuario = {};
  rol: string = '';

  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private uiService: UiServiceService) { }

  ngOnInit() {
    this.getRolUsuario();
  }

  getRolUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async back(){
    const rol = await this.usuarioService.comprobarRol();
    if(rol){
      this.navCtrl.navigateRoot('/main/tabs/tab2', {animated: true});
    }else{
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
    }
  }

  async actualizar(fActualizar: NgForm){
    if(fActualizar.invalid){return;}

    const actualizado = await this.usuarioService.actualizarUsuario(this.usuario);

    if(actualizado){
      this.uiService.presentToast('Perfil actualizado');
    }else{
      this.uiService.presentToast('No se pudo actualizar');
    }
  }

}
