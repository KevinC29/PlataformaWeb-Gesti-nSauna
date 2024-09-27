const handleError = async (res, error, session = null, statusCode = 500, message = "Error en el servidor") => {
    if (session && typeof session.endSession === 'function') {
        try {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
        } catch (abortError) {
            console.error('Error al abortar la transacción:', abortError);
        } finally {
            await session.endSession(); 
        }
    }
    return res.status(statusCode).json({ error: message });
  };
  
  export default handleError;
