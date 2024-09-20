import mongoose from 'mongoose';
import Section from '../models/sectionModel.js';
import ItemType from '../models/itemTypeModel.js';
import Item from '../models/itemModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateSectionData } from '../validators/sectionValidate.js';

// Crear una nueva Sección
export const createSection = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const validationResult = validateSectionData(req.body);

    if (!validationResult.isValid) {
      return handleError(res, null, session, 400, validationResult.message);
    }

    const { name, isActive } = req.body;

    if (await Section.exists({ name: { $regex: new RegExp(`^${name}$`, 'i') } })) {
      return handleError(res, null, session, 409, 'La sección ya existe');
    }

    const newSection = new Section({ name, isActive });
    await newSection.save({ session });

    // await saveAuditEntry({
    //   eventType: 'CREATE',
    //   documentId: newSection._id,
    //   documentCollection: 'Section',
    //   userId: req.currentUser,
    //   changes: generateChanges(null, newSection.toObject(), true)
    // });

    await session.commitTransaction();
    res.status(201).json({ data: newSection, message: "Sección creada con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al crear la sección");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Obtener todas las Secciones
export const getSections = async (req, res) => {
  try {
    const sections = await Section.find().select("_id name isActive").exec();
    if (!sections.length) {
      return handleError(res, null, 404, 'No existen secciones');
    }
    res.status(200).json({ data: sections, message: "Secciones extraídas con éxito" });
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener todas las Secciones con sus items
export const getSectionsWithItems = async (req, res) => {
  try {
    const sections = await Section.find().select('_id name isActive').exec();

    if (!sections.length) {
      return handleError(res, null, 404, 'No existen secciones');
    }

    const sectionPromises = sections.map(async (section) => {
      const itemTypes = await ItemType.find({ section: section._id })
        .select('_id name description isActive')
        .exec();

      const itemTypePromises = itemTypes.map(async (itemType) => {
        const items = await Item.find({ itemType: itemType._id })
          .select('_id name description price imageUrl isActive')
          .exec();

        return {
          ...itemType.toObject(),
          items,
        };
      });

      const itemTypesWithItems = await Promise.all(itemTypePromises);

      return {
        ...section.toObject(),
        itemTypes: itemTypesWithItems,
      };
    });

    const sectionsWithItems = await Promise.all(sectionPromises);

    res.status(200).json({ data: sectionsWithItems, message: "Secciones con items extraídas con éxito" });
  } catch (error) {
    console.log(error)
    handleError(res, error);
  }
};

// Obtener una sola Sección
export const getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).select("_id name isActive").exec();
    if (!section) {
      return handleError(res, null, 404, 'Sección no encontrada');
    }
    res.status(200).json({ data: section, message: "Sección encontrada" });
  } catch (error) {
    handleError(res, error);
  }
};

// Actualizar una Sección
export const updateSection = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const validationResult = validateSectionData(req.body);

    if (!validationResult.isValid) {
      return handleError(res, null, session, 400, validationResult.message);
    }

    const { id } = req.params;
    const { name, isActive } = req.body;

    const section = await Section.findById(id).exec();
    if (!section) {
      return handleError(res, null, session, 404, "La sección no existe");
    }

    if (name && await Section.exists({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: id } })) {
      return handleError(res, null, session, 400, "No puede repetir el nombre de otra sección creada");
    }

    const updatedSection = await Section.findByIdAndUpdate(id, { name, isActive }, { new: true, session }).exec();

    // await saveAuditEntry({
    //   eventType: 'UPDATE',
    //   documentId: updatedSection._id,
    //   documentCollection: 'Section',
    //   userId: req.currentUser,
    //   changes: generateChanges(section.toObject(), updatedSection.toObject())
    // });

    await session.commitTransaction();
    res.status(200).json({ data: updatedSection, message: "Sección actualizada con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al actualizar la sección");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Eliminar Sección
export const deleteSection = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;

    const section = await Section.findById(id).exec();
    if (!section) {
      return handleError(res, null, session, 404, "Sección no encontrada");
    }

    if (await ItemType.exists({ section: id })) {
      return handleError(res, null, session, 400, "Existen tipos de ítems asociados a esta sección");
    }

    await Section.findByIdAndDelete(id, { session }).exec();

    // await saveAuditEntry({
    //   eventType: 'DELETE',
    //   documentId: section._id,
    //   documentCollection: 'Section',
    //   userId: req.currentUser,
    //   changes: generateChanges(section.toObject(), null)
    // });


    await session.commitTransaction();
    res.status(200).json({ message: "Sección eliminada con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al eliminar la sección");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
