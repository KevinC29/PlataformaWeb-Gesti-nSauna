<template>
    <button @click="toggleStatus">
      {{ status ? 'Deactivate' : 'Activate' }}
    </button>
  </template>
  
  <script>
  export default {
    props: {
      status: {
        type: Boolean,
        required: true
      }
    },
    emits: ['update'],
    setup(props, { emit }) {
      const toggleStatus = () => {
        emit('update', !props.status);
      };
  
      return { toggleStatus };
    }
  }
  </script>
  