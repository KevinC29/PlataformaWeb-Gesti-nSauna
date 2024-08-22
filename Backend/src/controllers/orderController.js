import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import DetailOrder from '../models/detailOrderModel.js';
import Client from '../models/clientModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';

// Crear una nueva Orden
export const createOrder = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { dateOrder, numberOrder, consumptionAccount, balance, total, paymentState, client } = req.body;

        if (!await Client.exists({ _id: client })) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El cliente ingresado no existe');
        }

        if (await Order.exists({ numberOrder })) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El numero de orden ya existe');
          }

        const newOrder = new Order({ dateOrder, numberOrder, consumptionAccount, balance, total, paymentState, client });
        await newOrder.save({ session });

        // await saveAuditEntry({
        //     eventType: 'CREATE',
        //     documentId: newOrder._id,
        //     documentCollection: 'Order',
        //     userId: req.currentUser,
        //     changes: generateChanges(null, newOrder.toObject(), true)
        //   });

        await session.commitTransaction();
        res.status(201).json({ data: newOrder, message: "Orden creada con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al crear la orden");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Obtener todas las Órdenes
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'client',
                select: 'user',
                populate: {
                    path: 'user',
                    select: 'name lastName dni'
                }
            })
            .exec();

        if (!orders.length) {
            return res.status(404).json({ error: 'No existen órdenes' });
        }

        res.status(200).json({ data: orders, message: "Órdenes extraídas con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener una sola Orden
export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate({
                path: 'client',
                select: 'user',
                populate: {
                    path: 'user',
                    select: 'name lastName dni'
                }
            })
            .exec();

        if (!order) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        res.status(200).json({ data: order, message: "Orden encontrada" });
    } catch (error) {
        handleError(res, error);
    }
};

export const getOrdersByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({ error: "La fecha de inicio no puede ser posterior a la fecha de fin" });
        }

        const orders = await Order.find({
            dateOrder: { $gte: start, $lte: end }
        })
            .populate({
                path: 'client',
                select: 'user',
                populate: {
                    path: 'user',
                    select: 'name dni'
                }
            })
            .exec();

        if (!orders.length) {
            return res.status(404).json({ error: 'No existen órdenes en el rango de fechas proporcionado' });
        }

        res.status(200).json({ data: orders, message: "Órdenes extraídas con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar una Orden
export const updateOrder = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const { consumptionAccount, balance, total, paymentState } = req.body;

        const order = await Order.findById(id).exec();
        if (!order) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "La orden no existe");
        }

        const updatedFields = { consumptionAccount, balance, total, paymentState };
        const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updatedFields }, { new: true, session }).exec();

        // await saveAuditEntry({
        //     eventType: 'UPDATE',
        //     documentId: updatedOrder._id,
        //     documentCollection: 'Order',
        //     userId: req.currentUser,
        //     changes: generateChanges(order.toObject(), updatedOrder.toObject())
        // });

        await session.commitTransaction();
        res.status(200).json({ data: updatedOrder, message: "Orden actualizada con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al actualizar la orden");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Eliminar una Orden
export const deleteOrder = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const order = await Order.findById(id).exec();
        if (!order) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "Orden no encontrada");
        }

        if (await DetailOrder.exists({ order: id })) {
            await session.abortTransaction();
            return res.status(409).json({ error: "Existen detalles de orden asociados a esta orden" });
        }

        await Order.findByIdAndDelete(id, { session });

        // await saveAuditEntry({
        //     eventType: 'DELETE',
        //     documentId: order._id,
        //     documentCollection: 'Order',
        //     userId: req.currentUser,
        //     changes: generateChanges(order.toObject(), null)
        //   });

        await session.commitTransaction();
        res.status(200).json({ message: "Orden eliminada con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al eliminar la orden");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};
