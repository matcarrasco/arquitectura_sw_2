class Repartidor {
    constructor(id, capacidadMax) {
        this.id_repartidor = id;
        this.capacidad_maxima = capacidadMax;
        this.carga_actual = 0;
    }

    puedeCargar(peso) {
        return (this.carga_actual + peso) <= this.capacidad_maxima;
    }

    asignarCarga(peso) {
        this.carga_actual += peso;
    }
}

module.exports = Repartidor;