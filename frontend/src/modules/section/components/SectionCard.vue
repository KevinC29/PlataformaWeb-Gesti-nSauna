<template>
    <div class="section-card">
      <h3>{{ section.name }}</h3>
      <p>Status: {{ section.isActive ? 'Active' : 'Inactive' }}</p>
      <router-link :to="{ name: 'SectionDetail', params: { id: section._id } }">View Details</router-link>
      <router-link :to="{ name: 'SectionEdit', params: { id: section._id } }">Edit</router-link>
      <router-link :to="{ name: 'SectionDelete', params: { id: section._id } }">Delete</router-link>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      section: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .section-card {
    border: 1px solid #ddd;
    padding: 16px;
    margin-bottom: 16px;
  }
  </style>
  