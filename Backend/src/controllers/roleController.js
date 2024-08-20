// import express from 'express';
import mongoose from 'mongoose';
import Role from '../models/roleModel.js'

// Crear un nuevo rol
export const createRole = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  // }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name } = req.body;
    const existingRole = await Role.findOne({ name }).exec();

    if (existingRole) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ message: 'El rol ya existe' });
    }

    const newRole = await new Role({
      name,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ data: newRole, message: "Rol creado con éxito" });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Error al crear el rol" });

  }
};

//Obtener todos los roles
export const getRoles = async (req, res) => {
  try {

    const roles = await Role.find()
      .select("_id name isActive")
      .exec();

    if (roles.length === 0) {
      return res
        .status(404)
        .json({ error: 'No existen roles' });
    }

    res
      .status(200)
      .json({ data: roles, message: "Roles extraídos con éxito" });

  } catch (error) {

    res
      .status(500)
      .json({ error: "Error al obtener los roles" });

  }
};

//Obtener un solo rol
export const getRole = async (req, res) => {

  try {

    const { id } = req.params;
    const role = await Role.findById(id)
      .select("_id name isActive").exec();

    if (!role) {
      return res
        .status(404)
        .send({ error: "Rol no encontrado" });
    }

    res
      .status(200)
      .json({ data: role, message: "Rol encontrado" });

  } catch (error) {

    res
      .status(500)
      .json({ error: "Error al obtener el rol" });

  }
};


export const updateRole = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { id } = req.params;
    const { name } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    const role = await Role.findById(id).lean()

    if (!role) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ error: "El rol  no existe" });
    }

    const existingRole = await Role.findOne({ name, _id: { $ne: id } });

    if (existingRole) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ error: "No puede repetir el nombre de otro rol creado" });
    }

    const roleUpdate = await Role.findByIdAndUpdate(
      role._id,
      { $set: updatedFields },
      { new: true }
    );

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ data: roleUpdate, message: "Rol actualizado con éxito" });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Error al actualizar el usuario" });

  }
};

export const updateRoleStatus = async (req, res) => {

  try {

    const { _id, isActive } = req.body;
    const role = await Role.findById(_id).lean()

    if (!role) {
      return res
        .status(404)
        .send({ error: "El rol no se encuentra registrado" });
    }

    const updateRoleStatus = await Role.findByIdAndUpdate(
      role._id,
      { isActive: isActive },
      { new: true }
    );

    // await logsAudit(req, 'CREATE', 'USER', user, Object.keys(req.body), "Actualizar USER");

    const successMessage = isActive
      ? "Rol activado con éxito"
      : "Rol desactivado con éxito";

    res
      .status(200)
      .json({ message: successMessage, data: updateRoleStatus });

  } catch (error) {

    res
      .status(500)
      .send({ error: "Error al actualizar el estado del rol" });

  }
};


//Eliminar rol
export const deleteRole = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { id } = req.params;
    const role = await Role.findById(id);

    if (!role) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ error: "Rol no encontrado" });
    }

    await Role.findByIdAndDelete(role._id);

    // await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado Físico usuario");
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Rol eliminado con éxito" });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ error: "Error al eliminar el rol" });

  }
};