import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/index.js';
import configureMiddlewares from './middleware/middlewares.js';


dotenv.config();

const app = express();

// Middleware
configureMiddlewares(app);

app.use('/api/1.0', router);

app.use((req, res) => {
    res.status(404).json({ error: 'Url no encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectDB();
