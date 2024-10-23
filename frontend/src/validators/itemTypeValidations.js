import { required } from '@vuelidate/validators';

export const createItemTypeValidations = () => {
  return {
    state: {
      name: { required },
      description: { required },
      isActive: { required },
      section: { required },
    },
  };
};

export const editItemTypeValidations = () => {
  return {
    state: {
      name: { required },
      description: { required },
      isActive: { required },
      section: { required },
    },
  };
};
