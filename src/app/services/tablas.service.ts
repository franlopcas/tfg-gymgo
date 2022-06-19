import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Tabla, Ejercicio } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TablasService {

  token: string = null;
  private tabla: Tabla = {};
  private ejercicios: any;

  constructor(private http: HttpClient,
              private storage: Storage) {this.initDB();}

  async initDB(){
    this.storage = await this.storage.create();
    this.cargarToken();
  }

  async cargarToken(){
    this.token = await this.storage.get('token') || null;
  }

  crearTabla(nombre: string, usuario: string): Promise<Tabla>{
    const data = {nombre, usuario}; // nombre de la tabla e id del usuario
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.post(`${URL}/tabla/new`, data, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(resp['tablaDB']);
        }else{
          resolve(null);
        }
      });
    });
  }

  async getTablas(usuario: any): Promise<Tabla>{
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.get(`${URL}/tabla?_id=${usuario}`, {headers}).subscribe(resp=>{
        if(resp['ok']){
          this.tabla = resp['tablas'];
          resolve(this.tabla);
        }else{
          resolve(null);
        }
      });
    });
  }

  async getTabla(id: any): Promise<Tabla>{
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.get(`${URL}/tabla/ver/?_id=${id}`, {headers}).subscribe(resp=>{
        if(resp['ok']){
          this.tabla = resp['tablaDB'];
          resolve(this.tabla);
        }else{
          resolve(null);
        }
      });
    });
  }

  async listaEjercicios(id: string): Promise<Ejercicio>{
    return new Promise(resolve=>{
      this.http.get(`${URL}/tabla/ejercicios/?_id=${id}`).subscribe(resp=>{
        if(resp['ok']){
          this.ejercicios = resp['ejercicios'];
          resolve(this.ejercicios);
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
      this.http.post(`${URL}/tabla/agregar-ejercicio`, data, {headers}).subscribe(resp=>{
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
      this.http.post(`${URL}/tabla/eliminar-ejercicio`, data, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  elimiarTabla(tabla: Tabla){
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.post(`${URL}/tabla/delete`,tabla, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }
}
