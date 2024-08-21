const handleError = async (res, error, session = null, statusCode = 500, message = "Error en el servidor") => {
  if (session) {
      try {
          // Solo aborta la transacción si está en una transacción
          if (session.inTransaction()) {
              await session.abortTransaction();
          }
      } catch (abortError) {
          console.error('Error al abortar la transacción:', abortError);
      } finally {
          // Cierra la sesión al final
          session.endSession();
      }
  }
  return res.status(statusCode).json({ error: message });
};


export default handleError;
