export const handleError = (error) => {
    if (!error || !error.response) {
        return ('Error no definido o sin respuesta del servidor:', error);
    }

    const { response } = error;

    if (response) {
        switch (response.status) {
            case 400:
                return ('Solicitud incorrecta:', response.data.error || response.data.message);
            case 401:
                return ('No autorizado:', response.data.error || response.data.message);
            case 404:
                return ('No encontrado:', response.data.error || response.data.message);
            case 409:
                return ('Conflicto:', response.data.error || response.data.message);
            case 500:
                return ('Error del servidor:', response.data.error || response.data.message);
            default:
                return ('Error desconocido:', response.data.error || response.data.message);
        }
    } else if (error.request) {
        return ('No hay respuesta del servidor:', error.message);
    } else {
        return ('Error:', error.message);
    }
};
