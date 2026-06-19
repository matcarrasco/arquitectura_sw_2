const Repartidor = require('../models/Repartidor');

class RepartidorRepository {
    constructor() {
    
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
