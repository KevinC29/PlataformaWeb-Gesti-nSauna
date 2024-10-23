import { required, minLength, email } from '@vuelidate/validators';

export const editCredentialValidations = () => {
  return {
    state: {
      name: { required },
      lastName: { required },
      dni: { required, minLength: minLength(10) },
      email: { email },
    },
    credential: {
      password: { required },
      newPassword: { required, minLength: minLength(6) },
      confirmPassword: { required, minLength: minLength(6) },
    },
  };
};

