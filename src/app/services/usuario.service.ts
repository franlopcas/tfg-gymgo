import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';

import { NavController } from '@ionic/angular';
import { Usuario, Ejercicio } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  token: string = null;
  private usuario: Usuario = {};
  private favoritos: any;


  constructor(private http: HttpClient, 
              private storage: Storage,
              private navCtrl: NavController){this.initDB(); }

  async initDB(){
    this.storage = await this.storage.create();
  }

  getUsuario(){
    if(!this.usuario._id){
      this.validaToken();
    }
    return {...this.usuario};
  }

  login(email: string, password: string){
    const data = {email, password};

    return new Promise(resolve =>{
      this.http.post(`${URL}/user/login`,data)
          .subscribe(async resp=>{
        if(resp['ok']){
          await this.guardarToken(resp['token']);
          resolve(true);
        }else{
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  registro(usuario: Usuario){
    return new Promise(resolve =>{
      this.http.post(`${URL}/user/create`,usuario)
                .subscribe(async resp =>{
                  console.log(resp);
                  if(resp['ok']){
                    await this.guardarToken(resp['token']);
                    resolve(true);
                  }else{
                    this.token = null;
                    this.storage.clear();
                    resolve(false);
                  }
                });
    });
  }

  actualizarUsuario(usuario: Usuario){
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve =>{
      this.http.post(`${URL}/user/update`, usuario, {headers}).subscribe(resp=>{
        if(resp['ok']){
          this.guardarToken(resp['token']);
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  async guardarToken(token: string){
    this.token = token;
    await this.storage.set('token',token);

    await this.validaToken();
  }

  async cargarToken(){
    this.token = await this.storage.get('token') || null;
  }

  async validaToken(): Promise<boolean>{
    await this.cargarToken();
    if(!this.token){
      console.log("No existe token");
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean> (resolve =>{
      const headers = new HttpHeaders({
        'x-token' : this.token
      });
      this.http.get(`${URL}/user/`, {headers})
            .subscribe(resp=>{
        if(resp['ok']){
          this.usuario = resp['usuario'];
          resolve(true);
        }else{
          console.log("No se encuentra el usuario");
          this.navCtrl.navigateRoot('/login');
        }
      });
    });
  }

  logout(){
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', {animated: true});
  }

  async comprobarRol(): Promise<boolean>{
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return new Promise(resolve=>{
      this.http.get(`${URL}/user/rol`,{headers}).subscribe(resp=>{
        if(resp['rol']=== 'admin'){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  agregarFavorito(ejercicio: Ejercicio){
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    
    return new Promise(resolve=>{
      this.http.post(`${URL}/user/agregar-favorito`, ejercicio, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  eliminarFavorito(ejercicio: Ejercicio){
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return new Promise(resolve=>{
      this.http.post(`${URL}/user/eliminar-favorito`, ejercicio, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  async listaFavoritos(): Promise<Ejercicio>{
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return new Promise(resolve=>{
      this.http.get(`${URL}/user/favoritos`, {headers}).subscribe(resp=>{
        if(resp['ok']){
          this.favoritos = resp['favoritos'];
          resolve(this.favoritos);
        }else{
          resolve(null);
        }
      });
    });
  }
/** 
  async listaFavoritos(): Promise<string[]>{
    const headers = new HttpHeaders({
      'x-token': this.token
    });
    return new Promise(resolve=>{
      this.http.get(`${URL}/user/favoritos`, {headers}).subscribe(resp=>{
        if(resp['ok']){
          this.favoritos = resp['favoritos'];
          resolve(this.favoritos);
        }else{
          resolve(null);
        }
      });
    });
  }
  */


}
