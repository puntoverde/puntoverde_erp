<template>
    
    <div class="d-flex flex-wrap" style="gap: 10px;">
        <meta http-equiv="refresh" content="60"/>

        <v-card v-for="(equipo, index) in lst_equipo" :key="index" width="250">
            <v-toolbar color="secondary" class="font-weight-bold text-h6 d-flex justify-center" dark>
                {{ equipo.equipo }}
            </v-toolbar>
            <template v-for="horario in equipo.horarios">
                <v-card class="rounded-0" elevation="0">
                    <v-toolbar height="38" color="primaryx rounded-0" elevation="0"
                        class="font-weight-bold text-h6 d-flex justify-center"> {{ horario.a.substr(0, 5) }} - {{
                            horario.b.substr(0, 5) }} </v-toolbar>
                    <v-list v-if="horario.cve_apartado > 0" class="my-0 py-0">

                        <v-list-item v-for="socio in horario.socios" dense>
                            <v-list-item-icon>
                                <v-icon>mdi-account</v-icon>
                            </v-list-item-icon>
                            {{ socio }}
                        </v-list-item>
                        <!-- <v-list-item dense>Juan Manuel Lopez Suarez</v-list-item>
                <v-list-item dense>Monica Naranjo Huerta</v-list-item> -->
                    </v-list>
                    <div v-else class="text-center font-weight-bold">
                        Libre
                    </div>
                </v-card>
                <v-divider></v-divider>
            </template>
        </v-card>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { horariosEnvivo } from '@/services/apartados_services'

const lst_equipo = ref([])

onMounted(async () => {
    lst_equipo.value = await horariosEnvivo();
})


</script>