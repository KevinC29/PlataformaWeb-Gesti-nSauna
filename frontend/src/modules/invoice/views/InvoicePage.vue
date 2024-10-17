<template>
    <v-data-table :headers="headers" :items="filteredItems" v-model:sort-by="sortBy" :items-per-page="10">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>ÓRDENES PAGADAS</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify"
                    variant="solo-filled" flat hide-details single-line></v-text-field>
                <v-spacer></v-spacer>
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
            {{ item.client ? `${item.client.name} ${item.client.lastName}` : 'N/A' }}
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

        <!-- Columna de Método de Pago -->
        <template v-slot:[`item.paymentMethod`]="{ item }">
            {{ getPaymentMethodTitle(item.paymentMethod) }}
        </template>

        <!-- Nueva Columna: Ver Factura -->
        <template v-slot:[`item.viewInvoice`]="{ item }">
            <v-btn color="primary" @click="openInvoiceModal(item)">
                Ver Factura
            </v-btn>
        </template>

        <!-- Nueva Columna: Enviar Factura -->
        <template v-slot:[`item.sendInvoice`]="{ item }">
            <v-btn :disabled="!item.isActive" color="success" @click="sendInvoice(item)">
                Enviar Factura
            </v-btn>
        </template>

        <!-- Sin datos -->
        <template v-slot:no-data>
            <v-alert type="info" class="mx-4 my-4" border="left" elevation="2">
                No hay órdenes pagadas.
            </v-alert>
        </template>
    </v-data-table>

    <v-dialog v-model="showSendInvoiceModal" max-width="400">
        <v-card>
            <v-card-title class="headline">Confirmación de Envío</v-card-title>
            <v-alert v-if="errorMessage" type="error" class="mt-3">
                {{ errorMessage }}
            </v-alert>
            <v-alert v-if="successMessage" type="success" dismissible>
                {{ successMessage }}
            </v-alert>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="closeConfirmationModal">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Modal para Ver Factura -->
    <v-dialog v-model="showInvoiceModal" max-width="800">
        <v-card>
            <v-toolbar flat dark color="primary">
                <v-toolbar-title>Factura</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeInvoiceModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <InvoiceOrder :dynamicNumber="invoiceData.dynamicNumber" :day="invoiceData.day"
                    :month="invoiceData.month" :year="invoiceData.year" :clientName="invoiceData.clientName"
                    :clientAddress="invoiceData.clientAddress" :clientRUC="invoiceData.clientRUC"
                    :clientPhone="invoiceData.clientPhone" :items="invoiceData.items"
                    :totalAmount="invoiceData.totalAmount" :paymentCash="invoiceData.paymentCash"
                    :paymentCard="invoiceData.paymentCard" :paymentElectronic="invoiceData.paymentElectronic"
                    :paymentOther="invoiceData.paymentOther" />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { convertInvoiceToHTML } from '@/utils/convertInvoiceHTML'; 
import InvoiceOrder from '@/modules/invoice/components/InvoiceOrder.vue';

export default {
    components: {
        InvoiceOrder,
    },
    data() {
        return {
            sortBy: [{ key: 'numberOrder', order: 'asc' }],
            search: '',
            errorMessage: '',
            successMessage: '',
            showInvoiceModal: false,
            showSendInvoiceModal: false,
            invoiceData: {
                dynamicNumber: '',
                day: '',
                month: '',
                year: '',
                clientName: '',
                clientAddress: '',
                clientRUC: '',
                clientPhone: '',
                items: [],
                totalAmount: 0,
                paymentCash: '',
                paymentCard: '',
                paymentElectronic: '',
                paymentOther: '',
            },
            paymentMethods: [
                { title: 'Efectivo', value: 'cash' },
                { title: 'Tarjeta de Crédito/Débito', value: 'credit/debit card' },
                { title: 'Dinero Electrónico', value: 'electronic money' },
                { title: 'Otros', value: 'other' },
            ],
        };
    },
    computed: {
        ...mapGetters('invoice', ['orders', 'error', 'success']),
        headers() {
            return [
                { title: 'Número de Orden', key: 'numberOrder', align: 'start' },
                { title: 'Fecha de Orden', key: 'dateOrder' },
                { title: 'Cliente', key: 'client' },
                { title: 'Total', key: 'total' },
                { title: 'Estado de Pago', key: 'paymentState' },
                { title: 'Método de Pago', key: 'paymentMethod' },
                { title: 'Ver Factura', key: 'viewInvoice' },
                { title: 'Enviar Factura', key: 'sendInvoice' },
            ];
        },
        filteredItems() {
            const filteredOrders = this.orders;
            if (!this.search) return filteredOrders;
            const searchLower = this.search.toLowerCase();
            return filteredOrders.filter(order =>
                order.numberOrder.toString().includes(searchLower) ||
                new Date(order.dateOrder).toLocaleDateString('en-GB').includes(searchLower) ||
                order.client.name.toLowerCase().includes(searchLower) ||
                order.client.lastName.toLowerCase().includes(searchLower) ||
                order.client.phone.toLowerCase().includes(searchLower)
            );
        }
    },
    methods: {
        ...mapActions('invoice', ['fetchOrdersForInvoices', 'sendInvoiceToEmail']),

        getPaymentMethodTitle(paymentMethod) {
            const method = this.paymentMethods.find(method => method.value === paymentMethod);
            return method ? method.title : 'Desconocido';
        },

        openInvoiceModal(item) {
            this.fillInvoiceData(item);
            this.showInvoiceModal = true;
        },

        closeInvoiceModal() {
            this.showInvoiceModal = false;
        },

        async sendInvoice(item) {
            try {
                this.fillInvoiceData(item);
                const invoiceData = {
                    htmlTemplate: convertInvoiceToHTML(this.invoiceData),
                    email: item.client.email,
                    subject: `Nota de venta de la Orden #00${item.numberOrder}`,
                    numberInvoice: `00${item.numberOrder}`,
                    orderId: item.orderId,
                }
                await this.sendInvoiceToEmail(invoiceData);
                this.fetchOrdersForInvoices();
                this.successMessage = this.success;
                this.showSendInvoiceModal = true;
            } catch (error) {
                this.showSendInvoiceModal = true;
                this.errorMessage = this.error;
            }
        },

        closeConfirmationModal() {
            this.showSendInvoiceModal = false;
            this.errorMessage = '';
            this.successMessage = '';
        },

        fillInvoiceData(item) {
            const date = new Date(item.dateOrder);
            this.invoiceData.dynamicNumber = item.numberOrder;
            this.invoiceData.day = date.getDate().toString().padStart(2, '0');
            this.invoiceData.month = (date.getMonth() + 1).toString().padStart(2, '0');
            this.invoiceData.year = date.getFullYear().toString();
            this.invoiceData.clientName = item.client.name + ' ' + item.client.lastName;
            this.invoiceData.clientAddress = item.client.address;
            this.invoiceData.clientRUC = item.client.dni;
            this.invoiceData.clientPhone = item.client.phone;
            this.invoiceData.items = item.detailOrders;
            this.invoiceData.totalAmount = item.total;
            this.invoiceData.paymentCash = item.paymentMethod === 'cash' ? 'X' : '';
            this.invoiceData.paymentCard = item.paymentMethod === 'credit/debit card' ? 'X' : '';
            this.invoiceData.paymentElectronic = item.paymentMethod === 'electronic money' ? 'X' : '';
            this.invoiceData.paymentOther = item.paymentMethod === 'other' ? 'X' : '';
        }
    },
    created() {
        this.fetchOrdersForInvoices();
    }
};
</script>
