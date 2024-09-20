import mongoose from 'mongoose';
import Credential from '../models/credentialModel.js';
import User from '../models/userModel.js';
import handleError from '../utils/helpers/handleError.js';
import { encryptPassword, verifyPassword } from '../utils/helpers/handlePassword.js';
import { validateCredentialData } from '../validators/credentialValidate.js';

// Actualizar una credencial
export const updateCredentialPassword = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const validationResult = validateCredentialData(req.body);
    if (!validationResult.isValid) {
      return handleError(res, null, session, 400, validationResult.message);
    }

    const { id } = req.params;
    const { password, newPassword, confirmPassword } = req.body;

    const credential = await Credential.findById(id).exec();

    if (!credential) {
      return handleError(res, null, session, 404, 'Credencial no encontrada');
    }

    if (password && !(await verifyPassword(password, credential.password))) {
      return handleError(res, null, session, 400, 'La contraseña actual es incorrecta');
    }

    if (newPassword && newPassword !== confirmPassword) {
      return handleError(res, null, session, 400, 'Las nuevas contraseñas no coinciden');
    }

    const updatedFields = {};

    if (newPassword) {
      updatedFields.password = await encryptPassword(newPassword);
    }

    const updatedCredential = await Credential.findByIdAndUpdate(credential._id, { $set: updatedFields }, { new: true, session }).exec();

    // await saveAuditEntry({
    //   eventType: 'UPDATE',
    //   documentId: id,
    //   documentCollection: 'Credential',
    //   userId: req.currentUser,
    //   changes: generateChanges(credential.toObject(), updatedCredential.toObject())
    // });

    await session.commitTransaction();
    res.status(200).json({ data: updatedCredential, message: 'Credencial actualizada con éxito' });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, 'Error al actualizar la credencial');
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

// Actualizar el estado de una credencial
export const updateCredentialStatus = async (req, res) => {
  try {

    const validationResult = validateCredentialData(req.body);

    if (!validationResult.isValid) {
      return handleError(res, null, 400, validationResult.message);
    }

    const { _id, isActive } = req.body;

    const credentialUser = await Credential.findOne({ user: _id }).exec();

    if (!credentialUser) {
      return handleError(res, null, 404, "Credencial no encontrada");
    }

    const credential = await Credential.findByIdAndUpdate(credentialUser._id, { isActive }, { new: true }).exec();

    const successMessage = isActive ? "Credencial activada con éxito" : "Credencial desactivada con éxito";
    res.status(200).json({ message: successMessage, data: credential });
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener un solo usuario por id de usuario
export const getUserWithCredential = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const user = await User.findById(userId);

    if (!user) {
      return handleError(res, null, 404, 'Cuenta de usuario no encontrada');
    }

    const credential = await Credential.findOne({ user: userId }).exec();

    if (!credential) {
      return handleError(res, null, 404, 'Credenciales no encontradas');
    }

    const userWithCredentialId = {
      ...user.toObject(),
      credentialId: credential._id
    };

    res.status(200).json({
      data: userWithCredentialId,
      message: "Usuario y credencial encontrados"
    });
  } catch (error) {
    handleError(res, error);
  }
};

