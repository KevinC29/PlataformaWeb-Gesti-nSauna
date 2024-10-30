import { required, helpers } from '@vuelidate/validators';

export const createCommentValidations = () => {
  return {
    state: {
        message: { required: helpers.withMessage('El campo comentario es obligatorio.', required), },
      },
  };
};

