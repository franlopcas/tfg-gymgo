import { Component, OnInit, Input } from '@angular/core';
import { Usuario, Ejercicio } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController} from '@ionic/angular';
import { EjerciciosService } from '../../services/ejercicios.service';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

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
