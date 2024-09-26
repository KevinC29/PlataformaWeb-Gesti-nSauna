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
                            <v-autocomplete v-model="selectedItem" :items="filteredItems" item-value="_id"
                                item-title="name" label="Buscar Ítem" dense :items-per-page="5"
                                @update:modelValue="selectItemOrder"></v-autocomplete>

                            <v-data-table :headers="detailOrderHeaders" :items="detailsOrderList" item-key="_id"
                                class="elevation-1" :no-data-text="'No existen items en la orden.'">
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title>Lista de Detalles</v-toolbar-title>
                                    </v-toolbar>
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-icon class="me-2" size="small" @click="editDetailOrder(item)">
                                        mdi-pencil
                                    </v-icon>
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
                            <v-text-field v-model="state.consumptionAccount" label="Cuenta de Consumo" type="number"
                                readonly required></v-text-field>
                            <v-text-field v-model="state.total" label="Total" type="number" readonly
                                required></v-text-field>
                            <v-select v-model="state.paymentState" :items="paymentStates" label="Estado de Pago"
                                required></v-select>
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
            },
            detailsOrderList: [],
            paymentStates: ['Pagado', 'Pendiente'],
            searchItem: '',
            filteredItems: [],
            itemsList: [],
            selectedItem: null,
            errorMessage: '',
            successMessage: '',
            editedDetailOrder: null,
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
    },
    methods: {
        ...mapActions('order', ['updateOrder', 'fetchOrder', 'fetchAndSetItems', 'fetchAndSetDetailsOrder']),
        ...mapActions('detailOrder', ['createDetailOrder', 'updateDetailOrder', 'deleteDetailOrder']),

        formatBalance() {
            if (this.state.balance !== null && this.state.balance !== '') {
                this.state.balance = parseFloat(this.state.balance).toFixed(2);
            }
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
                    paymentState: order.paymentState === 'paid' ? 'Pagada' : 'Pendiente',
                };

                await this.fetchAndSetDetailsOrder(this.$route.params.id);
                this.detailsOrderList = this.detailsOrder;

                await this.fetchAndSetItems()
                this.itemsList = this.items;
                this.filteredItems = this.itemsList;

            } catch (error) {
                this.errorMessage = this.error;
                this.successMessage = '';
            }
        },

        filterItems() {
            const searchTerm = this.searchItem.toLowerCase();
            this.filteredItems = this.itemsList.filter(item =>
                item.name.toLowerCase().includes(searchTerm)
            );
        },

        async editDetailOrder(item) {
            this.editedDetailOrder = item;
            if (!this.editedDetailOrder) return;
            const detailOrderData = {
                cantidad: Number(this.editedDetailOrder.cantidad),
                price: Number(this.editedDetailOrder.item.price * this.editedDetailOrder.cantidad),
            };
            try {
                await this.updateDetailOrder({ id: this.editedDetailOrder._id, detailOrderData });
                this.successMessage = this.successDetail;
                this.errorMessage = '';
                setTimeout(() => {
                    this.fetchData();
                    this.successMessage = '';
                }, 2000);
            } catch (error) {
                this.errorMessage = this.errorDetail;
                this.successMessage = '';
            } finally {
                this.editedDetailOrder = null;
            }
        },

        async confirmDeleteDetailOrder(item) {
            this.editedDetailOrder = item;
            if (this.editedDetailOrder) {
                try {
                    await this.deleteDetailOrder(this.editedDetailOrder._id);
                    this.successMessage = this.successDetail;
                    this.errorMessage = '';
                    setTimeout(() => {
                        this.fetchData();
                        this.successMessage = '';
                    }, 2000);
                } catch (error) {
                    this.errorMessage = this.errorDetail || 'Error desconocido';
                    this.successMessage = '';
                } finally {
                    this.editedDetailOrder = null;
                }
            }
        },

        async selectItemOrder(item) {
            console.log("Item seleccionado:", item);
            console.log("LLEGUE AQUI")
            if (!item) return;
            const cantidadItem = 1;
            const detailOrder = {
                item: item._id,
                cantidad: Number(cantidadItem),
                price: Number(item.price) * cantidadItem,
                order: this.$route.params.id,
            };
            console.log(detailOrder)
            try {
                await this.createDetailOrder(detailOrder);
                // this.detailsOrderList.push({ ...detailOrder, item: { name: item.name, price: item.price } });
                // this.detailsOrderList.push(detailOrder);
                this.searchItem = '';
                this.selectedItem = null;

                // this.filteredItems = this.itemsList;

                this.successMessage = this.success;
                this.errorMessage = '';
                this.fetchData();
            } catch (error) {
                this.errorMessage = this.error || 'Error desconocido';
                this.successMessage = '';
            }
        },

        async submitForm() {
            this.v$.$touch();
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