<template>
  <div>
    <form @submit.prevent="submit">
      <input v-model="client.user" placeholder="User ID" required />
      <input v-model="client.account" placeholder="Account" />
      <input v-model="client.accountState" placeholder="Account State" />
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { saveClient } from '@/api/clientService';

export default {
  props: {
    clientData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const client = ref({ ...props.clientData });

    const submit = async () => {
      try {
        await saveClient(client.value);
        // Handle success, e.g., redirect or show a success message
      } catch (error) {
        // Handle error
      }
    };

    return { client, submit };
  }
};
</script>
