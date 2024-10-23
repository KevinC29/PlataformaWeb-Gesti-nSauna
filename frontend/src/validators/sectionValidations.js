import { required } from '@vuelidate/validators';

export const createSectionValidations = () => {
  return {
    state: {
      name: { required },
      isActive: { required },
    },
  };
};

export const editSectionValidations = () => {
  return {
    state: {
      name: { required },
      isActive: { required },
    },
  };
};
