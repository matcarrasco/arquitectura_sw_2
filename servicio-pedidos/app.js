const express = require('express');
const cors = require('cors'); // Agregado por seguridad para las llamadas del frontend
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Sirve tu frontend (index.html) y la carpeta public
app.use(express.static(__dirname));
app.use(express.static('public'));

// Registro exclusivo de Rutas de Pedidos
const pedidoRoutes = require('./src/routes/pedidoRoutes');
app.use('/api/pedidos', pedidoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servicio de Pedidos (Bodega Central) corriendo en http://localhost:${PORT}`);
});