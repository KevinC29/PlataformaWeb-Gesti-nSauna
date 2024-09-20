export const handleSuccess = (data) => {
    if (!data) {
        return 'No hay datos disponibles.';
    }

    const { status, message } = data;

    switch (status) {
        case 200:
            return message || 'Operación realizada con éxito.';
        case 201:
            return message || 'Recurso creado con éxito.';
        case 204:
            return message || 'Operación exitosa sin contenido.';
        default:
            return message || 'Operación exitosa.';
    }
};
