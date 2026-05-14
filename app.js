const express = require('express');
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Registro de Rutas
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const repartidorRoutes = require('./src/routes/repartidorRoutes');

app.use('/api/pedidos', pedidoRoutes);
app.use('/api/repartidores', repartidorRoutes);

app.use(express.static('public'));

const PORT = 3000;

// Carga de datos de prueba iniciales
const logisticaService = require('./src/services/logisticaService');

try {
    // Repartidor base del sistema
    logisticaService.registrarRepartidor({ id: "REP-EXPRESS", capacidad: 20 });
    console.log("Repartidor base listo para operaciones.");
} catch (e) {
    console.error("ERROR:", e.message);
}

app.listen(PORT, () => {
    console.log(`Servicio corriendo en http://localhost:${PORT}`);
});