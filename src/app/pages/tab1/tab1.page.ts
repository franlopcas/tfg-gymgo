import { Component, OnInit } from '@angular/core';
import { Usuario, Tabla } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { UiServiceService } from '../../services/ui-service.service';
import { TablasService } from 'src/app/services/tablas.service';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  usuario: Usuario = {};
  tabla: Tabla = {};
  rol: string = '';
  tablas: any;
  nombre: string;

  constructor(private usuarioService: UsuarioService,
              private tablaService: TablasService,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private uiService: UiServiceService,
              private modalCtrl: ModalController) {}

  ngOnInit(){
    this.usuario = this.usuarioService.getUsuario();
    this.rol = this.usuario.rol;
    this.getTablas();
    this.uiService.presentToast("Haga scroll para actualizar");
  }

  async getTablas(){
    this.tablas = await this.tablaService.getTablas(this.usuario._id);
  }


  cargar(event){
    setTimeout(()=>{
      this.getTablas();
      event.target.complete();
    }, 1500);
  }

  async presentAlertPrompt() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Inserte el nombre',
      mode: "ios",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Crear',
          handler: data => {
            this.crear(data.name);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async crear(name: any){
    if(name != ""){
      this.tabla.nombre = name;

      this.tabla = await this.tablaService.crearTabla(this.tabla.nombre, this.usuario._id);
      this.navCtrl.navigateRoot(`/create-table/${this.tabla._id}`, {animated: true});
    }else{
      this.uiService.presentToast("El nombre es obligatorio");
      this.presentAlertPrompt();
    }
    
  }

  async detalle(id: string){
    const modal = await this.modalCtrl.create({
      component: TableComponent,
      componentProps: {
        id
      }
    });
    modal.present();
  }

  verPerfil(){
    this.navCtrl.navigateRoot('/profile', {animated: true});
  }

  logout(){
    this.usuarioService.logout();
  }

}
