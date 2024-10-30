import { required, minLength, email, helpers } from '@vuelidate/validators';

export const editCredentialValidations = () => {
  return {
    state: {
      name: { required: helpers.withMessage('El campo Nombre es obligatorio.', required), },
      lastName: { required: helpers.withMessage('El campo Apellido es obligatorio.', required), },
      dni: { required: helpers.withMessage('El campo DNI es obligatorio.', required), minLength: minLength(10) },
      email: { email },
    },
    credential: {
      password: { required: helpers.withMessage('El campo Contraseña Actual es obligatorio.', required), },
      newPassword: { required: helpers.withMessage('El campo Nueva Contraseña es obligatorio.', required), minLength: minLength(6) },
      confirmPassword: { required: helpers.withMessage('El campo Repetir Nueva Contraseña es obligatorio.', required), minLength: minLength(6) },
    },
  };
};

