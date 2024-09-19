import mongoose from 'mongoose';
import Client from '../models/clientModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateClientData } from '../validators/clientValidate.js';

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    let session;
    try {

        const validationResult = validateClientData(req.body);

        if (!validationResult.isValid) {
            return res.status(400).json({ error: validationResult.message });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const { user } = req.body;

        if (!await User.exists({ _id: user })) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El usuario ingresado no existe');
        }

        if (await Client.exists({ user })) {
            return handleError(res, null, session, 409, 'El usuario ya tiene una cuenta de cliente registrada');
          }

        const newClient = new Client({ user });

        await newClient.save({ session });

        // await saveAuditEntry({
        //     eventType: 'CREATE',
        //     documentId: newClient._id,
        //     documentCollection: 'Client',
        //     userId: req.currentUser,
        //     changes: generateChanges(null, newClient.toObject(), true)
        // });

        await session.commitTransaction();
        res.status(201).json({ data: newClient, message: 'Cliente creado con éxito' });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, 'Error al crear el cliente');
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

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

// Obtener un solo Cliente por id de usuario
export const getClientByAuthenticatedUser = async (req, res) => {
    try {
        const userId = req.currentUser._id;
        const client = await Client.findOne({ user: userId });

        if (!client) {
            return res.status(404).json({ error: "Cuenta de Cliente no encontrada" });
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

        const validationResult = validateClientData(req.body);

        if (!validationResult.isValid) {
            return res.status(400).json({ error: validationResult.message });
        }

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

        // await saveAuditEntry({
        //     eventType: 'UPDATE',
        //     documentId: id,
        //     documentCollection: 'Client',
        //     userId: req.currentUser,
        //     changes: generateChanges(client.toObject(), updatedClient.toObject())
        // });

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

// Eliminar un Cliente
export const deleteClient = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;

        const client = await Client.findById(id).exec();
        if (!client) {
            return handleError(res, null, session, 404, 'Cliente no encontrado');
        }

        if (await Order.exists({ client: id })) {
            await session.abortTransaction();
            return res.status(409).json({ error: "Existen ordenes asociados a este cliente" });
        }

        await Client.findByIdAndDelete(id, { session }).exec();

        // await saveAuditEntry({
        //     eventType: 'DELETE',
        //     documentId: id,
        //     documentCollection: 'Client',
        //     userId: req.currentUser,
        //     changes: generateChanges(client.toObject(), null)
        //   });

        await session.commitTransaction();
        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, 'Error al eliminar el cliente');
    } finally {
        if (session) {
            session.endSession();
        }
    }
};