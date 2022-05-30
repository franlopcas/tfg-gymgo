import { Component, Input, OnInit } from '@angular/core';
import { Ejercicio } from 'src/app/interfaces/interfaces';
import { EjerciciosService } from '../../services/ejercicios.service';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';
import { ExerciseComponent } from '../exercise/exercise.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {


  @Input() ejercicios: Ejercicio = {};
  usuario: Usuario = {};
  rol: string = '';
  ejercicioBuscar: any;
  buscando = false;
  ideas: string[] = ['Piernas', 'Brazos', 'Pecho', 'Espalda', 'Hombros'];

  constructor(private ejerciciosService: EjerciciosService,
              private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getEjercicios();
    this.getRolUsuario();
  }

  cargar2(){
    setInterval(()=>{
      this.getEjercicios();
    }, 4000);
  }

  cargar(event){
    setTimeout(()=>{
      this.getEjercicios();
      event.target.complete();
    }, 1500);
  }

  getRolUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async getEjercicios(){
    this.ejercicios = await this.ejerciciosService.getEjercicios();
    this.ejercicioBuscar = this.ejercicios;
    //console.log("A ver si nos aclaramos", this.ejercicios[8].nombre);
  }

  buscar(event){
    const text: string = event.detail.value;
    this.ejercicioBuscar = this.ejercicios;

    if(text.length === 0){
      this.buscando = false;
      return ;
    }
    this.buscando = true;
    
    if(text && text.trim() != ''){
      this.ejercicioBuscar = this.ejercicioBuscar.filter((ejercicio: any)=>{
        return (ejercicio.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1) ||
               (ejercicio.tipo.toLowerCase().indexOf(text.toLowerCase()) > -1);
      });
    }

    if (event.cancelable) event.preventDefault();
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
  
  crear(){
    this.navCtrl.navigateRoot('/create-exercise', {animated: true})
  }

}
