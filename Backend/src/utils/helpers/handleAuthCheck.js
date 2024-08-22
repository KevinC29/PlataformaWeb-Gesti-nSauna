import { verifyToken, decodeToken } from "./handleTokenJWT.js";
import User from "../../models/userModel.js";

export const checkAuth = (roles) => async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ error: "Autorización requerida" });
    }

    const token = authorizationHeader.split(" ").pop();
    const tokenData = verifyToken(token);
    const decodedToken = decodeToken(token);

    if (!tokenData || !roles.includes(decodedToken.payload.role)) {
      return res.status(403).json({ error: "Acceso denegado. No tienes los permisos necesarios." });
    }

    const user = await User.findById(decodedToken.payload.user).exec();
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    req.currentUser = user;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.status(409).json({ error: "Acceso inválido" });
  }
};

export default checkAuth;
