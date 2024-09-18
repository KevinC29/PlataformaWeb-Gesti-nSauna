import mongoose from "mongoose";
import Credential from "../models/credentialModel.js";
import Role from "../models/roleModel.js";
import { encryptPassword, verifyPassword } from "../utils/helpers/handlePassword.js";
import { generateToken } from "../utils/helpers/handleTokenJWT.js";
import { validateCredentialData } from '../validators/credentialValidate.js';
import handleError from "../utils/helpers/handleError.js";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  let session;
  try {

    const validationResult = validateCredentialData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    const { email, password } = req.body;

    session = await mongoose.startSession();
    session.startTransaction();

    // Buscar la credencial con el email proporcionado
    const credential = await Credential.findOne({ email })
      .populate("user", "name lastName role isActive")
      .exec();

    if (!credential) {
      return handleError(res, null, session, 400, "Usuario no encontrado");
    }

    if (!credential.isActive) {
      return handleError(res, null, session, 400, "La cuenta de usuario esta desactivada");
    }

    const passwordTemp = process.env.PASSWORD_TEMP;

    let isPasswordValid = await verifyPassword(password, credential.password);
    let isPasswordTemp = await verifyPassword(passwordTemp, credential.password);

    if (isPasswordTemp) {
      const newPass = await encryptPassword(password);
      credential.password = newPass;
      await credential.save({ session });
    } else if (!isPasswordValid) {
      await session.abortTransaction();
      return handleError(res, null, session, 400, "Contraseña inválida");
    }
    
    const user = credential.user;

    const role = await Role.findById(user.role).exec();

    const response = {
      id: user._id,
      name: `${user.name} ${user.lastName}`,
      role: role.name,
    };

    const token = generateToken(response);

    await session.commitTransaction();
    res.status(200).json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Error al abortar la transacción:", abortError);
      }
    }
    handleError(res, error, session, 500, "Error al iniciar sesión");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

export const resetPassword = async (req, res) => {
  let session;
  try {
    const validationResult = validateCredentialData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({ error: validationResult.message });
    }

    const { email } = req.body;

    session = await mongoose.startSession();
    session.startTransaction();

    const credential = await Credential.findOne({ email }).exec();

    if (!credential) {
      return handleError(res, null, session, 400, "Usuario no encontrado");
    }

    if (!credential.isActive) {
      return handleError(res, null, session, 400, "La credencial del Usuario esta inactiva");
    }

    const passwordTemp = process.env.PASSWORD_TEMP;
    const newPass = await encryptPassword(passwordTemp);

    credential.password = newPass;

    await credential.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Contraseña reseteada con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Error al abortar la transacción:", abortError);
      }
    }
    handleError(res, error, session, 500, "Error al resetear la contraseña");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
