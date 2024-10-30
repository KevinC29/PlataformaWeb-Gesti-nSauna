<template>
    <v-sheet class="mx-auto custom-form" width="1000">
        <!-- Título centrado para el formulario -->
        <h2 class="text-center mb-4">Editar Orden</h2>
        <v-form @submit.prevent="submitForm">
            <v-row>
                <v-col cols="12">
                    <v-container>
                        <!-- Contenedor Superior: Detalles de la Orden -->
                        <v-row>
                            <v-col cols="8">
                                <h2 class="text-center mb-4">Detalles de la Orden</h2>
                                <label class="field-label">Número de Orden</label>
                                <v-text-field v-model="state.numberOrder" readonly bg-color="cyan-lighten-5"
                                    color="#388e3c" rounded variant="solo-filled"></v-text-field>
                                <label class="field-label">Fecha de la Orden</label>
                                <v-text-field v-model="state.dateOrder" type="date" readonly bg-color="cyan-lighten-5"
                                    color="#388e3c" rounded variant="solo-filled"></v-text-field>
                                <!-- Campo Balance -->
                                <label class="field-label">Saldo Inicial del Cliente</label>
                                <v-text-field v-model="state.balance"
                                    :error-messages="v$.state.balance.$errors.map(e => e.$message)" type="number"
                                    required min="0" step="0.01" @blur="v$.state.balance.$touch"
                                    @input="v$.state.balance.$touch" @change="formatBalance"
                                    prepend-inner-icon="mdi-currency-usd" bg-color="cyan-lighten-5" color="#388e3c"
                                    rounded variant="solo-filled"></v-text-field>
                                <label class="field-label">Cliente</label>
                                <v-text-field v-model="state.client" readonly bg-color="cyan-lighten-5" color="#388e3c"
                                    rounded variant="solo-filled"></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <h2 class="text-center mb-4">Resumen de la Orden</h2>
                                <label class="field-label">Cuenta de Consumo</label>
                                <v-text-field v-model="formattedConsumptionAccount" type="number" readonly required
                                    prepend-inner-icon="mdi-currency-usd" bg-color="cyan-lighten-5" color="#388e3c"
                                    rounded variant="solo-filled">
                                </v-text-field>
                                <label class="field-label">Total</label>
                                <v-text-field v-model="formattedTotal" type="number" readonly required
                                    prepend-inner-icon="mdi-currency-usd" bg-color="cyan-lighten-5" color="#388e3c"
                                    rounded variant="solo-filled">
                                </v-text-field>
                                <label class="field-label">Estado de Pago</label>
                                <v-select v-model="state.paymentState"
                                    :error-messages="v$.state.paymentState.$errors.map(e => e.$message)"
                                    :items="paymentStates" item-text="text" item-value="value" required
                                    @change="v$.state.paymentState.$touch" @blur="v$.state.paymentState.$touch"
                                    bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled">
                                </v-select>
                                <label class="field-label">Método de Pago</label>
                                <v-select v-model="state.paymentMethod"
                                    :error-messages="v$.state.paymentMethod.$errors.map(e => e.$message)"
                                    :items="paymentMethod" item-text="text" item-value="value" required
                                    @change="v$.state.paymentMethod.$touch" @blur="v$.state.paymentMethod.$touch"
                                    bg-color="cyan-lighten-5" color="#388e3c" rounded variant="solo-filled">
                                </v-select>
                            </v-col>
                        </v-row>

                        <!-- Contenedor Inferior: Detalles de Ítems y Resumen de la Orden -->
                        <v-row>
                            <v-col cols="12">
                                <h2 class="text-center mb-4">Detalles de Ítems</h2>
                                <label class="field-label">Buscar Ítem</label>
                                <v-autocomplete v-model="selectedItem" :items="filteredItems"
                                    v-model:search-input="searchItem" item-title="name" dense :items-per-page="5"
                                    return-object @update:modelValue="selectItemOrder" @input="filterItems"
                                    bg-color="cyan-lighten-5" color="#388e3c" rounded
                                    variant="solo-filled"></v-autocomplete>
                                <v-container>
                                    <v-data-table :headers="detailOrderHeaders" :items="detailsOrderList" item-key="_id"
                                        class="elevation-1 bordered-table"
                                        :no-data-text="'No existen items en la orden.'">
                                        <template v-slot:top>
                                            <v-toolbar class="toolbar-container">
                                                <v-toolbar-title class="text-center"><strong>Lista de
                                                        Detalles</strong></v-toolbar-title>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:[`item.cantidad`]="{ item }">
                                            <!-- Campo editable para cantidad -->
                                            <v-text-field v-model="item.cantidad" type="number" hide-details
                                                density="compact" variant="solo-filled" min="1" step="1"
                                                @blur="editDetailOrder(item)" @input="preventNegativeOrZero(item)"
                                                style="width: 80px;" />
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
                                </v-container>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
            <!-- Botones -->
            <v-row justify="end" class="mb-4">
                <v-btn class="custom-submit-btn" type="submit">
                    Guardar
                </v-btn>
                <v-btn class="custom-cancel-btn" @click="cancel">
                    Cancelar
                </v-btn>
            </v-row>

            <!-- Alerta de errores generales -->
            <v-alert v-if="errorMessage" type="error" class="mt-3" border>
                {{ errorMessage }}
            </v-alert>

            <!-- Alerta de éxito general -->
            <v-alert v-if="successMessage" type="success" class="mt-3" border>
                {{ successMessage }}
            </v-alert>
        </v-form>
    </v-sheet>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { editOrderValidations } from '@/validators/orderValidations.js';
