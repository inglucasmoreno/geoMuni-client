export class Evento {
    constructor(
        public descripcion: string,
        public lat: string,
        public lng: string,
        public tipo: any,
        public _id?: string,
        public fotoUrl?: string,
        public activo?: string,
        public createdAt?: string,
        public updatedAt?: string
    ) {}
}