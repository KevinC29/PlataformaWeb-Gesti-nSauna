import mongoose from 'mongoose';
import ItemType from '../models/itemTypeModel.js';
import Section from '../models/sectionModel.js';
import Item from '../models/itemModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateItemTypeData } from '../validators/itemTypeValidate.js';

// Crear un nuevo ItemType
export const createItemType = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateItemTypeData(req.body);
        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { name, description, section, isActive } = req.body;

        if (await ItemType.exists({ name: { $regex: new RegExp(`^${name}$`, 'i') } })) {
            return handleError(res, null, session, 409, 'El tipo de ítem ya existe');
        }

        if (!await Section.exists({ _id: section })) {
            return handleError(res, null, session, 409, 'La sección ingresada no existe');
        }

        const newItemType = new ItemType({ name, description, section, isActive });
        await newItemType.save({ session });

        // await saveAuditEntry({
        //     eventType: 'CREATE',
        //     documentId: newItemType._id,
        //     documentCollection: 'ItemType',
        //     userId: req.currentUser,
        //     changes: generateChanges(null, newItemType.toObject(), true)
        //   });

        await session.commitTransaction();
        res.status(201).json({ data: newItemType, message: "Tipo de ítem creado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al crear el tipo de ítem");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Obtener todos los ItemTypes
export const getItemTypes = async (req, res) => {
    try {
        const itemTypes = await ItemType.find()
            .select("_id name description isActive section")
            .populate('section', 'name')
            .exec();

        if (itemTypes.length === 0) {
            return handleError(res, null, null, 404, 'No existen tipos de ítem');
        }

        res.status(200).json({ data: itemTypes, message: "Tipos de ítem extraídos con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener un solo ItemType
export const getItemType = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, null, null, 400, 'ID de tipo de ítem no válido');
        }

        const itemType = await ItemType.findById(id)
            .select("_id name description isActive section")
            .populate('section', 'name')
            .exec();

        if (!itemType) {
            return handleError(res, null, session, 404, 'Tipo de ítem no encontrado');
        }

        res.status(200).json({ data: itemType, message: "Tipo de ítem encontrado" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar un ItemType
export const updateItemType = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateItemTypeData(req.body);
        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { id } = req.params;
        const { name, description, section, isActive } = req.body;

        if (!await ItemType.exists({ _id: id })) {
            return handleError(res, null, session, 404, "El tipo de ítem no existe");
        }

        if (name && await ItemType.exists({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: id } })) {
            return handleError(res, null, session, 400, "No puede repetir el nombre de otro tipo de ítem creado");
        }

        if (section && !await Section.exists({ _id: section })) {
            return handleError(res, null, session, 409, 'La sección ingresada no existe');
        }

        const updatedItemType = await ItemType.findByIdAndUpdate(
            id,
            { name, description, section, isActive },
            { new: true, session }
        ).exec();

        // await saveAuditEntry({
        //     eventType: 'UPDATE',
        //     documentId: updatedItemType._id,
        //     documentCollection: 'ItemType',
        //     userId: req.currentUser,
        //     changes: generateChanges(oldItemType.toObject(), updatedItemType.toObject())
        //   });

        await session.commitTransaction();
        res.status(200).json({ data: updatedItemType, message: "Tipo de ítem actualizado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al actualizar el tipo de ítem");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Eliminar un ItemType
export const deleteItemType = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const itemType = await ItemType.findById(id).exec();
        if (!itemType) {
            return handleError(res, null, session, 404, "Tipo de ítem no encontrado");
        }

        if (await Item.exists({ itemType: id })) {
            return handleError(res, null, session, 409, "Existen ítems asociados a este tipo de ítem");
        }

        await ItemType.findByIdAndDelete(id, { session }).exec();

        // await saveAuditEntry({
        //     eventType: 'DELETE',
        //     documentId: id,
        //     documentCollection: 'ItemType',
        //     userId: req.currentUser,
        //     changes: generateChanges(itemType.toObject(), null)
        //   });

        await session.commitTransaction();
        res.status(200).json({ message: "Tipo de ítem eliminado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al eliminar el tipo de ítem");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};
