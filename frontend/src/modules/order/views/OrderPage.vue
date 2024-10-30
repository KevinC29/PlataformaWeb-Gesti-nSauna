<template>
    <v-container class="my-4">
        <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy" :items-per-page="10"
            class="bordered-table">
            <template v-slot:top>
                <v-toolbar class="toolbar-container">
                    <v-toolbar-title><strong>ÓRDENES</strong></v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                        variant="solo-filled" hide-details single-line></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn class="ml-10 mr-10 custom-create-btn rounded-lg" @click="navigateToCreate">
                        Crear Orden
                    </v-btn>
                </v-toolbar>
            </template>

            <!-- Columna de Número de Llave -->
            <template v-slot:[`item.textInput`]="{ item }">
                <v-text-field v-model="numberKeys[item._id]" type="text" hide-details density="compact"
                    variant="solo-filled" @input="updateTextInput(item._id)"></v-text-field>
            </template>

            <!-- Columna de Número de Orden -->
            <template v-slot:[`item.numberOrder`]="{ item }">
                {{ `00${item.numberOrder}` }}
            </template>

            <!-- Columna de Fecha de Orden -->
            <template v-slot:[`item.dateOrder`]="{ item }">
                {{ new Date(item.dateOrder).toLocaleDateString() }}
            </template>

            <!-- Columna de Cliente -->
            <template v-slot:[`item.client`]="{ item }">
                {{ item.client.user ? `${item.client.user.name} ${item.client.user.lastName}` : 'N/A' }}
            </template>

            <!-- Columna de Balance -->
            <template v-slot:[`item.balance`]="{ item }">
                ${{ item.balance.toFixed(2) }}
            </template>

            <!-- Columna de Total -->
            <template v-slot:[`item.total`]="{ item }">
                ${{ item.total.toFixed(2) }}
            </template>

            <!-- Columna de Estado de Pago -->
            <template v-slot:[`item.paymentState`]="{ item }">
                <v-chip :color="item.paymentState === 'paid' ? 'green' : 'orange'" class="text-uppercase"
                    label>
                    {{ item.paymentState === 'paid' ? 'Pagada' : 'Pendiente' }}
                </v-chip>
            </template>

            <!-- Columnas de acciones -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="me-2" size="small" @click="navigateToEdit(item)">
                    mdi-pencil
                </v-icon>
                <v-icon size="small" @click="confirmDelete(item)">
                    mdi-delete
                </v-icon>
            </template>

            <!-- Sin datos -->
            <template v-slot:no-data>
                <v-alert type="info" class="mx-4 my-4" border="left" elevation="2">
                    No hay órdenes pendientes.
                </v-alert>
            </template>
        </v-data-table>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title class="text-h5">
                ¿Estás seguro de querer eliminar esta orden?
            </v-card-title>
            <v-alert v-if="errorMessage" type="error" class="mt-3">
                {{ errorMessage }}
            </v-alert>
            <v-alert v-if="successMessage" type="success" class="mt-3">
                {{ successMessage }}
            </v-alert>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
                    Cancelar
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
                    Eliminar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import '@/assets/styles/dataTable.css';
import '@/assets/styles/buttons.css';

export default {
    data() {
        return {
            sortBy: [{ key: 'numberOrder', order: 'asc' }],
            search: '',
            dialogDelete: false,
            editedItem: null,
            errorMessage: '',
            successMessage: '',
        };
    },
    computed: {
        ...mapGetters('order', ['orders', 'error', 'success', 'numberKeys']),
        headers() {
            return [
                { title: 'N° de Llave', key: 'textInput', headerProps: { class: 'font-weight-bold' } },
                { title: 'Balance', key: 'balance', headerProps: { class: 'font-weight-bold' } },
                { title: 'Número de Orden', key: 'numberOrder', headerProps: { class: 'font-weight-bold' } },
                { title: 'Fecha de Orden', key: 'dateOrder', headerProps: { class: 'font-weight-bold' } },
                { title: 'Cliente', key: 'client', headerProps: { class: 'font-weight-bold' } },
                { title: 'Total', key: 'total', headerProps: { class: 'font-weight-bold' } },
                { title: 'Estado de Pago', key: 'paymentState', headerProps: { class: 'font-weight-bold' } },
                { title: 'Acciones', value: 'actions', sortable: false, headerProps: { class: 'font-weight-bold' } }
            ];
        },
        filteredItems() {
            const filteredOrders = this.orders.filter(order => order.paymentState === 'pending');
            if (!this.search) return filteredOrders;
            const searchLower = this.search.toLowerCase();
            return filteredOrders.filter(order => {
                this.numberKeys[order._id] = this.numberKeys[order._id] || '';
                return (
                    order.numberOrder.toString().includes(searchLower) ||
                    new Date(order.dateOrder).toLocaleDateString('en-GB').includes(searchLower) ||
                    order.client.user.name.toLowerCase().includes(searchLower) ||
                    order.client.user.lastName.toLowerCase().includes(searchLower)
                );
            });
        }
    },
    methods: {
        ...mapActions('order', ['fetchOrders', 'deleteOrder', 'setNumberKeyText', 'loadNumberKeys']),
        formattedError(error, message) {
            this.errorMessage = error || message;
            setTimeout(() => {
                this.errorMessage = '';
            }, 2000);
        },
        formattedSuccess(success, message) {
            this.successMessage = success || message;
            setTimeout(() => {
                this.successMessage = '';
            }, 2000);
        },
        navigateToCreate() {
            this.$router.push({ name: 'OrderCreate' });
        },
        navigateToEdit(order) {
            this.$router.push({ name: 'OrderEdit', params: { id: order._id } });
        },
        async confirmDelete(order) {
            this.editedItem = order;
            this.dialogDelete = true;
        },
        async deleteItemConfirm() {
            if (this.editedItem) {
                try {
                    await this.deleteOrder(this.editedItem._id);
                    this.formattedSuccess(this.success, "Orden eliminada con éxito");
                    this.dialogDelete = false;
                    this.fetchOrders();
                } catch (error) {
                    this.formattedError(this.error, "Error al eliminar la orden");
                }
            }
        },
        closeDelete() {
            this.dialogDelete = false;
        },
        async updateTextInput(orderId) {
            const text = this.numberKeys[orderId];
            await this.setNumberKeyText({ orderId, text });
        }
    },
    created() {
        this.fetchOrders();
        this.loadNumberKeys();
    }
};
</script>
