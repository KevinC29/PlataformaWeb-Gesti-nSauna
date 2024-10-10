<template>
    <form @submit.prevent="submitForm">
        <v-container>
            <!-- Contenedor Superior: Detalles de la Orden -->
            <v-row>
                <v-col cols="12">
                    <v-card class="mb-4">
                        <v-card-title>Detalles de la Orden</v-card-title>
                        <v-card-text>
                            <v-text-field v-model="state.numberOrder" label="Número de Orden" readonly></v-text-field>
                            <v-text-field v-model="state.dateOrder" label="Fecha de Orden" type="date"
                                readonly></v-text-field>
                            <!-- Campo Balance -->
                            <v-text-field v-model="state.balance"
                                :error-messages="v$.state.balance.$errors.map(e => e.$message)" label="Saldo"
                                type="number" required min="0" step="0.01" @blur="v$.state.balance.$touch"
                                @input="v$.state.balance.$touch" @change="formatBalance"
                                prepend-icon="mdi-currency-usd"></v-text-field>
                            <v-text-field v-model="state.client" label="Cliente" readonly></v-text-field>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Contenedor Inferior: Detalles de Ítems y Resumen de la Orden -->
            <v-row>
                <v-col cols="8">
                    <v-card>
                        <v-card-title>Detalles de Ítems</v-card-title>
                        <v-card-text>
                            <v-autocomplete v-model="selectedItem" :items="filteredItems"
                                v-model:search-input="searchItem" item-title="name" label="Buscar Ítem" dense
                                :items-per-page="5" return-object @update:modelValue="selectItemOrder"
                                @input="filterItems"></v-autocomplete>

                            <v-data-table :headers="detailOrderHeaders" :items="detailsOrderList" item-key="_id"
                                class="elevation-1" :no-data-text="'No existen items en la orden.'">
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title>Lista de Detalles</v-toolbar-title>
                                    </v-toolbar>
                                </template>
                                <template v-slot:[`item.cantidad`]="{ item }">
                                    <!-- Campo editable para cantidad -->
                                    <v-text-field v-model="item.cantidad" type="number" min="1" step="1"
                                        @blur="editDetailOrder(item)" @input="preventNegativeOrZero(item)" />
                                </template>
                                <!-- Columna de Precio con símbolo de dólar -->
                                <template v-slot:[`item.price`]="{ item }">
                                    <span>$ {{ item.price.toFixed(2) }}</span>
                                </template>
                                <!-- Columna de Precio con símbolo de dólar -->
                                <template v-slot:[`item.item.price`]="{ item }">
                                    <span>$ {{ item.item.price.toFixed(2) }}</span>
                                </template>

                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-icon size="small" @click="confirmDeleteDetailOrder(item)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-icon>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="4">
                    <v-card>
                        <v-card-title>Resumen de la Orden</v-card-title>
                        <v-card-text>
                            <v-text-field v-model="formattedConsumptionAccount" label="Cuenta de Consumo" type="number"
                                readonly required>
                            </v-text-field>

                            <v-text-field v-model="formattedTotal" label="Total" type="number" readonly required>
                            </v-text-field>

                            <v-select v-model="state.paymentState" :items="paymentStates" item-text="text"
                                item-value="value" label="Estado de Pago" required>
                            </v-select>

                            <v-select v-model="state.paymentMethod" :items="paymentMethod" item-text="text"
                                item-value="value" label="Método de Pago" required>
                            </v-select>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Alerta de errores -->
            <v-alert v-if="errorMessage" type="error" dismissible>
                {{ errorMessage }}
            </v-alert>

            <!-- Alerta de éxito -->
            <v-alert v-if="successMessage" type="success" dismissible>
                {{ successMessage }}
            </v-alert>

            <!-- Botones -->
            <v-btn class="me-4" color="primary" type="submit">
                Guardar
            </v-btn>
            <v-btn color="secondary" @click="cancel">
                Cancelar
            </v-btn>
        </v-container>
    </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';

