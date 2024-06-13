// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

// URL de conexión de MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aht0imc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Nombre de la base de datos
const dbName = process.env.DB_NAME;

// Crear un cliente de MongoDB
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

// Función para conectar a la base de datos
async function connectDB() {
  try {
    // Conectar al servidor de MongoDB
    await client.connect();
    console.log('Conexión establecida correctamente');

    // Seleccionar la base de datos
    const database = client.db(dbName);

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  } finally {
    // Cerrar la conexión al finalizar
    await client.close();
    console.log('Conexión cerrada correctamente');
  }
}


export default connectDB;