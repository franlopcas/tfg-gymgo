import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario, Rutina, Tabla } from '../../interfaces/interfaces';
import { RutinasService } from '../../services/rutinas.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { TablasService } from '../../services/tablas.service';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit {

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
              private activatedRoute: ActivatedRoute,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("_id");
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
    //const id: string = event.detail.value;
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
    const rol = await this.usuarioService.comprobarRol();
    if(rol){
      this.navCtrl.navigateRoot('/main/admin/admin1', {animated: true});
    }else{
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
    }
  }

}
