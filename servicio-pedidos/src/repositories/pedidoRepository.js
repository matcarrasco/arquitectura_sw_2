class PedidoRepository {
    constructor() {
        this.pedidos = []; 
    }

    save(pedido) { this.pedidos.push(pedido); return pedido; }
    findById(id) { return this.pedidos.find(p => p.id_pedido === id); }
    findAll() { return this.pedidos; }
}

module.exports = new PedidoRepository();