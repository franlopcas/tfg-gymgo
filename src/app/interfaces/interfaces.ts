export interface Ejercicio{
    _id?: string;
    nombre?: string;
    preparacion?: string;
    ejecucion?: string;
    recomendacion?: string;
    cover?: string;
    tipo?: string;
    usuario?: Usuario;
}

export interface Usuario {
    _id?: string;
    nombre?: string;
    email?: string;
    password?: string;
    avatar?: string;
    favoritos?: Ejercicio[];
    rol?: string;
}

export interface Rutina{
    _id?: string;
    nombre?: string;
    ejercicios?: Ejercicio[];
}

export interface Tabla{
    _id?: string;
    nombre?: string;
    ejercicios?: Ejercicio[];
    usuario?: Usuario;
}
