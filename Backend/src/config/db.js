import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.log(err);
        console.log('MongoDB disconnected');
    }
};

export default connectDB;