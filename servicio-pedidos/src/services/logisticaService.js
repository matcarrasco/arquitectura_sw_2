const { Pedido, Estados } = require('../models/Pedido');
const pedidoRepository = require('../repositories/pedidoRepository');

class LogisticaService {
    crearNuevoPedido(datos) {
        const nuevoPedido = new Pedido(datos.id, datos.canal, datos.peso, datos.destino);

        if (!nuevoPedido.validar()) {
            throw new Error("El pedido no cumple con los datos mínimos para ser VALIDADO");
        }

        nuevoPedido.eventos.push({
            descripcion: "Pedido validado e ingresado al sistema logístico",
            timestamp: new Date().toISOString()
        });

        return pedidoRepository.save(nuevoPedido);
    }

    obtenerTracking(id) {
        const pedido = pedidoRepository.findById(id);
        if (!pedido) throw new Error("Pedido no encontrado");

        return {
            id: pedido.id_pedido,
            estado: pedido.estado_actual,
            eventos: pedido.eventos,
            peso: pedido.peso_volumen, 
            ubicacion: "Coordenadas GPS capturadas"
        };
    }

    obtenerTodos() {
        return pedidoRepository.findAll();
    }

    marcarEnRuta(pedidoId) {
        const pedido = pedidoRepository.findById(pedidoId);
        if (!pedido) throw new Error("Pedido no encontrado");

        if (pedido.estado_actual !== Estados.ASIGNADO) {
            throw new Error(`El pedido debe estar ASIGNADO para pasar a EN_RUTA. Estado actual: ${pedido.estado_actual}`);
        }

        pedido.estado_actual = Estados.EN_RUTA;
        pedido.eventos.push({
            descripcion: "El repartidor ha salido con el pedido. En camino al destino.",
            timestamp: new Date().toISOString()
        });

        return pedido;
    }

    marcarEntregado(pedidoId) {
        const pedido = pedidoRepository.findById(pedidoId);
        if (!pedido) throw new Error("Pedido no encontrado");

        if (pedido.estado_actual !== Estados.EN_RUTA) {
            throw new Error(`El pedido debe estar EN_RUTA para ser marcado como ENTREGADO. Estado actual: ${pedido.estado_actual}`);
        }

        pedido.estado_actual = Estados.ENTREGADO;
        pedido.eventos.push({
            descripcion: "Pedido entregado exitosamente en destino.",
            timestamp: new Date().toISOString()
        });

        return pedido;
    }
}

module.exports = new LogisticaService();