import '@/assets/styles/buttons.css';
import '@/assets/styles/dataTable.css';
import '@/assets/styles/forms.css';

export default {
    data() {
        return {
            state: {
                dateOrder: '',
                numberOrder: '',
                balance: 0,
                client: '',
                consumptionAccount: 0,
                total: 0,
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
                { title: 'Cantidad', value: 'cantidad', headerProps: { class: 'font-weight-bold' } },
                { title: 'Ítem', value: 'item.name', headerProps: { class: 'font-weight-bold' } },
                { title: 'Precio Ítem', value: 'item.price', headerProps: { class: 'font-weight-bold' } },
                { title: 'Subtotal', value: 'price', headerProps: { class: 'font-weight-bold' } },
                { title: 'Acciones', value: 'actions', sortable: false, headerProps: { class: 'font-weight-bold' } },
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
                const formattedValue = Math.max(0, parseFloat(this.state.balance)).toFixed(2);
                this.state.balance = isNaN(formattedValue) ? '0.00' : formattedValue;
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
        formattedSuccess(success, message, value) {
            if (value) {
                this.successMessage = success || message;
                setTimeout(() => {
                    this.successMessage = '';
                    this.$router.push({ name: 'OrderList' });
                }, 2000);
            } else {
                this.successMessage = success || message;
                setTimeout(() => {
                    this.successMessage = '';
                }, 2000);
            }

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
                this.formattedSuccess(this.successDetail, "Detalle de orden modificado correctamente", false);
                this.fetchData();
            } catch (error) {
                this.formattedError(this.errorDetail, "Error al editar el ítem");
            }
        },
        async confirmDeleteDetailOrder(item) {
            if (item) {
                try {
                    await this.deleteDetailOrder(item._id);
                    this.formattedSuccess(this.successDetail, "Detalle de orden eliminado correctamente", false);
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
                this.formattedSuccess(this.successDetail, "Detalle de orden creado correctamente", false);
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
                this.formattedSuccess(this.success, "Orden actualizada correctamente", true);
            } catch (error) {
                this.formattedError(this.error, "Error al actualizar la orden");
            }
        },
        cancel() {
            this.$router.push({ name: 'OrderList' });
        },
    },
    validations() {
        return editOrderValidations();
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