class PedidoRepository {
    constructor() {
        this.pedidos = []; 
        this.repartidores = []; // Nueva lista
    }

    save(pedido) { this.pedidos.push(pedido); return pedido; }
    findById(id) { return this.pedidos.find(p => p.id_pedido === id); }
    
    // Métodos para Repartidores
    saveRepartidor(rep) { this.repartidores.push(rep); return rep; }
    findAllRepartidores() { return this.repartidores; }
    findAll() {
    return this.pedidos;
}
}


module.exports = new PedidoRepository();