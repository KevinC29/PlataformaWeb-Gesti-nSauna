<template>
    <v-navigation-drawer>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :link="item.link" :title="item.title">
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  export default {
    name: 'BaseNavigationDrawer',
    props: {
      items: {
        type: Array,
        default: () => []
      }
    }
  }
  </script>