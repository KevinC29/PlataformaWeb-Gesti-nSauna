import mongoose from 'mongoose';
import ItemType from '../models/itemTypeModel.js';
import Item from '../models/itemModel.js';
import DetailOrder from '../models/detailOrderModel.js';
import validateImageUrl from '../validators/validateImage.js';

// Crear un nuevo Item
export const createItem = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, price, imageUrl, itemType } = req.body;

        // Validar imagen
        const validationImage = await validateImageUrl(imageUrl);
        if (!validationImage.isValid) {
            return res.status(400).json({ message: validationImage.message });
        }

        // Validar existencia del ítem
        const existingItem = await Item.findOne({ name }).exec();
        if (existingItem) {
            await session.abortTransaction();
            return res.status(409).json({ message: 'El ítem ya existe' });
        }

        // Validar existencia del tipo de ítem
        const existingItemType = await ItemType.findById(itemType).exec();
        if (!existingItemType) {
            await session.abortTransaction();
            return res.status(409).json({ message: 'El tipo de ítem ingresado no existe' });
        }

        // Crear y guardar el nuevo ítem
        const newItem = new Item({
            name,
            price,
            imageUrl,
            itemType,
        });

        await newItem.save({ session });

        await session.commitTransaction();
        res.status(201).json({ data: newItem, message: "Ítem creado con éxito" });

    } catch (error) {
        console.error('Error en createItem:', error);
        await session.abortTransaction();
        res.status(500).json({ error: "Error al crear el ítem" });
    } finally {
        session.endSession();
    }
};


// Obtener todos los Items
export const getItems = async (req, res) => {
    try {
        const items = await Item.find()
            .select("_id name price image isActive itemType")
            .populate('itemType', 'name')
            .exec();

        if (items.length === 0) {
            return res
                .status(404)
                .json({ error: 'No existen ítems' });
        }

        res
            .status(200)
            .json({ data: items, message: "Ítems extraídos con éxito" });

    } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener los ítems" });
    }
};

// Obtener un solo Item
export const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id)
            .select("_id name price image isActive itemType")
            .populate('itemType', 'name')
            .exec();

        if (!item) {
            return res
                .status(404)
                .send({ error: "Ítem no encontrado" });
        }

        res
            .status(200)
            .json({ data: item, message: "Ítem encontrado" });

    } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener el ítem" });
    }
};

// Actualizar un Item
export const updateItem = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { name, price, imageUrl, itemType } = req.body;
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (price) updatedFields.price = price;
        if (imageUrl) updatedFields.imageUrl = imageUrl;
        if (itemType) updatedFields.itemType = itemType;

        const item = await Item.findById(id).lean();
        const existingItemType = await ItemType.findById(itemType).exec();

        if (!item) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(404)
                .json({ error: "El ítem no existe" });
        }

        const existingItem = await Item.findOne({ name, _id: { $ne: id } });

        if (existingItem) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(400)
                .json({ error: "El nombre del ítem ya existe" });
        }

        if (!existingItemType) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(409)
                .json({ message: 'El tipo de ítem ingresado no existe' });
        }

        const itemUpdate = await Item.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        ).exec();

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({ data: itemUpdate, message: "Ítem actualizado con éxito" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res
            .status(500)
            .json({ error: "Error al actualizar el ítem" });
    }
};

// Actualizar el estado de un Item
export const updateItemStatus = async (req, res) => {
    try {
        const { _id, isActive } = req.body;
        const item = await Item.findById(_id).lean();

        if (!item) {
            return res
                .status(404)
                .send({ error: "El ítem no se encuentra registrado" });
        }

        const updateItemStatus = await Item.findByIdAndUpdate(
            _id,
            { isActive: isActive },
            { new: true }
        );

        const successMessage = isActive
            ? "Ítem activado con éxito"
            : "Ítem desactivado con éxito";

        res
            .status(200)
            .json({ message: successMessage, data: updateItemStatus });

    } catch (error) {
        res
            .status(500)
            .send({ error: "Error al actualizar el estado del ítem" });
    }
};

// Eliminar un Item
export const deleteItem = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const item = await Item.findById(id);
        const checkItemInDetailOrder = await DetailOrder.find({ item: id }).exec();

        if (!item) {
            await session.abortTransaction();
            session.endSession();
            return res
                .status(404)
                .json({ error: "Ítem no encontrado" });
        }

        if (checkItemInDetailOrder.length > 0) {
            return res
                .status(404)
                .json({ error: "Existen ítems asociados a este tipo de ítem" });
        }

        await Item.findByIdAndDelete(id);

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({ message: "Ítem eliminado con éxito" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res
            .status(500)
            .json({ error: "Error al eliminar el ítem" });
    }
};