import { required } from '@vuelidate/validators';

export const createRoleValidations = () => {
  return {
    state: {
      name: { required },
      isActive: { required },
    },
  };
};

export const editRoleValidations = () => {
  return {
    state: {
      name: { required },
      isActive: { required },
    },
  };
};
