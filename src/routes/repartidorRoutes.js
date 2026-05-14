const express = require('express');
const router = express.Router();
const logisticaService = require('../services/logisticaService');

// POST /api/repartidores — Registrar un nuevo repartidor
router.post('/', (req, res) => {
    try {
        const { id, capacidad } = req.body;
        if (!id || !capacidad) {
            return res.status(400).json({ error: "Se requiere id y capacidad para registrar un repartidor" });
        }
        const rep = logisticaService.registrarRepartidor({ id, capacidad });
        res.status(201).json(rep);
    } catch (error) {
        res.status(400).json({ error: "Error al registrar repartidor", detalle: error.message });
    }
});

// GET /api/repartidores — Listar todos los repartidores
router.get('/', (req, res) => {
    const repartidores = logisticaService.obtenerRepartidores();
    res.json(repartidores);
});

module.exports = router;