<template>
  <v-btn :color="color" :icon="icon" :class="customClass">
    <v-icon v-if="icon">{{ icon }}</v-icon>
    <span>{{ text }}</span>
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    text: {
      type: String,
      default: 'Button'
    },
    icon: {
      type: String,
      default: '$vuetify'
    },
    customClass: {
      type: String,
      default: ''
    }
  }
};
</script>