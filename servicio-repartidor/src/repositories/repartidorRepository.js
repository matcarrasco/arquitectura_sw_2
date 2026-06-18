const Repartidor = require('../models/Repartidor');

class RepartidorRepository {
    constructor() {
        // Inyectamos el repartidor usando tu clase real para mantener la pureza orientada a objetos
        this.repartidores = [
            new Repartidor("REP-EXPRESS", 20)
        ]; 
    }

    saveRepartidor(rep) { 
        this.repartidores.push(rep); 
        return rep; 
    }
    
    findAllRepartidores() { 
        return this.repartidores; 
    }
}

module.exports = new RepartidorRepository();