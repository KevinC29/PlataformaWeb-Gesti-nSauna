import { required, minValue, helpers  } from '@vuelidate/validators';

export const createClientValidations = () => {
  return {
    state: {
      user: { required: helpers.withMessage('El campo Usuario es obligatorio.', required), },
    },
  };
};

export const editClientValidations = () => {
  return {
    state: {
      account: { required: helpers.withMessage('El campo Cuenta es obligatoria.', required), minValue: minValue(0) },
      accountState: { required: helpers.withMessage('El campo Estado de la cuenta es obligatorio.', required), },
    },
  };
};
