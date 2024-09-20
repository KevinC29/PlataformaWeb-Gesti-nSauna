import mongoose from 'mongoose';
import Item from '../models/itemModel.js';
import ItemType from '../models/itemTypeModel.js';
import DetailOrder from '../models/detailOrderModel.js';
import validateImageUrl from '../validators/validateImage.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateItemData } from '../validators/itemValidate.js';

// Crear un nuevo Item
export const createItem = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateItemData(req.body);
        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { name, description, price, imageUrl, itemType, isActive } = req.body;
        const validationImage = await validateImageUrl(imageUrl);

        if (!validationImage.isValid) {
            return handleError(res, null, session, 400, validationImage.message);
        }

        if (await Item.exists({ name })) {
            return handleError(res, null, session, 409, 'El ítem ya existe');
        }

        if (!await ItemType.exists({ _id: itemType })) {
            return handleError(res, null, session, 409, 'El tipo de ítem ingresado no existe');
        }

        const newItem = new Item({ name, description, price, imageUrl, itemType, isActive });
        await newItem.save({ session });

        // await saveAuditEntry({
        //     eventType: 'CREATE',
        //     documentId: newItem._id,
        //     documentCollection: 'Item',
        //     userId: req.currentUser,
        //     changes: generateChanges(null, newItem.toObject(), true)
        //   });

        await session.commitTransaction();
        res.status(201).json({ data: newItem, message: "Ítem creado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al crear el ítem");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Obtener todos los Items
export const getItems = async (req, res) => {
    try {
        const items = await Item.find()
            .select("_id name description price imageUrl isActive itemType")
            .populate('itemType', 'name')
            .exec();

        if (items.length === 0) {
            return handleError(res, null, 404, 'No existen ítems');
        }

        res.status(200).json({ data: items, message: "Ítems extraídos con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener un solo Item
export const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id)
            .select("_id name description price imageUrl isActive itemType")
            .populate('itemType', 'name')
            .exec();

        if (!item) {
            return handleError(res, null, 404, 'Ítem no encontrado');
        }

        res.status(200).json({ data: item, message: "Ítem encontrado" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar un Item
export const updateItem = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateItemData(req.body);
        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { id } = req.params;
        const { name, description, price, imageUrl, itemType, isActive } = req.body;
        
        if (!await Item.exists({ _id: id })) {
            return handleError(res, null, session, 404, "El ítem no existe");
        }

        if (name && await Item.exists({ name, _id: { $ne: id } })) {
            return handleError(res, null, session, 400, "El nombre del ítem ya existe");
        }

        if (itemType && !await ItemType.exists({ _id: itemType })) {
            return handleError(res, null, session, 409, 'El tipo de ítem ingresado no existe');
        }

        const updatedItem = await Item.findByIdAndUpdate(id, { name, description, price, imageUrl, itemType, isActive }, { new: true, session }).exec();

        // await saveAuditEntry({
        //     eventType: 'UPDATE',
        //     documentId: updatedItem._id,
        //     documentCollection: 'Item',
        //     userId: req.currentUser,
        //     changes: generateChanges(oldItem, updatedItem.toObject())
        //   });

        await session.commitTransaction();
        res.status(200).json({ data: updatedItem, message: "Ítem actualizado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al actualizar el ítem");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Eliminar un Item
export const deleteItem = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const item = await Item.findById(id).exec();
        if (!item) {
            return handleError(res, null, session, 404, "Ítem no encontrado");
        }

        if (await DetailOrder.exists({ item: id })) {
            return handleError(res, null, session, 409, "Existen detalles de orden asociados a este ítem");
        }

        await Item.findByIdAndDelete(id, { session }).exec();

        // await saveAuditEntry({
        //     eventType: 'DELETE',
        //     documentId: id,
        //     documentCollection: 'Item',
        //     userId: req.currentUser,
        //     changes: generateChanges(item.toObject(), null)
        //   });

        await session.commitTransaction();
        res.status(200).json({ message: "Ítem eliminado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al eliminar el ítem");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};
