import { required, minValue, helpers } from '@vuelidate/validators';

export const createItemValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      description: { required: helpers.withMessage('El campo Descripción es obligatorio.', required), },
      price: { required: helpers.withMessage('El campo Precio es obligatorio.', required), minValue: minValue(0) },
      imageUrl: { required: helpers.withMessage('El campo URL de la Imagen es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
      itemType: { required: helpers.withMessage('El campo Tipo de Ítem es obligatorio.', required), },
    },
  };
};

export const editItemValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      description: { required: helpers.withMessage('El campo Descripción es obligatorio.', required), },
      price: { required: helpers.withMessage('El campo Precio es obligatorio.', required), minValue: minValue(0) },
      imageUrl: { required: helpers.withMessage('El campo URL de la Imagen es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
      itemType: { required: helpers.withMessage('El campo Tipo de Ítem es obligatorio.', required), },
    },
  };
};
