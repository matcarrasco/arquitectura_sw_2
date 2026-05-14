const { Pedido, Estados } = require('../models/Pedido');
const pedidoRepository = require('../repositories/pedidoRepository');
const Repartidor = require('../models/Repartidor');

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
            ubicacion: "Coordenadas GPS capturadas"
        };
    }

    obtenerTodos() {
        return pedidoRepository.findAll();
    }

    registrarRepartidor(datos) {
        const nuevoRep = new Repartidor(datos.id, datos.capacidad);
        return pedidoRepository.saveRepartidor(nuevoRep);
    }

    obtenerRepartidores() {
        return pedidoRepository.findAllRepartidores();
    }

    asignarPedido(pedidoId) {
        const pedido = pedidoRepository.findById(pedidoId);
        if (!pedido) throw new Error("Pedido no encontrado");

        if (pedido.estado_actual !== Estados.VALIDADO) {
            throw new Error(`El pedido está en estado ${pedido.estado_actual} y no puede ser asignado`);
        }

        const repartidores = pedidoRepository.findAllRepartidores();
        const disponible = repartidores.find(r => r.puedeCargar(pedido.peso_volumen));

        if (!disponible) {
            throw new Error("No hay repartidores con capacidad suficiente");
        }

        disponible.asignarCarga(pedido.peso_volumen);
        pedido.estado_actual = Estados.ASIGNADO;
        pedido.eventos.push({
            descripcion: `Pedido asignado al repartidor ${disponible.id_repartidor}`,
            timestamp: new Date().toISOString()
        });

        return { pedido, repartidor: disponible.id_repartidor };
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

        // Liberar la carga del repartidor al entregar
        const repartidores = pedidoRepository.findAllRepartidores();
        const repartidor = repartidores.find(r =>
            pedido.eventos.some(e => e.descripcion.includes(r.id_repartidor))
        );
        if (repartidor) {
            repartidor.carga_actual = Math.max(0, repartidor.carga_actual - pedido.peso_volumen);
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