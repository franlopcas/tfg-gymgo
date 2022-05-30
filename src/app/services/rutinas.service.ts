import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Storage } from '@ionic/storage';
import { Rutina, Ejercicio } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RutinasService {

  token: string = null;
  private rutina: Rutina = {};
  private ejercicios: any;

  constructor(private http: HttpClient,
              private storage: Storage,
              private usuarioService: UsuarioService) {this.initDB(); }

  async initDB(){
    this.storage = await this.storage.create();
    this.cargarToken();
  }

  async cargarToken(){
    this.token = await this.storage.get('token') || null;
  }

  crearRutina(rutina: Rutina): Promise<Rutina>{
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.post(`${URL}/rutina/new`,rutina,{headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(resp['rutinaDB']);
        }else{
          resolve(null);
        }
      });
    });
  }

  async getRutinas(): Promise<Rutina>{
    return new Promise(resolve=>{
      this.http.get(`${URL}/rutina/`).subscribe(resp=>{
        if(resp['ok']){
          this.rutina = resp['rutinas'];
          //console.log("Rutinas: ", this.rutina);
          resolve(this.rutina);
        }else{
          resolve(null);
        }
      });
    });
  }

  async getRutina(id: any): Promise<Rutina>{
    return new Promise(resolve=>{
      this.http.get(`${URL}/rutina/ver/?_id=${id}`).subscribe(resp=>{
        if(resp['ok']){
          this.rutina = resp['rutinaDB'];
          resolve(this.rutina);
        }else{
          resolve(null);
        }
      });
    });
  }

  agregarEjercicio(_id: string, id: string){
    // Envía _id de rutina e id del ejercicio a agregar
    const data = {_id, id};
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.post(`${URL}/rutina/agregar-ejercicio`, data, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  eliminarEjercicio(_id: string, id: string){
    // Envía _id de rutina e id del ejercicio a eliminar
    const data = {_id, id};
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.post(`${URL}/rutina/eliminar-ejercicio`, data, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  elimiarRutina(rutina: Rutina){
    return new Promise(resolve=>{
      this.http.post(`${URL}/rutina/delete`,rutina).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  async listaEjercicios(id: string): Promise<Ejercicio>{
    return new Promise(resolve=>{
      this.http.get(`${URL}/rutina/ejercicios/?_id=${id}`).subscribe(resp=>{
        if(resp['ok']){
          this.ejercicios = resp['ejercicios'];
          resolve(this.ejercicios);
        }else{
          resolve(null);
        }
      });
    });
  }

}
