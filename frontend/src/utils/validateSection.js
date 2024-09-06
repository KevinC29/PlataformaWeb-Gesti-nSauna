export const nameRules = [
    v => !!v || 'El nombre es requerido',
    v => v.length <= 100 || 'El nombre no puede tener más de 100 caracteres'
  ];