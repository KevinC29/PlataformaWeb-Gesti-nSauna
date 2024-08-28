export const handleError = (error) => {
    if (!error || !error.response) {
        console.error('Error no definido o sin respuesta del servidor:', error);
        return;
    }

    const { response } = error;

    if (response) {
        switch (response.status) {
            case 400:
                console.error('Solicitud incorrecta:', response.data.error || response.data.message);
                break;
            case 401:
                console.error('No autorizado:', response.data.error || response.data.message);
                // Aquí podrías redirigir al usuario al login si es necesario
                break;
            case 404:
                console.error('No encontrado:', response.data.error || response.data.message);
                break;
            case 409:
                console.error('Conflicto:', response.data.error || response.data.message);
                break;
            case 500:
                console.error('Error del servidor:', response.data.error || response.data.message);
                break;
            default:
                console.error('Error desconocido:', response.data.error || response.data.message);
        }
    } else if (error.request) {
        console.error('No hay respuesta del servidor:', error.message);
    } else {
        console.error('Error:', error.message);
    }
};
