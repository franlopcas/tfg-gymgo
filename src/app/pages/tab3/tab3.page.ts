import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

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
