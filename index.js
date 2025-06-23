const express = require('express');
const { dbConection } = require('./db/config');
const cors = require('cors');
require('dotenv').config();
const authMiddleware = require('./middleware/auth');

//Crear servidor/aplicación de express
const app = express();

// Base de datos
dbConection();

// CORS
app.use(cors())
// Lectura y parseo del body
app.use(express.json());

// Rutas públicas
app.use('/auth', require('./routes/auth'));
// Middleware de autenticación para todas las demás rutas
app.use(authMiddleware);
// Rutas protegidas
app.use('/productos', require('./routes/productos'));
app.use('/categorias', require('./routes/categorias'));
app.use('/ventas', require('./routes/ventas'));
app.use('/compras', require('./routes/compras'));
app.use('/stock', require('./routes/stock'));
app.use('/ubicaciones', require('./routes/ubicacion'));
app.use('/visual-pages', require('./routes/visualPages'));


app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto ', process.env.PORT)
})