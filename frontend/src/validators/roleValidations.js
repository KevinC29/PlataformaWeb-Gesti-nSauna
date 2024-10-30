import { required, helpers } from '@vuelidate/validators';

export const createRoleValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
    },
  };
};

export const editRoleValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
    },
  };
};
