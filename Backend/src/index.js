import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// const userRoutes = require('./routes/userRoutes');
// const errorHandler = require('./utils/errorHandler');

dotenv.config();

const app = express();
connectDB();

// app.use(express.json());

// app.use('/api/users', userRoutes);

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
