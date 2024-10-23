import { required } from '@vuelidate/validators';

export const createCommentValidations = () => {
  return {
    state: {
        message: { required },
      },
  };
};

