import { required, minValue } from '@vuelidate/validators';

export const createItemValidations = () => {
  return {
    state: {
      name: { required },
      description: { required },
      price: { required, minValue: minValue(0) },
      imageUrl: { required },
      isActive: { required },
      itemType: { required },
    },
  };
};

export const editItemValidations = () => {
  return {
    state: {
      name: { required },
      description: { required },
      price: { required, minValue: minValue(0) },
      imageUrl: { required },
      isActive: { required },
      itemType: { required },
    },
  };
};
