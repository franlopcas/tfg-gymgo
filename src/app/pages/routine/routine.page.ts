import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario, Rutina } from '../../interfaces/interfaces';
import { RutinasService } from '../../services/rutinas.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.page.html',
  styleUrls: ['./routine.page.scss'],
})
export class RoutinePage implements OnInit {

  usuario: Usuario = {};
  rutina: Rutina = {};
  id: any;
  rol: string = '';
  ejercicios: any[] = [];
  ejercicio: any;
  exercise: any;

  constructor(private navCtrl: NavController,
              private usuarioService: UsuarioService,
              private ejercicioService: EjerciciosService,
              private rutinaService: RutinasService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private uiService: UiServiceService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("_id");
    this.getUsuario();
    this.getRutina();
    this.cargarEjercicios();
  }

  getUsuario(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
  }

  async getRutina(){
    this.rutina = await this.rutinaService.getRutina(this.id);
    //console.log(this.rutina);
  }

  async cargarEjercicios(){
    this.ejercicios = [];
    this.ejercicio = await this.rutinaService.listaEjercicios(this.id);
    //console.log("Lista de ids", this.ejercicio);
    for(let id of this.ejercicio){
      this.exercise = await this.ejercicioService.getEjercicioId(id);
      if(this.exercise != null){
        this.ejercicios.push(this.exercise);
      }
      //this.ejercicios.push(await this.ejercicioService.getEjercicioId(id));
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
      message: `¿Desea eliminar ${this.rutina.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            const confirm = await this.rutinaService.elimiarRutina(this.rutina);
            if(confirm){
              this.uiService.presentToast("Rutina eliminada");
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
      this.navCtrl.navigateRoot('/main/tabs/tab2', {animated: true});
    }
  }

}
