import mongoose from 'mongoose';
import Client from '../models/clientModel.js';
import User from '../models/userModel.js';
import handleError from '../utils/helpers/handleError.js';

// Obtener todos los Clientes
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find()
            .populate('user', 'name lastName dni')
            .exec();

        if (!clients.length) {
            return res.status(404).json({ error: 'No existen clientes' });
        }

        res.status(200).json({ data: clients, message: "Clientes extraídos con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener un solo Cliente
export const getClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id)
            .populate('user', 'name lastName dni')
            .exec();

        if (!client) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.status(200).json({ data: client, message: "Cliente encontrado" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar un Cliente
export const updateClient = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const { account, accountState } = req.body;

        const client = await Client.findById(id).exec();
        if (!client) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "El cliente no existe");
        }

        const updatedFields = { account, accountState };
        const updatedClient = await Client.findByIdAndUpdate(id, { $set: updatedFields }, { new: true, session }).exec();

        await session.commitTransaction();
        res.status(200).json({ data: updatedClient, message: "Cliente actualizado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al actualizar el cliente");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};
