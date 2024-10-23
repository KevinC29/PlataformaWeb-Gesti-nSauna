import { required, minValue } from '@vuelidate/validators';

export const createOrderValidations = () => {
  return {
    state: {
        numberOrder: { required },
        balance: { required, minValue: minValue(0) },
        client: { required },
    },
  };
};

export const editOrderValidations = () => {
  return {
    state: {
        balance: { required, minValue: minValue(0) },
        consumptionAccount: { required, minValue: minValue(0) },
        total: { required, minValue: minValue(0) },
        paymentState: { required },
        paymentMethod: { required },
    },
  };
};
