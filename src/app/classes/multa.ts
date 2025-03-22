export class Multa {
    //Esta es la estructura de los datos, en base a los requerimientos suplidos
    constructor(
        public id?: number,
        public marbete?: string,
        public marca?: string,
        public modelo?: string,
        public color?: string,
        public anio?: number,
        public placa?: string,
        public tipoInfraccion?: string,
        public ubicacion?: string,
        public fechaHora?: string,
        public descripcion?: string,
        public imagen?: string,
        public audio?: string
    ) {}
}
