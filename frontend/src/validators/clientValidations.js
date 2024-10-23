import { required, minValue} from '@vuelidate/validators';

export const createClientValidations = () => {
  return {
    state: {
      user: { required },
    },
  };
};

export const editClientValidations = () => {
  return {
    state: {
      account: { required, minValue: minValue(0) },
      accountState: { required },
    },
  };
};
