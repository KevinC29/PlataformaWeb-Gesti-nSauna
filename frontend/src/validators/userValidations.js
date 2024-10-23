import { required, email as emailValidator, minLength, helpers } from '@vuelidate/validators';

export const createUserValidations = () => {
  return {
    state: {
      name: { required },
      lastName: { required },
      address: { required },
      phone: {
        phone: helpers.withMessage('El teléfono debe tener al menos 10 dígitos y puede incluir un código de país opcional', (value) => {
          if (!value) return true; // No valida si el campo está vacío
          const phoneRegex = /^(?:\+?\d{1,3})?\s?\d{10,}$/;
          return phoneRegex.test(value);
        }),
      },
      dni: { required, minLength: minLength(10) },
      email: { email: emailValidator },
      role: { required },
      password: {
        required: true,
        minLength: minLength(8),
      },
      confirmPassword: {
        required: true,
        sameAsPassword: helpers.withMessage('Las contraseñas no coinciden', (value, parent) => {
          return value === parent.password;
        }),
      },
      isActive: { required },
    },
  };
};
export const editUserValidations = () => {
  return {
    state: {
      name: { required },
      lastName: { required },
      address: { required },
      phone: {
        phone: helpers.withMessage('El teléfono debe tener al menos 10 dígitos y puede incluir un código de país opcional', (value) => {
          if (!value) return true;
          const phoneRegex = /^(?:\+?\d{1,3})?\s?\d{10,}$/;
          return phoneRegex.test(value);
        }),
        minLength: minLength(10),
      },
      dni: { required, minLength: minLength(10) },
      email: { email: emailValidator },
      role: { required },
      isActive: { required },
    },
  };
};
