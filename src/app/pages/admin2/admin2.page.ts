import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-admin2',
  templateUrl: './admin2.page.html',
  styleUrls: ['./admin2.page.scss'],
})
export class Admin2Page implements OnInit {

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
