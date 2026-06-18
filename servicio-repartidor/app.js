const express = require('express');
const cors = require('cors');


const repartidorRoutes = require('./src/routes/repartidorRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/repartidores', repartidorRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Repartidor base listo para operaciones.`);
    console.log(`Servicio de Repartidores corriendo en http://localhost:${PORT}`);
});