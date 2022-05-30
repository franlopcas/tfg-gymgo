import { Component} from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage{

  usuario: Usuario = {};

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController) {}

  ngOnInit(){
    this.usuario = this.usuarioService.getUsuario();
  }

  verPerfil(){
    this.navCtrl.navigateRoot('/profile', {animated: true});
  }

  logout(){
    this.usuarioService.logout();
  }
  
}
