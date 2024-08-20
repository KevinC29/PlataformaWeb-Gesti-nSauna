// import express from 'express';
import mongoose from 'mongoose';
import Section from '../models/sectionModel.js';
import ItemType from '../models/itemTypeModel.js';

// Crear una nueva seccion
export const createSection = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  // }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name } = req.body;
    const existingSection = await Section.findOne({ name }).exec();

    if (existingSection) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ message: 'La sección ya existe' });
    }

    const newSection = await new Section({
      name,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ data: newSection, message: "Sección creada con éxito" });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Error al crear la sección" });

  }
};

//Obtener todos los Secciones
export const getSections = async (req, res) => {
  
  try {

    const sections = await Section.find()
      .select("_id name isActive")
      .exec();

    if (sections.length === 0) {
      return res
        .status(404)
        .json({ error: 'No existen secciones' });
    }

    res
      .status(200)
      .json({ data: sections, message: "Secciones extraídos con éxito" });

  } catch (error) {

    res
      .status(500)
      .json({ error: "Error al obtener las secciones" });

  }
};

//Obtener una sola seccion
export const getSection = async (req, res) => {

  try {

    const { id } = req.params;
    const section = await Section.findById(id)
      .select("_id name isActive").exec();

    if (!section) {
      return res
        .status(404)
        .send({ error: "Sección no encontrada" });
    }

    res
      .status(200)
      .json({ data: section, message: "Sección encontrada" });

  } catch (error) {

    res
      .status(500)
      .json({ error: "Error al obtener la sección" });

  }
};


export const updateSection = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { id } = req.params;
    const { name } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    const section = await Section.findById(id).lean()

    if (!section) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ error: "La sección  no existe" });
    }

    const existingSection = await Section.findOne({ name, _id: { $ne: id } });

    if (existingSection) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "No puede repetir el nombre de otra sección creada" });
    }

    const sectionUpdate = await Section.findByIdAndUpdate(
      section._id,
      { $set: updatedFields },
      { new: true }
    );

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ data: sectionUpdate, message: "Sección actualizada con éxito" });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Error al actualizar el usuario" });

  }
};

export const updateSectionStatus = async (req, res) => {

  try {

    const { _id, isActive } = req.body;
    const section = await Section.findById(_id).lean()

    if (!section) {
      return res
        .status(404)
        .send({ error: "La sección no se encuentra registrada" });
    }

    const updateSectionStatus = await Section.findByIdAndUpdate(
      section._id,
      { isActive: isActive },
      { new: true }
    );

    // await logsAudit(req, 'CREATE', 'USER', user, Object.keys(req.body), "Actualizar USER");

    const successMessage = isActive
      ? "Sección activada con éxito"
      : "Sección desactivada con éxito";

    res
      .status(200)
      .json({ message: successMessage, data: updateSectionStatus });

  } catch (error) {

    res
      .status(500)
      .send({ error: "Error al actualizar el estado de la sección" });

  }
};


//Eliminar sección
export const deleteSection = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { id } = req.params;
    const section = await Section.findById(id);
    const checkItemTypeInSection = await ItemType.find({ section: id }).exec();
    
    if (!section) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ error: "Sección no encontrada" });
    }

    if (checkItemTypeInSection.length > 0) {
      return res
        .status(404)
        .json({ error: "Existen tipos de ítems asociados a esta sección" });
    }

    await Section.findByIdAndDelete(section._id);

    // await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado Físico usuario");
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Sección eliminada con éxito" });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Error al eliminar la sección" });

  }
};