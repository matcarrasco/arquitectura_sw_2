const express = require('express');
const router = express.Router();
const logisticaService = require('../services/logisticaService');

// POST /api/pedidos — Crear un nuevo pedido
router.post('/', (req, res) => {
    try {
        const nuevoPedido = logisticaService.crearNuevoPedido(req.body);
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

// POST /api/pedidos/asignar — Asignar pedido a repartidor
router.post('/asignar', (req, res) => {
    try {
        const resultado = logisticaService.asignarPedido(req.body.idPedido);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

module.exports = router;