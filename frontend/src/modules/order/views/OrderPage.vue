<template>
    <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy"
        :items-per-page="10">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>ÓRDENES</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                    variant="solo-filled" flat hide-details single-line></v-text-field>
                <v-spacer></v-spacer>
                <v-btn class="mb-2" color="primary" dark @click="navigateToCreate">
                    Crear Orden
                </v-btn>
            </v-toolbar>
        </template>

        <!-- Columna de Número de Orden -->
        <template v-slot:[`item.numberOrder`]="{ item }">
            {{ `0${item.numberOrder}` }}
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
            <v-chip :color="item.paymentState === 'paid' ? 'green' : 'orange'" class="text-uppercase" size="small"
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
        ...mapGetters('order', ['orders', 'error', 'success']),
        headers() {
            return [
                { title: 'Balance', key: 'balance' },
                { title: 'Número de Orden', key: 'numberOrder', align: 'start' },
                { title: 'Fecha de Orden', key: 'dateOrder' },
                { title: 'Cliente', key: 'client' },
                { title: 'Total', key: 'total' },
                { title: 'Estado de Pago', key: 'paymentState' },
                { title: 'Acciones', value: 'actions', sortable: false }
            ];
        },
        filteredItems() {
            const filteredOrders = this.orders.filter(order => order.paymentState === 'pending');
            if (!this.search) return filteredOrders;
            const searchLower = this.search.toLowerCase();
            return filteredOrders.filter(order =>
                order.numberOrder.toString().includes(searchLower) ||
                new Date(order.dateOrder).toLocaleDateString('en-GB').includes(searchLower) ||
                order.client.user.name.toLowerCase().includes(searchLower) ||
                order.client.user.lastName.toLowerCase().includes(searchLower)
            );
        }
    },
    methods: {
        ...mapActions('order', ['fetchOrders', 'deleteOrder']),
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
        }
    },
    created() {
        this.fetchOrders();
    }
};
</script>
