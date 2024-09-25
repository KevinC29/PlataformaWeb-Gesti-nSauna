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
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateDetailOrderData(req.body);
        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { item, cantidad, price, order } = req.body;
        const existingItem = await Item.findById(item).exec();
        const existingOrder = await Order.findById(order).exec();
        const existingDetailOrder = await DetailOrder.findOne({ order, item }).exec();

        if (!existingItem) {
            return handleError(res, null, session, 404, 'El ítem no existe');
        }

        if (!existingOrder) {
            return handleError(res, null, session, 404, 'La orden no existe');
        }

        if (existingDetailOrder) {
            return handleError(res, null, session, 409, 'El ítem ya existe en esta orden');
        }

        if (!(existingItem.price * cantidad === price)) {
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
export const getDetailsOrder = async (req, res) => {
    try {
        const detailOrders = await DetailOrder.find()
            .populate('item', 'name price')
            .populate('order', 'numberOrder')
            .exec();

        if (!detailOrders.length) {
            return handleError(res, null, 404, 'No existen detalles de órdenes');
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, null, 400, 'ID de detalle de orden no válido');
        }

        const detailOrder = await DetailOrder.findById(id)
            .populate('item', 'name price')
            .populate('order', 'numberOrder')
            .exec();

        if (!detailOrder) {
            return handleError(res, null, 404, 'Detalle de orden no encontrado');
        }

        res.status(200).json({ data: detailOrder, message: "Detalle de orden encontrado" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener todos los DetailOrders de una Order específica
export const getDetailsOrderByOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const detailsOrder = await DetailOrder.find({ order: id }).exec();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, null, 400, 'ID de orden no válido');
        }

        if (detailsOrder.length === 0) {
            return handleError(res, null, 404, 'No se encontraron detalles para la orden');
        }

        res.status(200).json({ data: detailOrder, message: "Detalles de orden encontrados" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar un DetailOrder
export const updateDetailOrder = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateDetailOrderData(req.body);
        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { id } = req.params;
        const { cantidad, price } = req.body;

        const detailOrder = await DetailOrder.findById(id).exec();
        if (!detailOrder) {
            return handleError(res, null, session, 404, "El detalle de orden no existe");
        }

        const existingItem = await Item.findById(detailOrder.item).exec();
        if (!(existingItem.price * cantidad === price)) {
            return handleError(res, null, session, 409, 'El total del detalle de la orden es incorrecto');
        }

        const updatedFields = { cantidad, price };
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
            return handleError(res, null, session, 404, "Detalle de orden no encontrado");
        }

        const totalEliminate = detailOrder.price;
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
