<template>
  <div style="height: 100%">
    <v-toolbar color="secondary" rounded>
      <v-toolbar-title class="white--text">
        Reporte general de movimientos(acciones,usuarios)
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-flex align-center" style="column-gap: 10px; row-gap: 10px">
        <v-menu v-model="menu_periodo" :close-on-content-click="false" :close-on-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="
                dayjs(periodo).isValid() ? dayjs(periodo).format('MM-YYYY') : ''
              "
              label="Periodo"
              v-on="on"
              v-bind="attrs"
              style="max-width: 300px"
              solo
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="periodo"
            type="month"
            locale="es-mx"
            color="secondary"
            @input="menu_periodo=false"
          ></v-date-picker>
        </v-menu>

        <v-btn large @click="getMovimientosReporte" color="secondary lighten-1">Buscar</v-btn>
      </div>
    </v-toolbar>

    <div class="d-flex" style="height: calc(100% - 55px)">
      <div>
        <h2 class="pt-10 pb-5 accent--text">Estado de acciones <span v-if="lst_acciones_estado.length>0" class="text-h5 ml-5 blue--text" @click="openHistoricoAcciones"> <v-icon>mdi-hand-pointing-right</v-icon> mostrar historico</span></h2>
        <div class="d-flex flex-wrap" style="column-gap: 10px; row-gap: 10px">
          <v-card
            rounded="xl"
            min-width="250"
            height="150"
            v-for="(item, index) in lst_acciones_estado"
            @click="
              () => {
                if (item.estatus == 0) {
                  openDetalleSociosActivos();
                } else {
                  getDetalleAccionByEstatus(item.estatus);
                }
              }
            "
            :key="`${index}-acc-est`"
          >
            <div v-if="item.estatus == 1" class="d-flex flex-column px-5 pt-1">
              <span
                class="accent--text text-subtitle-1 py-0"
                style="height: 15px"
              >
                acciones
              </span>
              <span class="text-h5 font-weight-bold py-0">activas</span>
            </div>
            <div
              v-else-if="item.estatus == 2"
              class="d-flex flex-column px-5 pt-1"
            >
              <span
                class="accent--text text-subtitle-1 py-0"
                style="height: 15px"
              >
                acciones
              </span>
              <div>
                <span class="text-h5 font-weight-bold py-0"> bloqueadas </span>
                <span class="text-subtitle-2">(por falta de pago)</span>
              </div>
            </div>
            <div
              v-else-if="item.estatus == 3"
              class="d-flex flex-column px-5 pt-1"
            >
              <span
                class="accent--text text-subtitle-1 py-0"
                style="height: 15px"
              >
                acciones
              </span>
              <span class="text-h5 font-weight-bold py-0">inactivas</span>
            </div>
            <div v-else class="d-flex flex-column px-5 pt-1">
              <span
                class="accent--text text-subtitle-1 py-0"
                style="height: 15px"
              >
                socios
              </span>
              <span class="text-h5 font-weight-bold py-0">activos</span>
            </div>

            <v-card-text class="d-flex justify-center align-center text-h2">
              {{ item.numero }}
            </v-card-text>
          </v-card>
        </div>

        <h2 class="pt-10 pb-5 accent--text">
          <!-- Acciones Movimientos(cambio dueño,cambio tipo,alta , baja y bloqueo) -->
          Resumen de acciones
        </h2>

        <div
          class="d-flex flex-wrap"
          style="column-gap: 10px; row-gap: 10px; position: relative"
        >
          <v-overlay
            absolute
            :value="overlay3"
            class="rounded-xl"
            color="secondary"
            opacity=".3"
            contain
          >
            <div class="text-center">
              <v-progress-linear
                style="width: 250px"
                indeterminate
                background-color="white"
              ></v-progress-linear>
              cargando detalle
            </div>
          </v-overlay>

          <v-simple-table
            class="table-pvx rounded-xl elevation-5"
            style="width: 100%"
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Detalle movimiento</th>
                  <th class="text-center">Movimiento total</th>
                  <th class="text-center">
                    Movimiento total acciones multiples
                  </th>
                  <th class="text-center">
                    Movimiento total acciones familiar
                  </th>
                  <th class="text-center">Movimiento total acciones consejo</th>
                </tr>
                <tr>
                  <th colspan="14" class="black" style="height: 2px"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in lst_movimientos_acciones"
                  :key="item.cve_cuota"
                >
                  <td>{{ item.movimiento }}</td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      text
                      @click="openDetalleCargosMovimientosAccion(item.id)"
                    >
                      {{ item.total }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      text
                      @click="openDetalleCargosMovimientosAccion(item.id, 2)"
                    >
                      {{ item.total_multiple }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      text
                      @click="openDetalleCargosMovimientosAccion(item.id, 3)"
                    >
                      {{ item.total_familiar }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      text
                      @click="openDetalleCargosMovimientosAccion(item.id, 8)"
                    >
                      {{ item.total_consejo }}
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="14" style="height: 20px"></th>
                </tr>
                <!-- <tr>
                      <th colspan="14" class="pt-5" style="border-top :3px solid #000"></th>
                  </tr> -->
              </tfoot>
            </template>
          </v-simple-table>
        </div>

        <h2 class="pt-10 pb-5 accent--text">Resumen movimientos usuarios</h2>
        <div class="d-flex flex-wrap" style="column-gap: 10px; row-gap: 10px">
          <v-card
            rounded="xl"
            min-width="250"
            height="150"
            v-for="(item, index) in lst_movimientos_socios"
            :key="`${index}-soc-mov`"
            @click="openDetalleSociosMovimientos(item.id)"
          >
            <div class="d-flex flex-column px-5 pt-1">
              <span
                class="accent--text text-subtitle-1 py-0"
                style="height: 15px"
              >
                socios
              </span>
              <span class="text-h5 font-weight-bold py-0">{{
                item.movimiento
              }}</span>
            </div>

            <v-card-text class="d-flex justify-center align-center text-h2">
              {{ item.total }}
            </v-card-text>
          </v-card>
        </div>

        <h2 class="pt-10 pb-5 accent--text">
          Detalle completo de cargos y pagos del periodo
        </h2>
        <div
          class="d-flex flex-wrap"
          style="column-gap: 10px; row-gap: 10px; position: relative"
        >
          <v-overlay
            absolute
            :value="overlay2"
            class="rounded-xl"
            color="secondary"
            opacity=".3"
          >
            <div class="text-center">
              <v-progress-linear
                style="width: 250px"
                indeterminate
                background-color="white"
              ></v-progress-linear>
              cargando detalle
            </div>
          </v-overlay>

          <v-simple-table class="table-pvx rounded-xl elevation-5">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th class="text-center">Total cargos</th>
                  <th class="text-center">Total cargos pagados</th>
                  <th class="text-center">Total cargos no pagados</th>
                  <th class="text-center">Total cargos periodo actual</th>
                  <th class="text-center">
                    Total cargos periodo actual pagados
                  </th>
                  <th class="text-center">
                    Total cargos periodo actual no pagados
                  </th>
                  <th class="text-center">Total pagos anticipados</th>
                  <th class="text-center">Total pagos anticipados pagados</th>
                  <th class="text-center">
                    Total pagos anticipados no pagados
                  </th>
                  <th class="text-center">
                    Total cargos anteriores pagados en el periodo actual
                  </th>
                  <th class="text-center">
                    Total cargos anteriores pendientes de pago
                  </th>
                  <th class="text-center">Total acciones debe 2 cargos</th>
                  <th class="text-center">Total acciones debe 3 cargos</th>
                </tr>
                <tr>
                  <th colspan="14" class="black" style="height: 2px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lst_cargos_estado" :key="item.cve_cuota">
                  <td>{{ item.concepto }}</td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) ==
                        item.total_cargos,
                      'b-error':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) !=
                        item.total_cargos,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      :disabled="item.total_cargos == 0"
                      text
                      @click="openDetalleCargos(item.cuotas_in)"
                    >
                      {{ item.total_cargos }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) ==
                        item.total_cargos,
                      'b-error':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) !=
                        item.total_cargos,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      :disabled="item.total_cargos_pagados == 0"
                      text
                      @click="openDetalleCargos(item.cuotas_in, 'si')"
                    >
                      {{ item.total_cargos_pagados }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) ==
                        item.total_cargos,
                      'b-error':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) !=
                        item.total_cargos,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      :disabled="item.total_cargos_no_pagados == 0"
                      text
                      @click="openDetalleCargos(item.cuotas_in, 'no')"
                    >
                      {{ item.total_cargos_no_pagados }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_cargos_periodo_actual_pagados) +
                          parseInt(
                            item.total_cargos_periodo_actual_no_pagados
                          ) ==
                        item.total_cargos_periodo_actual,
                      'b-error':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) !=
                        item.total_cargos,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="item.total_cargos_periodo_actual == 0"
                      text
                      @click="openDetalleCargos(item.cuota_actual)"
                    >
                      {{ item.total_cargos_periodo_actual }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_cargos_periodo_actual_pagados) +
                          parseInt(
                            item.total_cargos_periodo_actual_no_pagados
                          ) ==
                        item.total_cargos_periodo_actual,
                      'b-error':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) !=
                        item.total_cargos,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="item.total_cargos_periodo_actual_pagados == 0"
                      text
                      @click="openDetalleCargos(item.cuota_actual, 'si')"
                    >
                      {{ item.total_cargos_periodo_actual_pagados }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_cargos_periodo_actual_pagados) +
                          parseInt(
                            item.total_cargos_periodo_actual_no_pagados
                          ) ==
                        item.total_cargos_periodo_actual,
                      'b-error':
                        parseInt(item.total_cargos_pagados) +
                          parseInt(item.total_cargos_no_pagados) !=
                        item.total_cargos,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="
                        item.total_cargos_periodo_actual_no_pagados == 0
                      "
                      text
                      @click="openDetalleCargos(item.cuota_actual, 'no')"
                    >
                      {{ item.total_cargos_periodo_actual_no_pagados }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_pagos_anticipados_pagados) ==
                        item.total_pagos_anticipados,
                      'b-error':
                        parseInt(item.total_pagos_anticipados_pagados) !=
                        item.total_pagos_anticipados,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      :disabled="item.total_pagos_anticipados == 0"
                      text
                      @click="openDetalleCargos(item.cuota_adelantado)"
                    >
                      {{ item.total_pagos_anticipados }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_pagos_anticipados_pagados) ==
                        item.total_pagos_anticipados,
                      'b-error':
                        parseInt(item.total_pagos_anticipados_pagados) !=
                        item.total_pagos_anticipados,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      :disabled="item.total_pagos_anticipados_pagados == 0"
                      text
                      @click="openDetalleCargos(item.cuota_adelantado, 'si')"
                    >
                      {{ item.total_pagos_anticipados_pagados }}
                    </div>
                  </td>
                  <td
                    :class="{
                      'b-success':
                        parseInt(item.total_pagos_anticipados_pagados) ==
                        item.total_pagos_anticipados,
                      'b-error':
                        parseInt(item.total_pagos_anticipados_pagados) !=
                        item.total_pagos_anticipados,
                    }"
                  >
                    <div
                      style="cursor: pointer"
                      class="font-weight-bold text-subtitle-1"
                      :disabled="item.total_pagos_anticipados_no_pagados == 0"
                      text
                      @click="openDetalleCargos(item.cuota_adelantado, 'no')"
                    >
                      {{ item.total_pagos_anticipados_no_pagados }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="item.pagos_anteriores == 0"
                      text
                      @click="openDetalleCargosAnteriores(item.cuota_actual, 1)"
                    >
                      {{ item.pagos_anteriores }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="item.debe_anterior == 0"
                      text
                      @click="openDetalleCargosAnteriores(item.cuota_actual, 2)"
                    >
                      {{ item.debe_anterior }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="item.acc_2mant == 0"
                      text
                      @click="openDetalleCargosAnteriores(item.cuota_actual, 3)"
                    >
                      {{ item.acc_2mant }}
                    </div>
                  </td>
                  <td>
                    <div
                      style="cursor: pointer"
                      class="font-weight-medium text-subtitle-1"
                      :disabled="item.acc_3mant == 0"
                      text
                      @click="openDetalleCargosAnteriores(item.cuota_actual, 4)"
                    >
                      {{ item.acc_3mant }}
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="14" style="height: 20px"></th>
                </tr>
                <!-- <tr>
                      <th colspan="14" class="pt-5" style="border-top :3px solid #000"></th>
                  </tr> -->
              </tfoot>
            </template>
          </v-simple-table>
        </div>

        <h2 class="pt-10 pb-5 accent--text">
          Cargos cancelados via carga activacion
        </h2>
        <div class="d-flex flex-wrap" style="column-gap: 10px; row-gap: 10px">
          <v-card
            width="250"
            height="150"
            v-for="(item, index) in lst_cargos_cancelados_cron"
            :key="`${index}-car-can`"
          >
            <v-toolbar elevation="0" class="text-center text-h5">
              {{ item.concepto }}
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="d-flex justify-center align-center text-h2">
              {{ item.cantidad }}
            </v-card-text>
          </v-card>
        </div>
      </div>
      <!-- <v-divider vertical class="mx-2"></v-divider>
            <div class="d-flex flex-column justify-space-around align-center redx" style="height: 100%;width: 500px;">

                <canvas id="myChartGeneral" width="400px" role="img"></canvas>
                <canvas id="myChartGeneral2" width="400px" role="img"></canvas>

            </div> -->
    </div>

    <v-dialog v-model="dialog" width="800" scrollable persistent>
      <v-card>
        <v-toolbar
          :color="
            estatus_selected == 1
              ? 'success'
              : estatus_selected == 2
              ? 'warning'
              : estatus_selected == 3
              ? 'error'
              : 'grey'
          "
        >
          <v-toolbar-title>Detalle acccion</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Numero accion</th>
                  <th>Tipo accion</th>
                  <th>Dueño</th>
                  <th>Rfc</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in lst_detalle_acciones"
                  :key="`${index}-det-acc`"
                >
                  <td>{{ item.num_accion }}</td>
                  <td>{{ item.tipo_accion_ }}</td>
                  <td>{{ item.detalle }}</td>
                  <td>{{ item.rfc }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_detalle_socios" width="800" scrollable persistent>
      <v-card>
        <v-toolbar color="info" dark>
          <v-toolbar-title>Detalle acccion</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_detalle_socios = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Numero accion</th>
                  <th>usuario</th>
                  <th>Nombre usuario</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in lst_detalle_socios_activos"
                  :key="`${index}-det-acc`"
                >
                  <td>{{ item.accion }}</td>
                  <td>{{ item.posicion }}</td>
                  <td>
                    <span>{{ item.nombre }}</span
                    ><span class="font-weight-bold mx-1">{{
                      item.apellido_paterno
                    }}</span
                    ><span class="font-italic">{{
                      item.apellido_materno
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_detalle_cargo" persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Detalle de cargos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="
              (dialog_detalle_cargo = false), (lst_detalle_cargos_actual = [])
            "
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="lst_detalle_cargos_actual"
            class="table-pvx rounded-xlx elevation-5x"
            hide-default-footerx
          >
            <template v-slot:item.usuario="{ item }">
              <span>{{ item.nombre }}</span>
              <span class="font-weight-bold mx-1">{{
                item.apellido_paterno
              }}</span>
              <span class="font-italic">{{ item.apellido_materno }}</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_detalle_accion" min-width="800" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Detalle acccion</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_detalle_accion = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Numero accion {{movimiento_selected}}</th>
                  <th>Tipo accion</th>
                  <th  v-if="movimiento_selected==2">Tipo accion actual</th>
                  <th>Dueño</th>
                  <th  v-if="movimiento_selected==1">Dueño actual</th>
                  <th>Rfc</th>
                  <th v-if="[4,7].some(i=>movimiento_selected==i)">Motivo</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in lst_detalle_movimientos_accion"
                  :key="`${index}-det-acc`"
                >
                  <td>{{ item.accion_name }}</td>
                  <td>{{ item.tipo_accion_ }}</td>
                  <td v-if="movimiento_selected==2">{{item.tipo_accion_act}}</td>
                  <td>
                    <span>{{ item.nombre }}</span>
                    <span class="font-weight-bold">{{
                      item.apellido_paterno
                    }}</span>
                    <span class="font-italic">{{ item.apellido_materno }}</span>                   
                  </td>
                  <td v-if="movimiento_selected==1">
                    <span>{{ item.nombre_act }}</span>
                    <span class="font-weight-bold">{{
                      item.apellido_paterno_act
                    }}</span>
                    <span class="font-italic">{{ item.apellido_materno_act }}</span>                   
                  </td>
                  <td>{{ item.rfc }}</td>
                  <td v-if="[4,7].some(i=>movimiento_selected==i)">{{ item.motivo_cambio }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_historico_accion" width="800" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Detalle acccion</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_historico_accion = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Acciones activas</th>
                  <th>Acciones bloqueadas</th>
                  <th>Acciones inactivas</th>
                  <th>Socios activos</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in lst_historico_acciones"
                  :key="`${index}-det-acc`"
                >
                  <td>{{ item.periodo }}</td>
                  <td>{{ item.activas }}</td>
                  <td>{{ item.bloqueadas }}</td>
                  <td>{{ item.inactivas }}</td>
                  <td>{{ item.socios_activos }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="overlay">
      <div class="text-center">
        <v-progress-linear
          style="width: 250px"
          indeterminate
          background-color="white"
        ></v-progress-linear>
        cargando...
      </div>
    </v-overlay>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  getReporteGeneralService,
  getReporteGeneralDetalleService,
  getDetalleAccionByEstatusService,
  getReporteGeneralAnterioresPagadosDetalleService,
  getReporteGeneralAnterioresDetalleService,
  getReporteGeneralAccion2or3DetalleService,
  getReporteGeneralMovimientoAccionDetalleService,
  getDetalleSociosActivosService,
  getDetalleSociosMovimientosService,
  getHistoricoAccionesService
} from "@/services/reporte_general_service";
import dayjs from "dayjs";
import numeral from "numeral";
import Chart from "chart.js";
import _uniqBy from "lodash/uniqBy";

const lst_movimientos_socios = ref([]);
const lst_movimientos_acciones = ref([]);
const lst_acciones_estado = ref([]);
const lst_cargos_estado = ref([]);
const lst_cargos_cancelados_cron = ref([]);

const lst_detalle_acciones = ref([]);
const lst_detalle_cargos_actual = ref([]);
const lst_detalle_movimientos_accion = ref([]);
const lst_detalle_socios_activos = ref([]);
const lst_historico_acciones = ref([]);

const periodo = ref(null);
const fecha_fin = ref(dayjs().format("YYYY-MM-DD"));

const menu_periodo=ref(false)
const dialog = ref(false);
const overlay = ref(false);
const overlay2 = ref(false);
const overlay3 = ref(false);

const estatus_selected = ref(0);

const dialog_detalle_socios = ref(false);
const dialog_detalle_cargo = ref(false);
const dialog_detalle_accion = ref(false);
const dialog_historico_accion = ref(false);

const headers = [
  { text: "Concepto", value: "concepto" },
  { text: "Periodo", value: "periodo" },
  { text: "Fecha Cargo", value: "fecha_cargo" },
  { text: "Monto", value: "total" },
  { text: "Descuento", value: "total_descuento" },
  { text: "Accion", value: "accion_name" },
  { text: "Usuario", value: "posicion" },
  { text: "Nombre usuario", value: "usuario" },
];

const page = ref(1);
const itemsPerPage = ref(10);

 //es el tipo selected detalle 
const movimiento_selected=ref(0)

onMounted(() => {
  getMovimientosReporte();
});

async function getMovimientosReporte() {
  try {
    overlay.value = true;
    const {
      acciones_mov,
      socios_mov,
      cargos,
      cargos_ateriores,
      acciones_est,
      cargos_cancelados_cron,
    } = await getReporteGeneralService(periodo.value, fecha_fin.value);

    lst_movimientos_socios.value = socios_mov;

    lst_acciones_estado.value = acciones_est;

    lst_cargos_estado.value = cargos.map((i) => ({
      ...i,
      pagos_anteriores:
        cargos_ateriores?.pagado.find((j) => j.cve_cuota == i.cuota_actual)
          ?.total ?? 0,
      debe_anterior:
        cargos_ateriores?.debe.find((j) => j.cve_cuota == i.cuota_actual)
          ?.total ?? 0,
      acc_2mant:
        cargos_ateriores?.mant2.find((j) => j.cve_cuota == i.cuota_actual)
          ?.total ?? 0,
      acc_3mant:
        cargos_ateriores?.mant3.find((j) => j.cve_cuota == i.cuota_actual)
          ?.total ?? 0,
    }));

    lst_movimientos_acciones.value = acciones_mov;

    lst_cargos_cancelados_cron.value = cargos_cancelados_cron;

    //parte inicia charts
    let ctx = document.getElementById("myChartGeneral");
    let ctx2 = document.getElementById("myChartGeneral2");

    const chartDias = new Chart(ctx, {
      // plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: lst_movimientos_socios.value.map((i) => i.movimiento),
        datasets: [
          {
            label: "# Acceso Socios",
            data: lst_movimientos_socios.value.map((i) => i.total),
            backgroundColor: [
              "darkred",
              "darkblue",
              "yellow",
              "fuchsia",
              "purple",
            ],
          },
        ],
      },

      options: {
        maintainAspectRatio: true,
        responsive: false,
      },
    });

    const chartDias2 = new Chart(ctx2, {
      // plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: lst_movimientos_acciones.value.map((i) => i.movimiento),
        datasets: [
          {
            label: "# Acceso Socios",
            data: lst_movimientos_acciones.value.map((i) => i.total),
            backgroundColor: [
              "darkred",
              "darkblue",
              "yellow",
              "fuchsia",
              "purple",
            ],
          },
        ],
      },

      options: {
        maintainAspectRatio: true,
        responsive: false,
      },
    });
  } catch (error) {
  } finally {
    overlay.value = false;
  }
}

async function getDetalleAccionByEstatus(estatus) {
  estatus_selected.value = estatus;
  try {
    lst_detalle_acciones.value = await getDetalleAccionByEstatusService(
      estatus
    );
    dialog.value = true;
  } catch (error) {}
}

async function openDetalleCargos(cuota, pago = undefined) {
  try {
    overlay2.value = true;
    const data = await getReporteGeneralDetalleService(
      periodo.value,
      cuota,
      pago
    );
    lst_detalle_cargos_actual.value = data;
    dialog_detalle_cargo.value = true;
  } catch (error) {
  } finally {
    overlay2.value = false;
  }
}

async function openDetalleCargosAnteriores(cuota, tipo) {
  try {
    overlay2.value = true;
    if (tipo == 1) {
      const data = await getReporteGeneralAnterioresPagadosDetalleService(
        periodo.value,
        cuota
      );
      lst_detalle_cargos_actual.value = data;
    } else if (tipo == 2) {
      const data = await getReporteGeneralAnterioresDetalleService(
        periodo.value,
        cuota
      );
      lst_detalle_cargos_actual.value = data;
    } else if (tipo == 3) {
      const data = await getReporteGeneralAccion2or3DetalleService(
        periodo.value,
        cuota,
        2
      );
      lst_detalle_cargos_actual.value = data;
    } else {
      const data = await getReporteGeneralAccion2or3DetalleService(
        periodo.value,
        cuota,
        3
      );
      lst_detalle_cargos_actual.value = data;
    }

    dialog_detalle_cargo.value = true;
  } catch (error) {
  } finally {
    overlay2.value = false;
  }
}

async function openDetalleCargosMovimientosAccion(movimiento, tipo = 0) {
  try {
    overlay3.value = true;
    const data = await getReporteGeneralMovimientoAccionDetalleService(
      periodo.value,
      movimiento,
      tipo
    );
    movimiento_selected.value=movimiento
    lst_detalle_movimientos_accion.value = data;
    dialog_detalle_accion.value = true;
  } catch (error) {
  } finally {
    overlay3.value = false;
  }
}

async function openDetalleSociosActivos() {
  try {
    const data = await getDetalleSociosActivosService();
    lst_detalle_socios_activos.value = data;
    dialog_detalle_socios.value = true;
  } catch (error) {}
}

async function openDetalleSociosMovimientos(tipo) {
  try {
    const data = await getDetalleSociosMovimientosService(periodo.value, tipo);
    lst_detalle_socios_activos.value = data;
    dialog_detalle_socios.value = true;
  } catch (error) {}
}


async function openHistoricoAcciones()
{
try {
  
  const data=await getHistoricoAccionesService()
  lst_historico_acciones.value=data
  dialog_historico_accion.value=true
} catch (error) {
  
}
}
</script>

<style>
.b-success {
  border-bottom: 2px solid green !important;
}
.b-error {
  border-bottom: 2px solid red !important;
}
</style>