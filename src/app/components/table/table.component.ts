import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { Usuario, Tabla } from '../../interfaces/interfaces';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { TablasService } from '../../services/tablas.service';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {


  usuario: Usuario = {};
  tabla: Tabla = {};
  id: any;
  rol: string = '';
  ejercicios: any[] = [];
  ejercicio: any;
  exercise: any;

  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private ejercicioService: EjerciciosService,
              private tablaService: TablasService,
              private alertCtrl: AlertController,
              private uiService: UiServiceService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getUsuario();
    this.getTabla();
    this.cargarEjercicios();
  }

  getUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async getTabla(){
    this.tabla = await this.tablaService.getTabla(this.id);
  }

  async cargarEjercicios(){
    this.ejercicios = [];
    this.ejercicio = await this.tablaService.listaEjercicios(this.id);
    for(let id of this.ejercicio){
      this.exercise = await this.ejercicioService.getEjercicioId(id);
      if(this.exercise != null){
        this.ejercicios.push(this.exercise);
      }
    }
  }

  cargar(event){
    setTimeout(async ()=>{
      this.cargarEjercicios();
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

  async editar(){
    this.navCtrl.navigateRoot(`/edit-table/${this.id}`, {animated: true});
    this.modalCtrl.dismiss();
}

  async eliminar() {
    const alert = await this.alertCtrl.create({
      message: `¿Desea eliminar ${this.tabla.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            const confirm = await this.tablaService.elimiarTabla(this.tabla);
            if(confirm){
              this.uiService.presentToast("Tabla eliminada");
              this.back();
            }else{
              this.uiService.presentToast("Error al eliminar");
            }
          }
        }, 
        {
          text: 'Cancelar',
          role: 'cancel',
          id: 'cancel-button',
          handler: () => {
            console.log("Cancelado");
          }
        }
      ]
    });

    await alert.present();
  }

  async back(){
    this.modalCtrl.dismiss();
  }


}
