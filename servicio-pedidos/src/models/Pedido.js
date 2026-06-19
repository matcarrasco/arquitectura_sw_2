// Definimos los estados posibles según el E1
const Estados = {
    CREADO: 'CREADO',
    VALIDADO: 'VALIDADO',
    ASIGNADO: 'ASIGNADO',
    EN_RUTA: 'EN_RUTA',
    ENTREGADO: 'ENTREGADO'
};

class Pedido {
    constructor(id, canal, peso, destino) {
        this.id_pedido = id; 
        this.canal_origen = canal;
        this.peso_volumen = peso;
        this.datos_destino = destino;
        this.estado_actual = Estados.CREADO; 
        this.eventos = [];
    }

    // Validacion minima que pide en regla de negocion
    validar() {
        if (this.peso_volumen > 0 && this.datos_destino) {
            this.estado_actual = Estados.VALIDADO;
            return true;
        }
        return false;
    }
}

module.exports = { Pedido, Estados };
