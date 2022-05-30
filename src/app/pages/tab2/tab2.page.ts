import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController } from '@ionic/angular';
import { RutinasService } from 'src/app/services/rutinas.service';
import { Rutina } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  usuario: Usuario = {};
  rutinas: any;
  //private rutinas: Rutina = {};
  //@Input() rutinas: Rutina = {};

  constructor(private usuarioService: UsuarioService,
              private rutinaService: RutinasService,
              private navCtrl: NavController) {}

  ngOnInit(){
    this.usuario = this.usuarioService.getUsuario();
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

  verPerfil(){
    this.navCtrl.navigateRoot('/profile', {animated: true});
  }

  logout(){
    this.usuarioService.logout();
  }

}
