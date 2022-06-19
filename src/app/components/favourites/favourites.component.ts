import { Component, OnInit} from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { ModalController } from '@ionic/angular';
import { ExerciseComponent } from '../exercise/exercise.component';
@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit{

  favoritos: any;
  exercise: any;
  ejercicios: any[] = [];

  constructor(private usuarioService: UsuarioService,
              private ejerciciosService: EjerciciosService,
              private modalCtrl: ModalController) { }


  ngOnInit(){
    this.cargarFavoritos();
  }

  async cargarFavoritos(){
    this.ejercicios = [];
    this.favoritos = await this.usuarioService.listaFavoritos();
    for(let id of this.favoritos){
      this.exercise = await this.ejerciciosService.getEjercicioId(id);
      if(this.exercise != null){
        this.ejercicios.push(this.exercise);
      }
    }
  }


  cargar(event){
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
