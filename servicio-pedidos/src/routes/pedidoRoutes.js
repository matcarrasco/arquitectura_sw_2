const express = require('express');
const router = express.Router();
const logisticaService = require('../services/logisticaService');

// POST /api/pedidos — Crear un nuevo pedido
router.post('/', (req, res) => {
    try {
        const nuevoPedido = logisticaService.crearNuevoPedido(req.body);
        
        // SIMULACIÓN ASÍNCRONA
        setTimeout(() => {
            console.log(`[EventBus - Tópico: pedido.creado] Evento publicado asíncronamente para ID: ${nuevoPedido.id_pedido}`);
        }, 150);

        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(400).json({ error: "Error al crear pedido", detalle: error.message });
    }
});

// GET /api/pedidos — Listar todos los pedidos
router.get('/', (req, res) => {
    const todos = logisticaService.obtenerTodos();
    res.json(todos);
});

// GET /api/pedidos/:id/tracking — Monitoreo de un pedido
router.get('/:id/tracking', (req, res) => {
    try {
        const infoTracking = logisticaService.obtenerTracking(req.params.id);
        res.json(infoTracking);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/pedidos/:id/en-ruta — Marcar pedido como EN_RUTA
router.post('/:id/en-ruta', (req, res) => {
    try {
        const resultado = logisticaService.marcarEnRuta(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/pedidos/:id/entregar — Marcar pedido como ENTREGADO
router.post('/:id/entregar', (req, res) => {
    try {
        const resultado = logisticaService.marcarEntregado(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint de integración sincrónica para el servicio de logística
router.post('/:id/forzar-asignacion', (req, res) => {
    const pedido = logisticaService.obtenerTodos().find(p => p.id_pedido === req.params.id);
    if (pedido) {
        pedido.estado_actual = 'ASIGNADO';
        pedido.eventos.push({
            descripcion: `Pedido asignado al repartidor ${req.body.repartidorId}`,
            timestamp: new Date().toISOString()
        });
        return res.json(pedido);
    }
    res.status(404).json({ error: "No encontrado" });
});

module.exports = router;