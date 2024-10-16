export const convertInvoiceToHTML = (invoice) => {
    const {
        dynamicNumber,
        day,
        month,
        year,
        clientName,
        clientAddress,
        clientRUC,
        clientPhone,
        items,
        totalAmount,
        paymentCash,
        paymentCard,
        paymentElectronic,
        paymentOther,
    } = invoice;

    const htmlTemplate = `
      < !DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Invoice</title>
                        <style>
                            .container {
                                width: 100%;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 10px;
          }
                            .row {
                                display: flex;
                            justify-content: space-between;
                            width: 100%;
          }
                            .col-6 {
                                width: 48%;
          }
                            .col-12 {
                                width: 100%;
          }
                            .bordered-table-cash,
                            .bordered-table-detail,
                            .bordered-table-client,
                            .bordered-table-emisor,
                            .bordered-table-date {
                                border - collapse: collapse;
                            margin-bottom: 10px;
          }
                            .bordered-table-cash th,
                            .bordered-table-cash td,
                            .bordered-table-detail th,
                            .bordered-table-detail td,
                            .bordered-table-client th,
                            .bordered-table-client td,
                            .bordered-table-date th,
                            .bordered-table-date td {
                                border: 1px solid black;
                            padding: 8px;
          }

                            .bordered-table-emisor td {
                                border: 1px solid black;
                            padding: 8px;
                            padding-left: 26px;
                            padding-right: 26px;
          }

                            .bordered-table-date {
                                width: 100%;
          }

                            .bordered-table-detail {
                                width: 100%;
          }

                            .bordered-table-detail th,
                            .bordered-table-detail td {
                                text - align: center;
        }

                            .bordered-table-client th,
                            .bordered-table-client td {
                                text - align: left;
        }
                            .bordered-table-client td {
                                width: 100%;
        }
                            .bordered-table-date th,
                            .bordered-table-date td {
                                text - align: center;
        }
                            .bordered-table-date th {
                                background - color: #f2f2f2;
          }
                            .text-center {
                                text - align: center;
          }
                            .vertical-text {
                                writing - mode: vertical-rl;
                            transform: rotate(180deg);
          }
                            .small-text {
                                font - size: 0.8rem;
          }
                            .small-text-2 {
                                font - size: 0.56rem;
          }
                            .flex-column {
                                display: flex;
                            flex-direction: column;
}

                            .justify-end {
                                justify - content: flex-end;
}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <!-- Contenedor Superior -->
                            <div class="text-center col-12">
                                <h2><strong>EL VAPOR DE LA MOLIENDA</strong></h2>
                                <p>ARMIJOS ENRIQUEZ JONDER JAVIER</p>
                                <ul class="list-unstyled">
                                    <li>I56100101 - VENTA DE COMIDAS Y BEBIDAS EN RESTAURANTES, INCLUSO PARA LLEVAR.</li>
                                    <li>S96090101 - ACTIVIDADES DE BAÑOS TURCOS, SAUNAS, BAÑOS DE VAPOR Y SOLARIOS.</li>
                                </ul>
                            </div>

                            <!-- Contenedores 2 y 3 -->
                            <div class="row col-12">
                                <div class="col-6">
                                    <p class="small-text">R.U.C. <strong>1150666053001</strong></p>
                                    <p class="small-text"><em>N° AUT. SRI. 1132255784</em></p>
                                    <p class="small-text">Dir: C.PALTACO LOTE 2 Y 200 METROS DEL PARQUE VIA AL TINGO</p>
                                    <p class="small-text">Cel.: 0985430929 - LOJA - CATAMAYO</p>
                                    <p class="small-text">Email: xavi.greengreen@gmail.com</p>
                                    <p class="small-text"><strong>Contribuyente Negocio Popular - Régimen RIMPE</strong></p>
                                </div>
                                <div class="col-6 text-center">
                                    <p><strong>NOTA DE VENTA</strong> 001 - 001- </p>
                                    <p><span style="color: red;"> N° 000${dynamicNumber}</span></p>
                                    <table class="bordered-table-date">
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
                                                <td>${day}</td>
                                                <td>${month}</td>
                                                <td>${year}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Contenedor 4: Información del cliente -->
                            <div class="col-12">
                                <table class="bordered-table-client">
                                    <tbody>
                                        <tr>
                                            <th>CLIENTE:</th>
                                            <td class="width-table">${clientName}</td>
                                        </tr>
                                        <tr>
                                            <th>DIRECCIÓN:</th>
                                            <td class="width-table">${clientAddress}</td>
                                        </tr>
                                        <tr>
                                            <th>R.U.C./C.I:</th>
                                            <td class="width-table">${clientRUC}</td>
                                        </tr>
                                        <tr>
                                            <th>TELF:</th>
                                            <td class="width-table">${clientPhone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Contenedor 5: Detalles de la venta -->
                            <div class="col-12">
                                <table class="bordered-table-detail">
                                    <thead>
                                        <tr>
                                            <th>CANT.</th>
                                            <th>DESCRIPCIÓN</th>
                                            <th>V.UNIT.</th>
                                            <th>V.TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${items.map(item => `
                  <tr>
                    <td>${item.cantidad}</td>
                    <td>${item.itemName} - ${item.itemDescription}</td>
                    <td>$${item.itemPrice.toFixed(2)}</td>
                    <td>$${item.price.toFixed(2)}</td>
                  </tr>
                `).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <!-- Contenedor 6: Información del emisor -->
                            <div class="row col-12">
                                <div class="col-6">
                                    <p class="small-text-2">JUAN CARLOS VÁSQUES MOROCHO - IMPRENTA "JC VASQUEZ"</p>
                                    <p class="small-text-2">R.U.C 1104357155001 - AUT. N° 11386</p>
                                    <p class="small-text-2">FECHA: 11/Junio/2024 - VÁLIDA EMISIÓN HASTA: 11/Junio/2025</p>
                                </div>
                                <div class="col-6" style="display: flex; flex-direction: column; align-items: flex-end;">
                                    <table class="bordered-table-emisor text-center">
                                        <tbody>
                                            <tr>
                                                <td><strong>TOTAL $</strong></td>
                                                <td>${totalAmount.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p class="small-text-2" style="text-align: right;">ORIGINAL: ADQUIRIENTE COPIA: EMISOR</p>
                                </div>
                            </div>

                            <!-- Contenedor 7: Forma de pago -->
                            <!-- Contenedor de Forma de Pago y Firmas -->
                            <div class="row col-12">
                                <!-- Tabla de Forma de Pago -->
                                <div class="col-6">
                                    <table class="bordered-table-cash">
                                        <tbody>
                                            <tr>
                                                <th rowspan="4" class="vertical-text text-center small-text">FORMA DE PAGO</th>
                                                <td class="small-text">EFECTIVO</td>
                                                <td>${paymentCash}</td>
                                            </tr>
                                            <tr>
                                                <td class="small-text">TARJETA DE CRÉDITO/DÉBITO</td>
                                                <td>${paymentCard}</td>
                                            </tr>
                                            <tr>
                                                <td class="small-text">DINERO ELECTRÓNICO</td>
                                                <td>${paymentElectronic}</td>
                                            </tr>
                                            <tr>
                                                <td class="small-text">OTROS</td>
                                                <td>${paymentOther}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Firmas -->
                                <div class="col-3 text-center flex-column justify-end">
                                    __________________
                                    <p class="small-text">FIRMA AUTORIZADA</p>
                                </div>
                                <div class="col-3 text-center flex-column justify-end">
                                    __________________
                                    <p class="small-text">FIRMA CLIENTE</p>
                                </div>
                            </div>

                    </body>
                </html>
                `;

    return htmlTemplate;
};
