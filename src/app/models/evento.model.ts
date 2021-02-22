import { environment } from "src/environments/environment";
const baseUrl = environment.base_url;

export class Evento {
    constructor(
        public descripcion: string,
        public lat: string,
        public lng: string,
        public tipo: any,
        public subtipo?: any,
        public _id?: string,
        public img?: string,
        public activo?: string,
        public createdAt?: string,
        public updatedAt?: string
    ) {}

}