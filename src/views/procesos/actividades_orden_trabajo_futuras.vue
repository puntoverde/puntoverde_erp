<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";
import { getConceptosService } from '@/services/concepto_service'

const root = getCurrentInstance().proxy;
const headers = ref([
    { text: "Actividad", align: "center", sortable: true, value: "actividad" },
    { text: "Persona Asignada", value: "persona_asignada" },
    { text: "Tipo actividad", value: "tipo_actividad" },
    { text: "Fecha finalizada", align: "right", value: "fecha_finaliza" },
    { text: "Terminado", value: "termino" },
    { text: "Observaciones", value: "observaciones" }
]);
const items = ref([]);
const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const getBreadcrumb = [
    {
        text: "Dashboard",
        disabled: false,
        href: "breadcrumbs_dashboard",
    },
    {
        text: "Link 1",
        disabled: false,
        href: "breadcrumbs_link_1",
    },
    {
        text: "Link 2",
        disabled: true,
        href: "breadcrumbs_link_2",
    },
];

const filters = ref([
    { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
    { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);

onMounted(() => {
    get_cuotas()
});

async function get_cuotas() {
    items.value = [{
        actividad: 'cambiar lavamanos de baños',
        persona_asignada: 'Alfonso Hernan Gomez',
        tipo_actividad: 'Fontaneria',
        fecha_finaliza: '02-octubre-2024',
        termino: 'Si',
        observaciones: 'Se realizara el cambio del lavabo al igual que las mangueras por desgaste de las mismas'
    }]
}


</script>

<template>
    <div>
        <div class="d-flex justify-space-between">

            <h1 class="accent--text oswald--text">Revision de actividades orden trabajo</h1>
        </div>


        <div class="d-flex justify-end" style="column-gap: 35px;">

            <v-select label="Tipo actividad" filled style="max-width---: 350px;"></v-select>

            <v-text-field label="nombre" filled></v-text-field>

            <v-menu max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field label="dia actividad" filled style="max-width---: 350px;">
                        <template v-slot:append-outer>
                            
                                <v-btn icon v-on="on" v-bind="attrs">
                                    <v-icon>mdi-calendar</v-icon>
                                </v-btn>
                        </template>
                    </v-text-field>
                </template>
                <!-- <v-card> -->
                    <v-date-picker></v-date-picker>
                <!-- </v-card> -->
            </v-menu>

            <v-select label="persona responsable" filled style="max-width: 350px;">
            </v-select>
        </div>
        <div class="d-flex justify-end" style="column-gap: 35px;">
            <v-select label="Area" filled style="max-width--: 350px;">
            </v-select>
            <v-select label="Mobilario" filled style="max-width--: 350px;">
            </v-select>
            <v-textarea filled></v-textarea>
        </div>

        <v-data-table :headers="headers" :items="items" :search="search" :page.sync="page"
            :items-per-page="itemsPerPage" class="table-pv rounded-xl elevation-5" hide-default-footer>
            <template v-slot:top="{ pagination }">
                <div class="d-flex justify-end align-center">
                    <span class="mr-2 text-caption">filas por pagina</span>
                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
                    <v-pagination circle :total-visible="0" v-model="page"
                        :length="pagination.pageCount"></v-pagination>
                </div>
            </template>

            <template v-slot:footer="{ props }">
                <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template>

            <template v-slot:item.tipo_cuota="{ item }">
                <span v-if="item.tipo_cuota == 1">Persona</span>
                <span v-else>Accion</span>
            </template>

            <template v-slot:item.precio="{ item }">
                <span class="font-weight-black accent--text number--text">
                    {{ numeral(item.precio).format("$0,0.[00]") }}
                </span>
            </template>

            <template v-slot:item.opcion_iva="{ item }">
                <span v-if="item.opcion_iva == 1">Iva Incluido</span>
                <span v-else>Mas Iva</span>
            </template>

            <template v-slot:item.genero_aplica="{ item }">
                <v-icon v-if="item.genero_aplica === 'H'">mdi-human-male</v-icon>
                <v-icon v-else-if="item.genero_aplica === 'M'">mdi-human-female</v-icon>
                <v-icon v-else>mdi-human-male-female</v-icon>
            </template>

            <template v-slot:item.edad_aplica="{ item }">
                {{ item.edad_aplica == 0 ? "NA" : `${item.edad_aplica} Años` }}
            </template>

            <template v-slot:item.obligatoria="{ item }">
                <span class="font-weight-bold"
                    :class="{ 'primary--text': item.obligatoria, 'secondary--text': !item.obligatoria }">{{ item.obligatoria ? 'SI' : 'NO' }}</span>
            </template>

            <template v-slot:item.estatus="{ item }">
                <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
                <v-icon v-else color="error">mdi-close-circle</v-icon>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-small icon outlined color="secondary" fab
                            @click="editar_cuota(item.cve_cuota)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
                    </template>
                    <span>Editar Cuota</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </div>
</template>