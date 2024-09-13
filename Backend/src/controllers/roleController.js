import mongoose from 'mongoose';
import Role from '../models/roleModel.js';
import User from "../models/userModel.js";
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateRoleData } from '../validators/roleValidate.js';

// Crear un nuevo Rol
export const createRole = async (req, res) => {
  let session;
  try {

    const validationResult = validateRoleData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { name, isActive } = req.body;

    if (await Role.exists({ name: { $regex: new RegExp(`^${name}$`, 'i') } })) {
      await session.abortTransaction();
      return handleError(res, null, session, 409, 'El rol ya existe');
    }

    const newRole = new Role({ name, isActive });
    await newRole.save({ session });

    // await saveAuditEntry({
    //   eventType: 'CREATE',
    //   documentId: newRole._id,
    //   documentCollection: 'Role',
    //   userId: req.currentUser,
    //   changes: generateChanges(null, newRole.toObject(), true)
    // });

    await session.commitTransaction();
    res.status(201).json({ data: newRole, message: "Rol creado con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al crear el rol");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Obtener todos los Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().select("_id name isActive").exec();
    if (!roles.length) {
      return res.status(404).json({ error: 'No existen roles' });
    }
    res.status(200).json({ data: roles, message: "Roles extraídos con éxito" });
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener un solo Rol
export const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).select("_id name isActive").exec();
    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.status(200).json({ data: role, message: "Rol encontrado" });
  } catch (error) {
    handleError(res, error);
  }
};

// Actualizar un Rol
export const updateRole = async (req, res) => {
  let session;
  try {

    const validationResult = validateRoleData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;
    const { name, isActive } = req.body;

    const role = await Role.findById(id).exec();
    if (!role) {
      await session.abortTransaction();
      return handleError(res, null, session, 404, "El rol no existe");
    }

    if (name && await Role.exists({ name: { $regex: new RegExp(`^${name}$`, 'i') }, _id: { $ne: id } })) {
      await session.abortTransaction();
      return handleError(res, null, session, 400, "No puede repetir el nombre de otro rol creado");
    }

    const updatedRole = await Role.findByIdAndUpdate(id, { name, isActive }, { new: true, session }).exec();

    // await saveAuditEntry({
    //   eventType: 'UPDATE',
    //   documentId: updatedRole._id,
    //   documentCollection: 'Role',
    //   userId: req.currentUser,
    //   changes: generateChanges(role.toObject(), updatedRole.toObject())
    // });

    await session.commitTransaction();
    res.status(200).json({ data: updatedRole, message: "Rol actualizado con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al actualizar el rol");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Eliminar un Rol
export const deleteRole = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;

    const role = await Role.findById(id).exec();
    if (!role) {
      await session.abortTransaction();
      return handleError(res, null, session, 404, "Rol no encontrado");
    }

    if (await User.exists({ role: id })) {
      return handleError(res, null, session, 400, "Existen usuarios usando este rol");
    }

    await Role.findByIdAndDelete(id, { session }).exec();

    // await saveAuditEntry({
    //   eventType: 'DELETE',
    //   documentId: role._id,
    //   documentCollection: 'Role',
    //   userId: req.currentUser._id,
    //   changes: generateChanges(role.toObject(), null)
    // });

    await session.commitTransaction();
    res.status(200).json({ message: "Rol eliminado con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al eliminar el rol");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
