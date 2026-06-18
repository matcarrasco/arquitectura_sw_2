const Repartidor = require('../models/Repartidor');
const repartidorRepository = require('../repositories/repartidorRepository');
const fetch = require('node-fetch'); 

class LogisticaService {
    
    // 1. Funciones exclusivas de dominio de Repartidores
    registrarRepartidor(datos) {
        const nuevoRep = new Repartidor(datos.id, datos.capacidad);
        return repartidorRepository.saveRepartidor(nuevoRep);
    }

    obtenerRepartidores() {
        return repartidorRepository.findAllRepartidores();
    }

    // 2. Función de Integración (El puente entre los dos mundos)
    async asignarPedido(pedidoId) {
        // A. Le pregunta al servicio central (puerto 3000) por el objeto real y su peso
        const respuesta = await fetch(`http://127.0.0.1:3000/api/pedidos/${pedidoId}/tracking`);
        const infoPedido = await respuesta.json();
        
        if (infoPedido.error) throw new Error("Pedido no encontrado en el sistema central");
        if (infoPedido.estado !== 'VALIDADO') {
            throw new Error(`El pedido está en estado ${infoPedido.estado} y no puede ser asignado`);
        }

        // B. Busca en su propia base de datos local un camión disponible
        const repartidores = repartidorRepository.findAllRepartidores();
        const pesoDelPaquete = Number(infoPedido.peso);
        const disponible = repartidores.find(r => r.puedeCargar(pesoDelPaquete)); 

        if (!disponible) {
            throw new Error("No hay repartidores con capacidad suficiente");
        }

        // C. Altera la carga del repartidor de forma local
        disponible.asignarCarga(pesoDelPaquete);

        // D. Notifica de vuelta al servicio de pedidos para que actualice SU máquina de estados
        await fetch(`http://127.0.0.1:3000/api/pedidos/${pedidoId}/forzar-asignacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repartidorId: disponible.id_repartidor })
        });

        return { msg: "Asignado con éxito", repartidor: disponible.id_repartidor };
    }
}

module.exports = new LogisticaService();