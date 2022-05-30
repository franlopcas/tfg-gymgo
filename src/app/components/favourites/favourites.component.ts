import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { Usuario, Ejercicio } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { ExerciseComponent } from '../exercise/exercise.component';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit{

  //usuario: Usuario = {};
  //ejercicio: Ejercicio = {};
  //@Input() ejercicios: Ejercicio = {};
  favoritos: any;
  exercise: any;
  //fav: any;
  //favoritoTipo: any[] = [];
  ejercicios: any[] = [];
  //tipos: string[] = ['Piernas', 'Brazos', 'Pecho', 'Espalda', 'Hombros'];

  constructor(private usuarioService: UsuarioService,
              private ejerciciosService: EjerciciosService,
              private modalCtrl: ModalController) { }


  ngOnInit(){
    //this.usuario = this.usuarioService.getUsuario();
    //this.cargarFavoritos();
    this.cargarFavoritos();
  }


/** 
  async ionViewWillEnter() {
    this.usuario = this.usuarioService.getUsuario();
    this.favoritos = await this.usuarioService.listaFavoritos();
    for(let i of this.favoritos){
      this.fav = await this.ejerciciosService.getEjercicioId(i);
      this.favoritoTipo.push(this.fav);
    }
  }
  */
/** 
  async verEjercicio(id: string){
    return this.ejercicio = await this.ejerciciosService.getEjercicioId(id);
  }
  */

  async cargarFavoritos(){
    this.ejercicios = [];
    this.favoritos = await this.usuarioService.listaFavoritos();
    //this.favoritos = this.ejercicios;
    for(let id of this.favoritos){
      //this.fav = this.verEjercicio(i);
      //this.fav = await this.ejerciciosService.getEjercicioId(i);
      this.exercise = await this.ejerciciosService.getEjercicioId(id);
      if(this.exercise != null){
        this.ejercicios.push(this.exercise);
      }

      //console.log(this.favoritoTipo);
    }
  }


  cargar(event){
    //const id: string = event.detail.value;
    setTimeout(async ()=>{
      this.cargarFavoritos();
      event.target.complete();
    }, 1000);
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


}
