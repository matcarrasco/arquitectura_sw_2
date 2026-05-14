const express = require('express');
const router = express.Router();
const logisticaService = require('../services/logisticaService');

// Caso de uso Gestion de pedidos
router.post('/', (req, res) => {
    try {
        // Recibimos los datos del JSON (req.body)
        const nuevoPedido = logisticaService.crearNuevoPedido(req.body);
        
        // Se responde con el pedido creado y el estatus 201
        res.status(201).json(nuevoPedido);
    } catch (error) {
        // Manejo de errores de negocio
        res.status(400).json({ 
            error: "Error al crear pedido", 
            detalle: error.message 
        });
    }
});
router.get('/', (req, res) => {
    const todos = logisticaService.obtenerTodos(); 
    res.json(todos);
});

// Caso de uso de monitoreo
router.get('/:id/tracking', (req, res) => {
    try {
        const infoTracking = logisticaService.obtenerTracking(req.params.id);
        res.json(infoTracking);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
// Aca se registra al repartidor
router.post('/repartidores', (req, res) => {
    const rep = logisticaService.registrarRepartidor(req.body);
    res.status(201).json(rep);
});

// Se asigna el pedido
router.post('/asignar', (req, res) => {
    try {
        const resultado = logisticaService.asignarPedido(req.body.idPedido);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;