import { required, email as emailValidator, minLength, helpers } from '@vuelidate/validators';

export const createUserValidations = (showPasswordFields) => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required) },
      lastName: { required: helpers.withMessage('El campo Apellido es obligatorio.', required) },
      address: { required: helpers.withMessage('El campo Dirección es obligatorio.', required) },
      phone: {
        phone: helpers.withMessage('El teléfono debe tener al menos 10 dígitos y puede incluir un código de país (Opcional).', (value) => {
          if (!value) return true;
          const phoneRegex = /^(?:\+?\d{1,3})?\s?\d{10,}$/;
          return phoneRegex.test(value);
        }),
      },
      dni: { required: helpers.withMessage('El campo DNI es obligatorio.', required), minLength: minLength(10) },
      email: { email: emailValidator },
      role: { required: helpers.withMessage('El campo Rol es obligatorio.', required) },
      password: {
        required: helpers.withMessage('El campo Contraseña es obligatorio.', requiredIf(showPasswordFields)),
        minLength: minLength(8),
      },
      confirmPassword: {
        required: helpers.withMessage('El campo Confirmar Contraseña es obligatorio.', requiredIf(showPasswordFields)),
        sameAsPassword: helpers.withMessage('Las contraseñas no coinciden', (value, parent) => {
          return value === parent.password;
        }),
      },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required) },
    },
  };
};

function requiredIf(showPasswordFields) {
  return (value) => !showPasswordFields || !!value;
}

export const editUserValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      lastName: { required: helpers.withMessage('El campo Apellido es obligatorio.', required), },
      address: { required: helpers.withMessage('El campo Dirección es obligatorio.', required), },
      phone: {
        phone: helpers.withMessage('El teléfono debe tener al menos 10 dígitos y puede incluir un código de país (Opcional).', (value) => {
          if (!value) return true;
          const phoneRegex = /^(?:\+?\d{1,3})?\s?\d{10,}$/;
          return phoneRegex.test(value);
        }),
        minLength: minLength(10),
      },
      dni: { required: helpers.withMessage('El campo DNI es obligatorio.', required), minLength: minLength(10) },
      email: { email: emailValidator },
      role: { required: helpers.withMessage('El campo Rol es obligatorio.', required), },
      isActive: { required: helpers.withMessage('El campo Activar es obligatorio.', required), },
    },
  };
};
