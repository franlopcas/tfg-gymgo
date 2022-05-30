import { Component, OnInit, Input, AfterViewInit, 
  ChangeDetectorRef, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NavController, AlertController, Gesture, 
  GestureController, IonItem, IonCard } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio, Rutina } from '../../interfaces/interfaces';
import { RutinasService } from '../../services/rutinas.service';
import { UiServiceService } from '../../services/ui-service.service';
import { EjerciciosService } from 'src/app/services/ejercicios.service';
import { ModalController } from '@ionic/angular';
import { ExerciseComponent } from '../../components/exercise/exercise.component';

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage implements AfterViewInit {

  id: any;
  //@Input() ejercicios: Ejercicio = {};
  ejercicios: any;
  rutina: Rutina = {};
  listaEjercicios: any[] = []; // Contendrá una copia de la lista de ejercicios completa
  rutinaEjercicios: any[] = []; // Contendrá la lista de ejercicios en la rutina
  ejerciciosBuscar: any;
  contentScrollActive = true; // Si es false no deja hacer scroll
  gestureArray: Gesture[] = [];

  @ViewChild('dropZoneRoutine') dropRoutine: ElementRef;
  //@ViewChild('dropZoneExercise') dropExercise: ElementRef;

  //@ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>;
  @ViewChildren(IonItem, {read: ElementRef}) items: QueryList<ElementRef>;
  // Usamos IonCard porque es el componente que usamos en toda la app para 
  // los ejercicios

  myArray = Array.from(Array(30).keys());

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
    this.getEjercicios();
    this.updateRoutine();
  }

  async getRutina(){
    this.rutina = await this.rutinaService.getRutina(this.id);
  }

  async getEjercicios(){
    this.ejercicios = await this.ejerciciosService.getEjercicios();
    for(let ejercicio of this.ejercicios){
      this.listaEjercicios.push(ejercicio);
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
        this.uiService.presentToast("No se pudo agregar el ejercicio");
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

  async cancelar() {
    const alert = await this.alertCtrl.create({
      message: `¿Desea cancelar ${this.rutina.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            const confirm = await this.rutinaService.elimiarRutina(this.rutina);
            if(confirm){
              this.uiService.presentToast("Rutina cancelada");
              this.navCtrl.navigateRoot('/main/admin/admin1', {animated: true});
              //this.back();
            }else{
              this.uiService.presentToast("Error al cancelar");
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

  async crear(){
    const alert = await this.alertCtrl.create({
      message: `¿Desea crear ${this.rutina.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            this.navCtrl.navigateRoot(`/routine/${this.id}`);
            this.uiService.presentToast("Rutina creada");
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

  async eliminar(ejercicio: Ejercicio) {

    const alert = await this.alertCtrl.create({
      message: `¿Desea eliminar ${ejercicio.nombre}?`,
      mode: "ios",
      buttons: [
        {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: async () => {
            //let indice = this.rutinaEjercicios.indexOf("ejercicio._id");
            let indice = -1;
            let count = -1;
            //console.log("Soy indice", indice);
            for(let i of this.rutinaEjercicios){
              //console.log(i);
              count++;
              if(i._id === ejercicio._id){
                indice = i;
                break;
              }
            }
            //console.log("Contador", count);
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

/** 
  updateGestures(){
    this.gestureArray.map(gesture => gesture.destroy());
    this.gestureArray = [];

    const arr = this.cards.toArray();

    for(let i = 0; i < arr.length; i++){
      const oneCard = arr[i];

      const drag = this.gestureCtrl.create({
        el: oneCard.nativeElement,
        threshold: 1, // Límite un elemento por iteración
        gestureName: 'drag',
        onStart: ev =>{
          oneCard.nativeElement.style.transition = '';
          oneCard.nativeElement.style.opacity = '0.8';
          oneCard.nativeElement.style.fontWeight = 'bold';
          this.contentScrollActive = false;
          this.changeDetectorRef.detectChanges();
        },
        onMove: ev =>{
          oneCard.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
          oneCard.nativeElement.style.zIndex = 11;
          this.checkDropzone(ev.currentX, ev.currentY);
        },
        onEnd: ev =>{
          this.contentScrollActive = true;
          this.handleDrop(oneCard, ev.currentX, ev.currentY, i);
        }
      });

      drag.enable();
      this.gestureArray.push(drag);
    }

    this.cards.changes.subscribe(res =>{
      //Está atento a los cambios
      if(this.gestureArray.length != this.cards.length){
        this.updateGestures();
      }
    });
  }
*/
/** 
updateExercises(){  // Maneja cards
  this.gestureArray.map(gesture => gesture.destroy());
  this.gestureArray = [];

  const arr = this.cards.toArray();

  for(let i = 0; i < arr.length; i++){
    const oneCard = arr[i];

    const drag = this.gestureCtrl.create({
      el: oneCard.nativeElement,
      threshold: 1, // Límite un elemento por iteración
      gestureName: 'drag',
      onStart: ev =>{
        oneCard.nativeElement.style.transition = '';
        oneCard.nativeElement.style.opacity = '0.8';
        oneCard.nativeElement.style.fontWeight = 'bold';
        //this.contentScrollActive = false;
        this.changeDetectorRef.detectChanges();
      },
      onMove: ev =>{
        oneCard.nativeElement.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
        oneCard.nativeElement.style.zIndex = 11;
        this.chequearZona(ev.currentX, ev.currentY);
      },
      onEnd: ev =>{
        this.contentScrollActive = true;
        this.dejarCaerEjercicio(oneCard, ev.currentX, ev.currentY, i);
      }
    });

    drag.enable();
    this.gestureArray.push(drag);
  }

  this.cards.changes.subscribe(res =>{
    //Está atento a los cambios
    if(this.gestureArray.length != this.cards.length){
      this.updateExercises();
    }
  });
}
*/

/** 
dejarCaerEjercicio(card, endX, endY, index){
  //const dropRoutine = this.dropRoutine.nativeElement.getBoundingClientRect();
  const dropExercise = this.dropExercise.nativeElement.getBoundingClientRect();

  if(this.isInZone(endX, endY, dropExercise)){

    const removedCard = this.rutinaEjercicios.splice(index, 1);
    this.listaEjercicios.push(removedCard[0]);
    card.nativeElement.remove();
  }else{

    card.nativeElement.style.transition = '.2s ease.out';
    card.nativeElement.style.zIndex = 'inherit';
    card.nativeElement.style.transform = `translate(0,0)`;
    card.nativeElement.style.opacity = '1';
    card.nativeElement.style.fontWeight = 'normal';
  }

  //this.dropRoutine.nativeElement.style.backgroundColor= 'white';
  this.dropExercise.nativeElement.style.backgroundColor= 'white';
  this.changeDetectorRef.detectChanges();
}
*/

/**
// EL MIO
  checkDropzone(x, y){
    const dropRoutine = this.dropRoutine.nativeElement.getBoundingClientRect();
    //const dropExercise = this.dropExercise.nativeElement.getBoundingClientRect();

    if(this.isInZone(x, y, dropRoutine)){
      this.dropRoutine.nativeElement.style.backgroundColor='green';
    }else{
      this.dropRoutine.nativeElement.style.backgroundColor='white';
    }

    if(this.isInZone(x, y, dropExercise)){
      this.dropExercise.nativeElement.style.backgroundColor='gray';
    }else{
      this.dropExercise.nativeElement.style.backgroundColor='white';
    }
  }
*/

  /**
// EL MIO
  handleDrop(card, endX, endY, index){
    const dropRoutine = this.dropRoutine.nativeElement.getBoundingClientRect();
    //const dropExercise = this.dropExercise.nativeElement.getBoundingClientRect();

    if(this.isInZone(endX, endY, dropRoutine)){

      const removedCard = this.listaEjercicios.splice(index, 1);
      this.rutinaEjercicios.push(removedCard[0]);
      card.nativeElement.remove();
    }else if(this.isInZone(endX, endY, dropExercise)){
 
      const removedCard = this.rutinaEjercicios.splice(index, 1);
      this.listaEjercicios.push(removedCard[0]);
      card.nativeElement.remove();
    }else{

      card.nativeElement.style.transition = '.2s ease.out';
      card.nativeElement.style.zIndex = 'inherit';
      card.nativeElement.style.transform = `translate(0,0)`;
      card.nativeElement.style.opacity = '1';
      card.nativeElement.style.fontWeight = 'normal';
    }
    this.dropRoutine.nativeElement.style.backgroundColor= 'white';
    //this.dropExercise.nativeElement.style.backgroundColor= 'white';
    this.changeDetectorRef.detectChanges();
  }
  */

}
