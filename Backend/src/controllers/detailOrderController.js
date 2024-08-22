import mongoose from 'mongoose';
import DetailOrder from '../models/detailOrderModel.js';
import Item from '../models/itemModel.js';
import Order from '../models/orderModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateDetailOrderData } from '../validators/detailOrderValidate.js';

// Crear un nuevo DetailOrder
export const createDetailOrder = async (req, res) => {
    let session;
    try {

        if (!validateDetailOrderData(req.body)) {
            return res.status(400).json({ error: 'Datos del detalle de orden inválidos' });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const { item, cantidad, price, order } = req.body;
        const existingItem = await Item.findById(item).exec();
        const existingOrder = await Order.findById(order).exec();
        const existingDetailOrder = await DetailOrder.findOne({ order, item }).exec();

        if (!existingItem) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, 'El ítem no existe');
        }

        if (!existingOrder) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, 'La orden no existe');
        }

        if (existingDetailOrder) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El ítem ya existe en esta orden');
        }

        if (!(existingItem.price * cantidad === price)) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El total del detalle de la orden es incorrecto');
        }

        const newDetailOrder = new DetailOrder({ item, cantidad, price, order });
        await newDetailOrder.save({ session });

        const updateOrder = await Order.findByIdAndUpdate(existingOrder._id, { consumptionAccount: existingOrder.consumptionAccount + price, total: existingOrder.total + price }, { new: true, session }).exec();

        // await saveAuditEntry({
        //     eventType: 'CREATE',
        //     documentId: newDetailOrder._id,
        //     documentCollection: 'DetailOrder',
        //     userId: req.currentUser,
        //     changes: generateChanges(null, newDetailOrder.toObject(), true)
        //   });

        await session.commitTransaction();
        res.status(201).json({ data: { newDetailOrder, updateOrder }, message: "Detalle de orden creado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al crear el detalle de la orden");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Obtener todos los DetailOrders
export const getDetailOrders = async (req, res) => {
    try {
        const detailOrders = await DetailOrder.find()
            .populate('item', 'name price')
            .populate('order', 'numberOrder')
            .exec();

        if (!detailOrders.length) {
            return res.status(404).json({ error: 'No existen detalles de órdenes' });
        }

        res.status(200).json({ data: detailOrders, message: "Detalles de órdenes extraídos con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener un solo DetailOrder
export const getDetailOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const detailOrder = await DetailOrder.findById(id)
            .populate('item', 'name price')
            .populate('order', 'numberOrder')
            .exec();

        if (!detailOrder) {
            return res.status(404).json({ error: "Detalle de orden no encontrado" });
        }

        res.status(200).json({ data: detailOrder, message: "Detalle de orden encontrado" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar un DetailOrder
export const updateDetailOrder = async (req, res) => {
    let session;
    try {

        if (!validateDetailOrderData(req.body)) {
            return res.status(400).json({ error: 'Datos del detalle de orden inválidos' });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const { cantidad, price } = req.body;

        const detailOrder = await DetailOrder.findById(id).exec();

        if (!detailOrder) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "El detalle de orden no existe");
        }

        const updatedFields = { cantidad, price };

        if (!(detailOrder.item.price * cantidad === price)) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El total del detalle de la orden es incorrecto');
        }

        const updatedDetailOrder = await DetailOrder.findByIdAndUpdate(id, { $set: updatedFields }, { new: true, session }).exec();
        
        // await saveAuditEntry({
        //     eventType: 'UPDATE',
        //     documentId: updatedDetailOrder._id,
        //     documentCollection: 'DetailOrder',
        //     userId: req.currentUser,
        //     changes: generateChanges(oldDetailOrder, updatedDetailOrder.toObject())
        //   });

        await session.commitTransaction();
        res.status(200).json({ data: updatedDetailOrder, message: "Detalle de orden actualizado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al actualizar el detalle de la orden");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Eliminar un DetailOrder
export const deleteDetailOrder = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const detailOrder = await DetailOrder.findById(id).exec();
        const order = await Order.findById(detailOrder.order).exec();
        if (!detailOrder) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "Detalle de orden no encontrado");
        }

        const totalEliminate = detailOrder.price*detailOrder.cantidad;

        const updateOrder = await Order.findByIdAndUpdate(order._id, { consumptionAccount: order.consumptionAccount - totalEliminate, total: order.total - totalEliminate }, { new: true, session }).exec();

        await DetailOrder.findByIdAndDelete(id, { session });

        // await saveAuditEntry({
        //     eventType: 'DELETE',
        //     documentId: id,
        //     documentCollection: 'DetailOrder',
        //     userId: req.currentUser,
        //     changes: generateChanges(detailOrder.toObject(), null)
        //   });

        await session.commitTransaction();
        res.status(200).json({ data: updateOrder, message: "Detalle de orden eliminado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al eliminar el detalle de la orden");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};
