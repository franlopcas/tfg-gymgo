import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, Injectable } from '@angular/core';
import { AlertController, Gesture, GestureController, IonItem, NavController, ModalController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { EjerciciosService } from '../../services/ejercicios.service';
import { RutinasService } from '../../services/rutinas.service';
import { ActivatedRoute } from '@angular/router';
import { Usuario, Rutina, Ejercicio } from '../../interfaces/interfaces';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

@Component({
  selector: 'app-edit-routine',
  templateUrl: './edit-routine.page.html',
  styleUrls: ['./edit-routine.page.scss'],
})
export class EditRoutinePage implements AfterViewInit {

  id: any;
  listaIds: any;
  ejercicios: any;
  comprobar: boolean;
  exercise: any;
  ejerciciosBuscar: any;
  rutina: Rutina = {};
  listaEjercicios: any[] = []; // Contendrá una copia de la lista de ejercicios completa
  rutinaEjercicios: any[] = []; // Contendrá la lista de ejercicios en la rutina
  contentScrollActive = true; // Si es false no deja hacer scroll
  gestureArray: Gesture[] = [];

  @ViewChild('dropZoneRoutine') dropRoutine: ElementRef;
  @ViewChildren(IonItem, {read: ElementRef}) items: QueryList<ElementRef>;

  constructor(private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private rutinaService: RutinasService,
    private ejerciciosService: EjerciciosService,
    private alertCtrl: AlertController,
    private uiService: UiServiceService,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private gestureCtrl: GestureController,
    private changeDetectorRef: ChangeDetectorRef) { }

    ngAfterViewInit() {
      this.id = this.activatedRoute.snapshot.paramMap.get("_id");
      this.uiService.recomendacion("Se recomienda entre 6 y 8 ejercicios por entrenamiento");
      this.getRutina();
      this.updateRoutine();
    }
  
    async getRutina(){
      this.rutina = await this.rutinaService.getRutina(this.id);
      this.ejercicios = await this.ejerciciosService.getEjercicios();
      this.listaIds = await this.rutinaService.listaEjercicios(this.id);

      this.rutinaEjercicios = [];
      this.listaEjercicios = [];

      for(let id of this.listaIds){
        this.exercise = await this.ejerciciosService.getEjercicioId(id);
        if(this.exercise != null){
          this.rutinaEjercicios.push(this.exercise);
        }
        //this.rutinaEjercicios.push(await this.ejerciciosService.getEjercicioId(id));
      }

      for(let ejercicio of this.ejercicios){
        this.comprobar = this.listaIds.includes(ejercicio._id);
        if(!this.comprobar){
          this.listaEjercicios.push(ejercicio);
        }
      }
      this.ejerciciosBuscar = this.listaEjercicios;

    }

    buscar(event){
      const text: string = event.detail.value;
      this.ejerciciosBuscar = this.listaEjercicios;
      if(text && text.trim() != ''){
        this.ejerciciosBuscar = this.ejerciciosBuscar.filter((ejercicio: any)=>{
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

    updateRoutine(){
      this.gestureArray.map(gesture => gesture.destroy());
      this.gestureArray = [];
    
      const arr = this.items.toArray();
    
      for(let i = 0; i < arr.length; i++){
        const oneItem = arr[i];
    
        const drag = this.gestureCtrl.create({
          el: oneItem.nativeElement,
          threshold: 1, // Límite un elemento por iteración
          gestureName: 'drag',
          onStart: ev =>{
            oneItem.nativeElement.style.transition = '';
            oneItem.nativeElement.style.opacity = '0.8';
            oneItem.nativeElement.style.fontWeight = 'bold';
            this.contentScrollActive = false;
            this.changeDetectorRef.detectChanges();
          },
          onMove: ev =>{
            oneItem.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
            oneItem.nativeElement.style.zIndex = 11;
            this.chequearZona(ev.currentX, ev.currentY);
          },
          onEnd: ev =>{
            this.contentScrollActive = true;
            this.dejarCaerRutina(oneItem, ev.currentX, ev.currentY, i);
            console.log("A ver que mierda es one Item", oneItem);
          }
        });
    
        drag.enable();
        this.gestureArray.push(drag);
      }
    
      this.items.changes.subscribe(res =>{
        //Está atento a los cambios
        if(this.gestureArray.length != this.items.length){
          this.updateRoutine();
        }
      });
    }

    chequearZona(x, y){
      const dropRoutine = this.dropRoutine.nativeElement.getBoundingClientRect();
    
      if(this.isInZone(x, y, dropRoutine)){
        this.dropRoutine.nativeElement.style.backgroundColor='#3DC2FF';
      }else{
        this.dropRoutine.nativeElement.style.backgroundColor='white';
      }
    }

    isInZone(x, y, dropzone){
      if(x < dropzone.left || x >= dropzone.right){
        return false;
      }
      if(y < dropzone.top || y >= dropzone.bottom){
        return false;
      }
      return true;
    }

    dejarCaerRutina(item, endX, endY, index){
      const dropRoutine = this.dropRoutine.nativeElement.getBoundingClientRect();
    
      if(this.isInZone(endX, endY, dropRoutine)){
    
        const removedItem = this.ejerciciosBuscar.splice(index, 1);

        //console.log("Id de la Rutina: ", this.id, "y su nombre es: ", this.rutina.nombre);
        //console.log("Id del Ejercicio: ", removedItem[0]._id);
        this.rutinaEjercicios.push(removedItem[0]);
        const confirm = this.rutinaService.agregarEjercicio(this.id,removedItem[0]._id);
        if(confirm){
          this.uiService.presentToast("Ejercicio agregado");
        }else{
          this.uiService.presentToast("No se pudo agregar");
        }
        item.nativeElement.remove();
      }else{
        item.nativeElement.style.transition = '.2s ease.out';
        item.nativeElement.style.zIndex = 'inherit';
        item.nativeElement.style.transform = `translate(0,0)`;
        item.nativeElement.style.opacity = '1';
        item.nativeElement.style.fontWeight = 'normal';
      }
      this.dropRoutine.nativeElement.style.backgroundColor= 'white';
      this.changeDetectorRef.detectChanges();
    }

    async actualizar(){
      const alert = await this.alertCtrl.create({
        message: `¿Desea actualizar ${this.rutina.nombre}?`,
        mode: "ios",
        buttons: [
          {
            text: 'Confirmar',
            id: 'confirm-button',
            handler: async () => {
              this.navCtrl.navigateRoot(`/routine/${this.id}`);
              this.uiService.presentToast("Rutina actualizada");
              this.uiService.recomendacion("Scroll para actualizar");
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

    async cancelar() {
      const alert = await this.alertCtrl.create({
        message: `¿Desea cancelar la edición?`,
        mode: "ios",
        buttons: [
          {
            text: 'Confirmar',
            id: 'confirm-button',
            handler: async () => {
                this.navCtrl.navigateRoot('/main/admin/admin1', {animated: true});
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

    async eliminar(ejercicio: Ejercicio) {

      const alert = await this.alertCtrl.create({
        message: `¿Desea eliminar ${ejercicio.nombre}?`,
        mode: "ios",
        buttons: [
          {
            text: 'Confirmar',
            id: 'confirm-button',
            handler: async () => {
              let indice = -1;
              let count = -1;
              for(let i of this.rutinaEjercicios){
                count++;
                if(i._id === ejercicio._id){
                  indice = i;
                  break;
                }
              }
              const confirm = this.rutinaService.eliminarEjercicio(this.id,ejercicio._id);
              if(confirm){
                this.uiService.presentToast("Ejercicio eliminado");
                if(!this.ejerciciosBuscar.includes(indice)){
                  this.ejerciciosBuscar.push(indice);
                }
                this.rutinaEjercicios.splice(count,1);
                this.changeDetectorRef.detectChanges();
                this.updateRoutine();
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

}
