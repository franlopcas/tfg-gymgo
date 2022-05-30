import { Injectable, OnInit } from '@angular/core';
import { Ejercicio, Usuario } from '../interfaces/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class EjerciciosService{

  private ejercicio: Ejercicio = {};
  token: string = null;

  constructor(private http: HttpClient, 
              private storage: Storage,
              private usuarioService: UsuarioService,
              private fileTransfer: FileTransfer) {this.initDB();}

  async initDB(){
     this.storage = await this.storage.create();
     this.cargarToken();
     }

  async cargarToken(){
      this.token = await this.storage.get('token') || null;
    }

  crearEjercicio(ejercicio: Ejercicio){
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve=>{
      this.http.post(`${URL}/ejercicio/new`, ejercicio, {headers}).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  async getEjercicios(): Promise<Ejercicio>{
    return new Promise(resolve=>{
      this.http.get(`${URL}/ejercicio/`).subscribe(resp=>{
        if(resp['ok']){
          this.ejercicio = resp['ejercicios'];
          //console.log("Pa loca tu:",this.ejercicio);
          resolve(this.ejercicio);
          //console.log(this.ejercicio[36].nombre);
        }else{
          resolve(null);
        }
      });
    });
  }
  
//localhost:3000/ejercicio/ver/?nombre=Ejercicio 11
  async getEjercicio(id: any): Promise<Ejercicio>{
    //    this.http.get<Ejercicio>(`${URL}/ejercicio/ver/?nombre=${nombre}`);
    return new Promise(resolve=>{
      this.http.get(`${URL}/ejercicio/ver/?_id=${id}`).subscribe(resp=>{
        //console.log(resp['ok']);
        if(resp['ok']){
          this.ejercicio = resp['ejercicioDB'];
          //console.log("Get ejercicio: ",this.ejercicio);
          resolve(this.ejercicio);
        }else{
          resolve(null);
        }
      });
    });
  }

  async getEjercicioId(id: string): Promise<Ejercicio>{
    return new Promise(resolve=>{
      this.http.get(`${URL}/ejercicio/ver-ejercicio/?_id=${id}`).subscribe(resp=>{
        if(resp['ok']){
          this.ejercicio = resp['ejercicioDB'];
          resolve(this.ejercicio);
        }else{
          resolve(null);
        }
      });
    });
  }

  actualizarEjercicio(ejercicio: Ejercicio, cover: boolean){
    const headers = new HttpHeaders({'x-token': this.token});
    return new Promise(resolve =>{
      if(cover){
        this.http.post(`${URL}/ejercicio/update-cover`, ejercicio, {headers}).subscribe(resp=>{
          if(resp['ok']){
            resolve(true);
          }else{
            resolve(false);
          }
        });
      }else{
        this.http.post(`${URL}/ejercicio/update`, ejercicio, {headers}).subscribe(resp=>{
          if(resp['ok']){
            resolve(true);
          }else{
            resolve(false);
          }
        });       
      }

    });
  }

  eliminarEjercicio(ejercicio: Ejercicio){
    return new Promise(resolve=>{
      // localhost:3000/ejercicio/delete/?nombre=Ejercicio 11
      this.http.post(`${URL}/ejercicio/delete`,ejercicio).subscribe(resp=>{
        if(resp['ok']){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }

  verCover(cover: string): string{
    return `${URL}/ejercicio/cover/${cover}`;
  }

  subirImagen(img: string){
    const options: FileUploadOptions = {
      fileKey: 'image',
      headers: {
        'x-token': this.usuarioService.token
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload(img, `${URL}/ejercicio/upload-cover`, options).then(data=>{
      console.log("DATA de subir imagen",data);
      }).catch(err=>{
        console.log('Error de carga', err);
      });
  }
}
