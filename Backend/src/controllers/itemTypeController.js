import mongoose from 'mongoose';
import ItemType from '../models/itemTypeModel.js';
import Section from '../models/sectionModel.js';
import Item from '../models/itemModel.js';

// Crear un nuevo ItemType
export const createItemType = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const { name, description, section } = req.body;
        const existingItemType = await ItemType.findOne({ name }).exec();
        const existingSection = await Section.findById(section).exec();

        if (existingItemType) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(409)
                .json({ message: 'El tipo de ítem ya existe' });
        }

        if (!existingSection) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(409)
                .json({ message: 'La sección ingresada no existe' });
        }

        const newItemType = await new ItemType({
            name,
            description,
            section,
        }).save({ session });

        await session.commitTransaction();
        session.endSession();

        res
            .status(201)
            .json({ data: newItemType, message: "Tipo de ítem creado con éxito" });

    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        res
            .status(500)
            .json({ error: "Error al crear el tipo de ítem" });
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
            return res
                .status(404)
                .json({ error: 'No existen tipos de ítem' });
        }

        res
            .status(200)
            .json({ data: itemTypes, message: "Tipos de ítem extraídos con éxito" });

    } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener los tipos de ítem" });
    }
};

// Obtener un solo ItemType
export const getItemType = async (req, res) => {
    try {
        const { id } = req.params;
        const itemType = await ItemType.findById(id)
            .select("_id name description isActive section")
            .populate('section', 'name')
            .exec();

        if (!itemType) {
            return res
                .status(404)
                .send({ error: "Tipo de ítem no encontrado" });
        }

        res
            .status(200)
            .json({ data: itemType, message: "Tipo de ítem encontrado" });

    } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener el tipo de ítem" });
    }
};

// Actualizar un ItemType
export const updateItemType = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { name, description, section } = req.body;
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (section) updatedFields.section = section;

        const itemType = await ItemType.findById(id).lean();
        const existingSection = await Section.findById( section ).exec();

        if (!itemType) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(404)
                .json({ error: "El tipo de ítem no existe" });
        }

        const existingItemType = await ItemType.findOne({ name, _id: { $ne: id } });

        if (existingItemType) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(400)
                .json({ error: "No puede repetir el nombre de otro tipo de ítem creado" });
        }

        if (!existingSection) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(409)
                .json({ message: 'La sección ingresada no existe' });
        }

        const itemTypeUpdate = await ItemType.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        ).exec();

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({ data: itemTypeUpdate, message: "Tipo de ítem actualizado con éxito" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res
            .status(500)
            .json({ error: "Error al actualizar el tipo de ítem" });
    }
};

// Actualizar el estado de un ItemType
export const updateItemTypeStatus = async (req, res) => {
    try {
        const { _id, isActive } = req.body;
        const itemType = await ItemType.findById(_id).lean();

        if (!itemType) {
            return res
                .status(404)
                .send({ error: "El tipo de ítem no se encuentra registrado" });
        }

        const updateItemTypeStatus = await ItemType.findByIdAndUpdate(
            _id,
            { isActive: isActive },
            { new: true }
        );

        const successMessage = isActive
            ? "Tipo de ítem activado con éxito"
            : "Tipo de ítem desactivado con éxito";

        res
            .status(200)
            .json({ message: successMessage, data: updateItemTypeStatus });

    } catch (error) {
        res
            .status(500)
            .send({ error: "Error al actualizar el estado del tipo de ítem" });
    }
};

// Eliminar un ItemType
export const deleteItemType = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const itemType = await ItemType.findById(id);
        const checkItemTypeInItem = await Item.find({ itemType: id }).exec();

        if (!itemType) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(404)
                .json({ error: "Tipo de ítem no encontrado" });
        }

        if (checkItemTypeInItem.length > 0) {
            return res
                .status(404)
                .json({ error: "Existen ítems asociados a este tipo de ítem" });
        }

        await ItemType.findByIdAndDelete(id);

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({ message: "Tipo de ítem eliminado con éxito" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res
            .status(500)
            .json({ error: "Error al eliminar el tipo de ítem" });
    }
};