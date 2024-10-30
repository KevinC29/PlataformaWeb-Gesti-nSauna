import { required, minValue, helpers } from '@vuelidate/validators';

export const createOrderValidations = () => {
  return {
    state: {
        numberOrder: { required: helpers.withMessage('El campo Numero de Orden es obligatorio.', required) },
        balance: { required: helpers.withMessage('El campo Saldo Inicial es obligatorio.', required), minValue: minValue(0) },
        client: { required: helpers.withMessage('El campo Cliente es obligatorio.', required), },
    },
  };
};

export const editOrderValidations = () => {
  return {
    state: {
        balance: { required: helpers.withMessage('El campo Saldo es obligatorio.', required), minValue: minValue(0) },
        consumptionAccount: { required: helpers.withMessage('El campo Cuenta de Consumo es obligatorio.', required), minValue: minValue(0) },
        total: { required: helpers.withMessage('El campo Total es obligatorio.', required), minValue: minValue(0) },
        paymentState: { required: helpers.withMessage('El campo Estado de Pago es obligatorio.', required) },
        paymentMethod: { required: helpers.withMessage('El campo Método de Pago es obligatorio.', required) },
    },
  };
};
