<template>
  <div>
    <div class="d-flex justify-space-between mt-5 mb-5">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Alta Dias Asueto</h1>
      <v-select v-model="annio" label="año" :items="annios" hide-details filled style="max-width:250px" @change="fnGetDiasAsueto"></v-select>
    </div>
    <div class="d-flex" style="column-gap: 15px">
      <div class="d-flex flex-column" style="row-gap: 10px">
        <v-date-picker
          v-model="dias"
          :min="dayjs().format('YYYY-MM-DD')"
          :max="dayjs().add(1,'year').format('YYYY-MM-DD')"
          multiple
          locale="es-mx"
          no-title
          :show-current="false"
          elevation="1"
        ></v-date-picker>
        <v-btn @click="fnAgregarDias" color="secondary" :disabled="dias.length==0">agregar</v-btn>
      </div>
      <div class="flex-grow-1">
        <v-row>
          <v-col cols="2" v-for="n in lst_dias" :key="n">
            <v-card rounded="xl">
              <v-card-title
                >Dia <v-spacer></v-spacer>
                <v-btn
                  @click="fnDeleteDiaAsueto(n.id_dia_asueto)"
                  icon
                  v-if="dayjs().isBefore(dayjs(n.dia))"
                  ><v-icon>mdi-delete</v-icon></v-btn
                ></v-card-title
              >
              <v-card-text
                class="text-right text-subtitle-1 font-weight-bold"
                >{{
                  dayjs(n.dia).format("DD [de] MMMM [de] YYYY")
                }}</v-card-text
              >
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref,getCurrentInstance } from "vue";
import {
  getDiasAsuetoService,
  createDiasAsuetoService,
  deleteDiaAsuetoService,
} from "@/services/dias_asueto_service";

import dayjs from "dayjs";

const root=getCurrentInstance().proxy
const annio=ref()
const annios = Array.from({ length: 5 }, (_, index) => dayjs().add(1,'year').year() - index)

const dias = ref([]);
const lst_dias = ref([]);

async function fnAgregarDias() {
  const data = await createDiasAsuetoService(dias.value);
  dias.value=[]
  fnGetDiasAsueto();
}

async function fnGetDiasAsueto() {
  try {
    lst_dias.value = await getDiasAsuetoService(annio.value);
  } catch (error) {}
}

async function fnDeleteDiaAsueto(id) {
  try {
    const confirm = await root.$confirm(
      'Desea realmente eliminar este dia. seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      await deleteDiaAsuetoService(id);
      await fnGetDiasAsueto();
    }
  } catch (error) {}
}
</script>