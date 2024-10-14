<template>
  <v-container>
    <!-- Contenedor 1: Título principal centrado -->
    <v-row>
      <v-col class="text-center">
        <h2><strong>EL VAPOR DE LA MOLIENDA</strong></h2>
        <p>ARMIJOS ENRIQUEZ JONDER JAVIER</p>
        <ul class="list-unstyled">
          <li>I56100101 - VENTA DE COMIDAS Y BEBIDAS EN RESTAURANTES, INCLUSO PARA LLEVAR.</li>
          <li>S96090101 - ACTIVIDADES DE BAÑOS TURCOS, SAUNAS, BAÑOS DE VAPOR Y SOLARIOS.</li>
        </ul>
      </v-col>
    </v-row>

    <!-- Contenedor 2 y 3: Información de la empresa y detalles de la nota de venta -->
    <v-row>
      <!-- Contenedor 2: Datos de la empresa -->
      <v-col cols="6">
        <p class="small-text">R.U.C. <strong>1150666053001</strong></p>
        <p class="small-text"><em>N° AUT. SRI. 1132255784</em></p>
        <p class="small-text">Dir: C.PALTACO LOTE 2 Y 200 METROS DEL PARQUE VIA AL TINGO</p>
        <p class="small-text">Cel.: 0985430929 - LOJA - CATAMAYO</p>
        <p class="small-text">Email: xavi.greengreen@gmail.com</p>
        <p class="small-text"><strong>Contribuyente Negocio Popular - Régimen RIMPE</strong></p>
      </v-col>

      <!-- Contenedor 3: Nota de Venta y fecha -->
      <v-col cols="6" class="text-center">
        <p><strong>NOTA DE VENTA</strong> 001 - 001- </p>
        <!-- Número dinámico de Nota de Venta -->
        <p><span style="color: red;"> N° 000{{ dynamicNumber }}</span></p>
        <v-simple-table class="bordered-table-date"> <!-- Añadido borde -->
          <thead>
            <tr>
              <th colspan="3" class="text-center">FECHA DE EMISIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DÍA</td>
              <td>MES</td>
              <td>AÑO</td>
            </tr>
            <tr>
              <td>{{ day }}</td>
              <td>{{ month }}</td>
              <td>{{ year }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <!-- Contenedor 4: Información del cliente -->
    <v-row>
      <v-col cols="12">
        <v-simple-table class="bordered-table-client">
          <tbody>
            <tr>
              <th>CLIENTE:</th>
              <td class="width-table">{{ clientName }}</td>
            </tr>
            <tr>
              <th>DIRECCIÓN:</th>
              <td class="width-table">{{ clientAddress }}</td>
            </tr>
            <tr>
              <th>R.U.C./C.I:</th>
              <td class="width-table">{{ clientRUC }}</td>
            </tr>
            <tr>
              <th>TELF:</th>
              <td class="width-table">{{ clientPhone }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>

    <!-- Contenedor 5: Detalles de la venta -->
    <v-row>
      <v-col cols="12" >
        <v-data-table  :headers="headers" :items="items" class="elevation-1 bordered-table-detail" hide-default-footer="false">
          <template v-slot:[`item.itemName`]="{ item }">
            {{ item.itemName }} - {{ item.itemDescription }}
          </template>
          <template v-slot:[`item.itemPrice`]="{ item }">
           $ {{ item.itemPrice.toFixed(2) }}
          </template>
          <template v-slot:[`item.price`]="{ item }">
           $ {{ item.price.toFixed(2) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Contenedor 6: Información del emisor (Estática) -->
    <v-row>
      <v-col cols="6">
        <p class="small-text-2">{{ `JUAN CARLOS VÁSQUES MOROCHO - IMPRENTA <<JC VASQUEZ>>` }}</p>
        <p class="small-text-2">R.U.C 1104357155001 - AUT. N° 11386</p>
        <p class="small-text-2">FECHA: 11/Junio/2024 - VÁLIDA EMISIÓN HASTA: 11/Junio/2025</p>
      </v-col>

      <v-col cols="6" class="text-right">
        <v-simple-table class="bordered-table-emisor text-center">
          <theader >
            <tr>
              <td><strong>TOTAL $</strong></td>
              <td>{{ totalAmount.toFixed(2) }}</td>
            </tr>
          </theader>
        </v-simple-table>
        <p class="small-text-2" >ORIGINAL: ADQUIRIENTE COPIA: EMISOR</p>
      </v-col>
    </v-row>

    <!-- Contenedor 7: Forma de pago -->
    <v-row>
      <v-col cols="6">
        <v-simple-table class="bordered-table-cash"> <!-- Añadido borde -->
          <tbody>
            <tr>
              <th rowspan="4" class="vertical-text text-center small-text">FORMA DE PAGO</th>
              <td class="small-text">EFECTIVO</td>
              <td>{{ paymentCash }}</td>
            </tr>
            <tr>
              <td class="small-text">TARJETA DE CRÉDITO/DÉBITO</td>
              <td>{{ paymentCard }}</td>
            </tr>
            <tr>
              <td class="small-text">DINERO ELECTRÓNICO</td>
              <td>{{ paymentElectronic }}</td>
            </tr>
            <tr>
              <td class="small-text">OTROS</td>
              <td>{{ paymentOther }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-end text-center">
        ____________________
        <p class="small-text">FIRMA AUTORIZADA</p>
      </v-col>
      <v-col cols="3" class="d-flex flex-column justify-end text-center">
        ____________________
        <p class="small-text">FIRMA CLIENTE</p>
      </v-col>
    </v-row>

    <!-- Contenedor 8: Firmas (Estático) a la derecha del contenedor 7 -->
  </v-container>
</template>

<script>
export default {
  name: 'InvoiceOrder',
  props: {
    dynamicNumber: String,
    day: String,
    month: String,
    year: String,
    clientName: String,
    clientAddress: String,
    clientRUC: String,
    clientPhone: String,
    items: Array,
    totalAmount: Number,
    paymentCash: String,
    paymentCard: String,
    paymentElectronic: String,
    paymentOther: String,
  },
  data() {
    return {
      headers: [
        {
          title: 'CANT.', value: 'cantidad', align: 'center', headerProps: {
            class: 'font-weight-bold',
          },
        },
        {
          title: 'DESCRIPCIÓN', value: 'itemName', align: 'center', headerProps: {
            class: 'font-weight-bold',
          },
        },
        {
          title: 'V.UNIT.', value: 'itemPrice', align: 'center', headerProps: {
            class: 'font-weight-bold',
          },
        },
        {
          title: 'V.TOTAL', value: 'price', align: 'center', headerProps: {
            class: 'font-weight-bold',
          },
        },
      ],
    };
  },
};
</script>

<style scoped>
.list-unstyled {
  list-style: none;
  padding: 0;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.bordered-table-cash {
  border-collapse: collapse;
  width: 100%;
}

.bordered-table-cash th,
.bordered-table-cash td {
  border: 1px solid black;
  padding: 8px;
}

.bordered-table-cash th {
  background-color: #f2f2f2;
}

.bordered-table-detail {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid black;
}

.bordered-table-emisor td {
  border-collapse: collapse;
  border: 1px solid black;
  padding-left: 20px;
  padding-right: 20px;
}

.bordered-table-client {
  border-collapse: collapse;
  width: 100%;
}

.bordered-table-client th,
.bordered-table-client td {
  border: 1px solid black;
  padding-left: 20px;
  padding-right: 20px;
}

.bordered-table-date {
  border-collapse: collapse;
  width: 100%;
}

.bordered-table-date th,
.bordered-table-date td {
  border: 1px solid black;
  padding-left: 40px;
  padding-right: 40px;
}

.bordered-table-date th {
  background-color: #f2f2f2;
}

.width-table {
  width: 100%;
}

.small-text {
  font-size: 0.8rem;
}

.small-text-2 {
  font-size: 0.56rem;
}

</style>
