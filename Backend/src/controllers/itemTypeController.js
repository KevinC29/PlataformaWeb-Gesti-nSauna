import mongoose from 'mongoose';
import ItemType from '../models/itemTypeModel.js';
import Section from '../models/sectionModel.js';
import Item from '../models/itemModel.js';
import handleError from '../utils/helpers/handleError.js';

// Crear un nuevo ItemType
export const createItemType = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { name, description, section } = req.body;

        if (await ItemType.exists({ name })) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'El tipo de ítem ya existe');
        }

        if (!await Section.exists({ _id: section })) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'La sección ingresada no existe');
        }

        const newItemType = new ItemType({ name, description, section });
        await newItemType.save({ session });

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
            return res.status(404).json({ error: 'No existen tipos de ítem' });
        }

        res.status(200).json({ data: itemTypes, message: "Tipos de ítem extraídos con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Obtener un solo ItemType
export const getItemType = async (req, res) => {
    try {
        const itemType = await ItemType.findById(req.params.id)
            .select("_id name description isActive section")
            .populate('section', 'name')
            .exec();

        if (!itemType) {
            return res.status(404).json({ error: "Tipo de ítem no encontrado" });
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

        const { id } = req.params;
        const { name, description, section } = req.body;

        if (!await ItemType.exists({ _id: id })) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "El tipo de ítem no existe");
        }

        if (name && await ItemType.exists({ name, _id: { $ne: id } })) {
            await session.abortTransaction();
            return handleError(res, null, session, 400, "No puede repetir el nombre de otro tipo de ítem creado");
        }

        if (section && !await Section.exists({ _id: section })) {
            await session.abortTransaction();
            return handleError(res, null, session, 409, 'La sección ingresada no existe');
        }

        const updatedItemType = await ItemType.findByIdAndUpdate(
            id,
            { name, description, section },
            { new: true, session }
        ).exec();

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

// Actualizar el estado de un ItemType
export const updateItemTypeStatus = async (req, res) => {
    try {
        const { _id, isActive } = req.body;

        const updatedItemType = await ItemType.findByIdAndUpdate(
            _id,
            { isActive },
            { new: true }
        ).exec();

        if (!updatedItemType) {
            return res.status(404).json({ error: "El tipo de ítem no se encuentra registrado" });
        }

        const successMessage = isActive
            ? "Tipo de ítem activado con éxito"
            : "Tipo de ítem desactivado con éxito";

        res.status(200).json({ message: successMessage, data: updatedItemType });
    } catch (error) {
        handleError(res, error);
    }
};

// Eliminar un ItemType
export const deleteItemType = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;

        if (!await ItemType.exists({ _id: id })) {
            await session.abortTransaction();
            return handleError(res, null, session, 404, "Tipo de ítem no encontrado");
        }

        if (await Item.exists({ itemType: id })) {
            await session.abortTransaction();
            return res.status(409).json({ error: "Existen ítems asociados a este tipo de ítem" });
        }

        await ItemType.findByIdAndDelete(id, { session }).exec();
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
