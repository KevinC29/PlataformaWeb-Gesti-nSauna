import { required, helpers } from '@vuelidate/validators';

export const createItemTypeValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      description: { required: helpers.withMessage('El campo Descripción es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
      section: { required: helpers.withMessage('El campo Sección es obligatorio.', required), },
    },
  };
};

export const editItemTypeValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      description: { required: helpers.withMessage('El campo Descripción es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Estar Activo es obligatorio.', required), },
      section: { required: helpers.withMessage('El campo Sección es obligatorio.', required), },
    },
  };
};