export default {
    data() {
        return {
            state: {
                dateOrder: '',
                numberOrder: '',
                balance: 0.00,
                client: '',
                consumptionAccount: 0.00,
                total: 0.00,
                paymentState: '',
                paymentMethod: '',
            },
            detailsOrderList: [],
            paymentStates: [
                { title: 'Pagado', value: 'paid' },
                { title: 'Pendiente', value: 'pending' }
            ],
            paymentMethod: [
                { title: 'Efectivo', value: 'cash' },
                { title: 'Tarjeta de Crédito/Débito', value: 'credit/debit card' },
                { title: 'Dinero Electrónico', value: 'electronic money' },
                { title: 'Otros', value: 'other' },
            ],
            searchItem: '',
            filteredItems: [],
            itemsList: [],
            selectedItem: null,
            errorMessage: '',
            successMessage: '',
            detailOrderHeaders: [
                { title: 'Cantidad', value: 'cantidad' },
                { title: 'Ítem', value: 'item.name' },
                { title: 'Precio Ítem', value: 'item.price' },
                { title: 'Subtotal', value: 'price' },
                { title: 'Acciones', value: 'actions', sortable: false },
            ],
        };
    },
    computed: {
        ...mapGetters('order', ['order', 'items', 'error', 'success', 'detailsOrder']),
        ...mapGetters('detailOrder', ['errorDetail', 'successDetail']),

        formattedConsumptionAccount() {
            return parseFloat(this.state.consumptionAccount).toFixed(2);
        },
        formattedTotal() {
            return parseFloat(this.state.total).toFixed(2);
        },
    },
    methods: {
        ...mapActions('order', ['updateOrder', 'fetchOrder', 'fetchAndSetItems', 'fetchAndSetDetailsOrder']),
        ...mapActions('detailOrder', ['createDetailOrder', 'updateDetailOrder', 'deleteDetailOrder']),

        formatBalance() {
            if (this.state.balance !== null && this.state.balance !== '') {
                this.state.balance = parseFloat(this.state.balance).toFixed(2);
            }
        },
        preventNegativeOrZero(item) {
            if (item.cantidad <= 0) {
                item.cantidad = 1;
            }
        },
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
        roundToTwoDecimals(num) {
            return Math.round(num * 100) / 100;
        },
        async fetchData() {
            try {
                await this.fetchOrder(this.$route.params.id);
                const order = this.order;
                this.state = {
                    dateOrder: order.dateOrder.split('T')[0],
                    numberOrder: order.numberOrder,
                    balance: order.balance,
                    client: `${order.client.user.name} ${order.client.user.lastName}`,
                    consumptionAccount: order.consumptionAccount,
                    total: order.total,
                    paymentState: order.paymentState,
                    paymentMethod: order.paymentMethod,
                };

                await this.fetchAndSetDetailsOrder(this.$route.params.id);
                this.detailsOrderList = this.detailsOrder;

                await this.fetchAndSetItems()
                this.itemsList = this.items;
                this.filteredItems = this.itemsList;

            } catch (error) {
                this.formattedError(this.error, "Error al cargar los datos");
            }
        },
        filterItems() {
            const searchTerm = this.searchItem.toLowerCase();
            this.filteredItems = this.itemsList.filter(item =>
                item.name.toLowerCase().includes(searchTerm)
            );
        },
        async editDetailOrder(item) {
            if (!item || item.cantidad <= 0) return;
            const detailOrderData = {
                cantidad: Number(item.cantidad),
                price: Number(item.item.price * item.cantidad),
                order: item.order,
            };
            try {
                await this.updateDetailOrder({ id: item._id, detailOrderData });
                this.formattedSuccess(this.successDetail, "Detalle de orden modificado correctamente");
                this.fetchData();
            } catch (error) {
                this.formattedError(this.errorDetail, "Error al editar el ítem");
            }
        },
        async confirmDeleteDetailOrder(item) {
            if (item) {
                try {
                    await this.deleteDetailOrder(item._id);
                    this.formattedSuccess(this.successDetail, "Detalle de orden eliminado correctamente");
                    this.fetchData();
                } catch (error) {
                    this.formattedError(this.errorDetail, "Error al eliminar el ítem");
                }
            }
        },
        async selectItemOrder(item) {
            if (!item) return;
            const cantidadItem = 1;
            const detailOrder = {
                item: item._id,
                cantidad: cantidadItem,
                price: item.price * cantidadItem,
                order: this.$route.params.id,
            };
            try {
                await this.createDetailOrder(detailOrder);
                this.searchItem = '';
                this.selectedItem = null;
                this.formattedSuccess(this.successDetail, "Detalle de orden creado correctamente");
                this.fetchData();
            } catch (error) {
                this.formattedError(this.errorDetail, "Error al seleccionar el ítem");
            }
        },
        async submitForm() {
            this.v$.$touch();
            if (this.v$.$invalid) return;
            const orderData = {
                consumptionAccount: this.roundToTwoDecimals(Number(this.state.consumptionAccount)) || 0.00,
                balance: this.roundToTwoDecimals(Number(this.state.balance)) || 0.00,
                total: this.roundToTwoDecimals(Number(this.state.total)) || 0.00,
                paymentState: this.state.paymentState,
                paymentMethod: this.state.paymentMethod,
            };
            try {
                await this.updateOrder({ id: this.$route.params.id, orderData });
                this.formattedSuccess(this.success, "Orden actualizada correctamente");
                this.$router.push({ name: 'OrderList' });
            } catch (error) {
                this.formattedError(this.error, "Error al actualizar la orden");
            }
        },
        cancel() {
            this.$router.push({ name: 'OrderList' });
        },
    },
    validations() {
        return {
            state: {
                balance: { required, minValue: minValue(0) },
                consumptionAccount: { required, minValue: minValue(0) },
                total: { required, minValue: minValue(0) },
                paymentState: { required },
                paymentMethod: { required },
            },
        };
    },
    setup() {
        const v$ = useVuelidate();
        return { v$ };
    },
    async created() {
        await this.fetchData();
    }
};
</script>