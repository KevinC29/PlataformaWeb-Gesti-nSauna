import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Client from '../models/clientModel.js';
import Credential from '../models/credentialModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { encryptPassword } from '../utils/helpers/handlePassword.js';
import { validateUserData } from '../validators/userValidate.js';

// Crear un nuevo Usuario
export const createUser = async (req, res) => {
  let session;
  try {

    const validationResult = validateUserData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { name, lastName, dni, email, role, password, confirmPassword, isActive } = req.body;

    if (await User.exists({ dni })) {
      return handleError(res, null, session, 409, 'El DNI ya está registrado');
    }

    let userEmail = email && email.trim() !== '' ? email : null;

    if (userEmail) {
      const emailExists = await User.exists({ email: userEmail });
      if (emailExists) {
        return handleError(res, null, session, 409, 'El correo electrónico ya está registrado');
      }
    }

    const roleDoc = await Role.findById(role);

    if (!roleDoc) {
      return handleError(res, null, session, 400, 'El rol no existe');
    }

    let passwordHash;
    if (roleDoc.name === "CLIENT" || roleDoc.name === "MANAGER") {
      passwordHash = await encryptPassword(dni);
    } else {
      if (password && password !== confirmPassword) {
        await session.abortTransaction();
        return handleError(res, null, session, 400, 'Las contraseñas no coinciden');
      }
      passwordHash = await encryptPassword(password);
    }

    const newUser = new User({ name, lastName, dni, email: userEmail || '', role, isActive });

    await newUser.save({ session });

    const newCredential = new Credential({ email: userEmail || dni, password: passwordHash, user: newUser._id });
    await newCredential.save({ session });

    // await saveAuditEntry({
    //   eventType: 'CREATE',
    //   documentId: newUser._id,
    //   documentCollection: 'User',
    //   userId: req.currentUser,
    //   changes: generateChanges(null, newUser.toObject(), true)
    // });

    // await saveAuditEntry({
    //   eventType: 'CREATE',
    //   documentId: newCredential._id,
    //   documentCollection: 'Credential',
    //   userId: req.currentUser,
    //   changes: generateChanges(null, newCredential.toObject(), true)
    // });

    await session.commitTransaction();
    res.status(201).json({ data: newUser, message: "Usuario y contraseña creado con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    console.log(error)
    handleError(res, error, session, 500, "Error al crear el usuario");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Obtener todos los Usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name lastName dni email isActive role")
      .populate({
        path: 'role',
        select: '_id name'
      })
      .exec();

    if (!users.length) {
      return res.status(404).json({ error: 'No existen usuarios' });
    }

    const userIds = users.map(user => user._id);
    const credentials = await Credential.find({ user: { $in: userIds } })
      .select('user isActive')
      .exec();

    const credentialsMap = credentials.reduce((acc, credential) => {
      acc[credential.user] = credential.isActive;
      return acc;
    }, {});

    const usersWithCredentialStatus = users.map(user => ({
      ...user.toObject(),
      credentialStatus: credentialsMap[user._id] || null
    }));

    res.status(200).json({ data: usersWithCredentialStatus, message: "Usuarios extraídos con éxito" });
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener un solo Usuario
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("_id name lastName dni email isActive role")
      .populate({
        path: 'role',
        select: '_id name'
      }).exec();
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json({ data: user, message: "Usuario encontrado" });
  } catch (error) {
    handleError(res, error);
  }
};

// Actualizar un Usuario
export const updateUser = async (req, res) => {
  let session;
  try {
    const validationResult = validateUserData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;
    const { name, lastName, dni, email, role, isActive } = req.body;

    const user = await User.findById(id).exec();
    const credential = await Credential.findOne({ user: user._id }).exec();

    if (!user) {
      return handleError(res, null, session, 404, "El usuario no existe");
    }

    if (dni && await User.exists({ dni, _id: { $ne: id } })) {
      return handleError(res, null, session, 400, "No puede repetir el DNI de otro usuario registrado");
    }

    if (email && email.trim() !== '' && await User.exists({ email, _id: { $ne: id } })) {
      return handleError(res, null, session, 400, "No puede repetir el correo electrónico de otro usuario registrado");
    }

    if (role && !await Role.exists({ _id: role })) {
      return handleError(res, null, session, 400, "El rol no existe");
    }

    if (!credential) {
      await session.abortTransaction();
      return handleError(res, null, session, 404, 'Credencial no encontrada');
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name, lastName, dni, email, role, isActive }, { new: true, session }).exec();

    if (email && email.trim() !== '') {
      await Credential.findByIdAndUpdate(credential._id, { email }, { new: true, session }).exec();
    }
    // await saveAuditEntry({
    //   eventType: 'UPDATE',
    //   documentId: updatedUser._id,
    //   documentCollection: 'User',
    //   userId: req.currentUser,
    //   changes: generateChanges(user.toObject(), updatedUser.toObject())
    // });

    // if (email && email.trim() !== '') {
    //   await saveAuditEntry({
    //     eventType: 'UPDATE',
    //     documentId: updatedCredential._id,
    //     documentCollection: 'Credential',
    //     userId: req.currentUser,
    //     changes: generateChanges(credential.toObject(), updatedCredential.toObject())
    //   });
    // }

    await session.commitTransaction();
    res.status(200).json({ data: { updatedUser }, message: "Usuario actualizado con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al actualizar el usuario");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Eliminar Usuario
export const deleteUser = async (req, res) => {
  let session;
  try {

    session = await mongoose.startSession();
    session.startTransaction();

    const { id } = req.params;

    const user = await User.findById(id).exec();
    if (!user) {
      return handleError(res, null, session, 404, "Usuario no encontrado");
    }

    const credential = await Credential.findOne({ user: id }).exec();

    if (!credential) {
      await session.abortTransaction();
      return handleError(res, null, session, 404, 'Credencial no encontrada');
    }

    if (await Client.exists({ user: id })) {
      await session.abortTransaction();
      return res.status(409).json({ error: "Existe un cliente asociados a este usuario" });
    }

    await User.findByIdAndDelete(id, { session }).exec();
    await Credential.deleteOne({user: id}, { session }).exec();

    // await saveAuditEntry({
    //   eventType: 'DELETE',
    //   documentId: user._id,
    //   documentCollection: 'User',
    //   userId: req.currentUser,
    //   changes: generateChanges(user.toObject(), null)
    // });

    await session.commitTransaction();
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    console.log(error)
    handleError(res, error, session, 500, "Error al eliminar el usuario");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
