import mongoose from 'mongoose';
import Section from '../models/sectionModel.js';
import ItemType from '../models/itemTypeModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateSectionData } from '../validators/sectionValidate.js';
import { generateStrongPassword } from '../utils/helpers/handlePassword.js';

// Crear una nueva sección
export const createSection = async (req, res) => {
  let session;
  try {

    // Validar los datos de la sección
    if (!validateSectionData(req.body)) {
      return res.status(400).json({ error: 'Datos de la sección inválidos' });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { name } = req.body;

    if (await Section.exists({ name })) {
      return handleError(res, null, session, 409, 'La sección ya existe');
    }

    const newSection = new Section({ name });
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

// Obtener todas las secciones
export const getSections = async (req, res) => {
  try {
    const sections = await Section.find().select("_id name isActive").exec();
    if (!sections.length) {
      return res.status(404).json({ error: 'No existen secciones' });
    }
    res.status(200).json({ data: sections, message: "Secciones extraídas con éxito" });
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener una sola sección
export const getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).select("_id name isActive").exec();
    if (!section) {
      return res.status(404).json({ error: "Sección no encontrada" });
    }
    res.status(200).json({ data: section, message: "Sección encontrada" });
  } catch (error) {
    handleError(res, error);
  }
};

// Actualizar una sección
export const updateSection = async (req, res) => {
  let session;
  try {

    // Validar los datos de la sección
    if (!validateSectionData(req.body)) {
      return res.status(400).json({ error: 'Datos de la sección inválidos' });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;
    const { name } = req.body;

    const section = await Section.findById(id).exec();
    if (!section) {
      return handleError(res, null, session, 404, "La sección no existe");
    }

    if (name && await Section.exists({ name, _id: { $ne: id } })) {
      return handleError(res, null, session, 400, "No puede repetir el nombre de otra sección creada");
    }

    const updatedSection = await Section.findByIdAndUpdate(id, { name }, { new: true, session }).exec();

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

// Actualizar el estado de una sección
export const updateSectionStatus = async (req, res) => {
  try {

    // Validar los datos de la sección
    if (!validateSectionData(req.body)) {
      return res.status(400).json({ error: 'Datos de la sección inválidos' });
    }

    const { _id, isActive } = req.body;
    const section = await Section.findByIdAndUpdate(_id, { isActive }, { new: true }).exec();

    if (!section) {
      return res.status(404).json({ error: "La sección no se encuentra registrada" });
    }

    const successMessage = isActive ? "Sección activada con éxito" : "Sección desactivada con éxito";
    res.status(200).json({ message: successMessage, data: section });
  } catch (error) {
    handleError(res, error);
  }
};

// Eliminar sección
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
