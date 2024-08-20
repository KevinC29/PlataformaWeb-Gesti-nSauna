import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
// import router from './routes/roleRoutes.js';
// import router from './routes/sectionRoutes.js';
// import router from './routes/itemTypeRoutes.js';
import router from './routes/index.js';
//permite manejar las rutas
import path from 'path';

// const roleRoutes = require('./routes/roleRoutes.js');
// const errorHandler = require('./utils/errorHandler');

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/1.0', router);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Url no encontrada' });
});

// app.use('/api/itemType', router);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
