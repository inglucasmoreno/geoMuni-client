export class Evento {
    constructor(
        public descripcion: string,
        public lat: string,
        public lng: string,
        public tipo: any,
        public fotoUrl?: string,
        public activo?: string
    ) {}
}