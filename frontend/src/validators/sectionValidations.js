import { required, helpers } from '@vuelidate/validators';

export const createSectionValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
    },
  };
};

export const editSectionValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
    },
  };
};
