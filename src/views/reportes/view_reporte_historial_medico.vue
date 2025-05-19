<template>

 <div class="d-flex" style="height: 100%;">
      <div class="redx flex-grow-1x px-5 imprimir-examen" style="height: 100%;min-width: 50vw;max-width: 50vw;">
        <v-toolbar color="primary" dark >
            <!-- <v-text-field style="max-width: 250px;" solo-inverted single-line hide-details prepend-inner-icon="mdi-magnify"></v-text-field> -->
        
            <v-btn data-html2canvas-ignore="true" @click="printerExamen">imprimir</v-btn>



        <v-tooltip bottom >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn data-html2canvas-ignore="true" :outlined="attrs['aria-expanded'] == 'true'" color="secondary" v-on="on" v-bind="attrs" fab small
                        dark elevation="1" @click="openBuscar" class="ml-1">
                        <v-icon>mdi-account-search</v-icon>
                    </v-btn>
                </template>
                <span>buscar persona</span>
            </v-tooltip>
            <v-toolbar-title class="ml-10">
                {{ nombre_text }}
            </v-toolbar-title>
        </v-toolbar>

            
        

            <v-row class="mt-10">
                <v-col><v-textarea :value="observaciones" filled label="observaciones" rows="3" readonly></v-textarea></v-col>
                <v-col><v-textarea :value="factores_riesgo" filled label="factores de riesgo" rows="3" readonly></v-textarea></v-col>
            </v-row>


             <span class="text-h5">Antecedentes familiares</span>
            <v-row class="my-5">
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Enfermedad cardiovascular antes de los 40 años</span>
                    <!-- <v-spacer></v-spacer> -->
                    
                </v-col>
                <v-col cols="1">
                    <v-chip class="text-h6" color="primary">
                        <span v-if="cardiovascular==1">SI</span>
                        <span v-else-if="cardiovascular==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Presion arterial elevada</span>
                    <!-- <v-spacer></v-spacer> -->
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="presion_arterial==1">SI</span>
                        <span v-else-if="presion_arterial==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Diabetes mellitus</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="diabetes==1">SI</span>
                        <span v-else-if="diabetes==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Cancer</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="cancer==1">SI</span>
                        <span v-else-if="cancer==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Tuberculosis</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="tuberculosis==1">SI</span>
                        <span v-else-if="tuberculosis==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Enfermedad neurologica o nerviosa</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="neurologica==1">SI</span>
                        <span v-else-if="neurologica==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Asma y/o alergias</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="asma==1">SI</span>
                        <span v-else-if="asma==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Enfermedad reumatica</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="reumatica==1">SI</span>
                        <span v-else-if="reumatica==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>


               
            </v-row>

            <span  class="text-h5">Historia Medica personal</span>

            <v-row class="my-5">
                 
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Alergias</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="alergias==1">SI</span>
                        <span v-else-if="alergias==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
                </v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Asma, tos crónica, neumonía, tuberculosis</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="asma_hi==1">SI</span>
                        <span v-else-if="asma_hi==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
 

                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Enfermedad cardiaca, presión arterial elevada, soplo</span>
                    
                </v-col>

                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="cardiaca==1">SI</span>
                        <span v-else-if="cardiaca==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Dolor en el tórax,dificultad respiratoria</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="torax==1">SI</span>
                        <span v-else-if="torax==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Epilepsia, pérdida del conocimiento,ansiedad</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="epilepsia==1">SI</span>
                        <span v-else-if="epilepsia==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>

                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Diabetes</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="diabetes==1">SI</span>
                        <span v-else-if="diabetes==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Cancer</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="cancer_hi==1">SI</span>
                        <span v-else-if="cancer_hi==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Úlcera, hernia hiatal, gastritis,trastorno digestivo</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="ulcera==1">SI</span>
                        <span v-else-if="ulcera==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Pérdida de un riñón u otro órgano</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="rinnon==1">SI</span>
                        <span v-else-if="rinnon==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Pérdida inexplicable de peso</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="peso_perdida==1">SI</span>
                        <span v-else-if="peso_perdida==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>


                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Problemas visuales</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="visuales==1">SI</span>
                        <span v-else-if="visuales==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Problemas de audición</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="audicion==1">SI</span>
                        <span v-else-if="audicion==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Padecimientos reumáticos</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="reumaticos==1">SI</span>
                        <span v-else-if="reumaticos==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Cirugías</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="cirugias==1">SI</span>
                        <span v-else-if="cirugias==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Alteraciones menstruales</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="menstruales==1">SI</span>
                        <span v-else-if="menstruales==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>


                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Esguinces, fracturas, lesión muscular,luxación</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="esguince==1">SI</span>
                        <span v-else-if="esguince==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Fuma</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="fuma==1">SI</span>
                        <span v-else-if="fuma==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Ingestion de alcohol</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        <span v-if="ingerir_alcohol==1">SI</span>
                        <span v-else-if="ingerir_alcohol==2">NO</span>
                        <span v-else>NA</span>
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Edad Primera Mestruacion</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        {{edad_menstruacion}}
                        <!-- <span v-else-if="edad_menstruacion==2">NO</span> -->
                        <!-- <span v-else>NA</span> -->
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Numero embarazos</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        {{numero_embarazo}}
                    </v-chip>
</v-col>

                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Numero partos</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        {{numero_partos}}
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Cesáreas</span>
                   
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                        {{numero_cesareas}}
                    </v-chip>
</v-col>
                <v-col cols="3" class="d-flex align-center redx py-2 my-1">
                    <span class="mr-10">Numero abortos</span>
                    
                </v-col>
                <v-col cols="1">
                    <v-chip smallx class="text-h6" color="primary">
                       {{numero_abortos}}
                    </v-chip>
</v-col>

            </v-row>

            <span class="text-h5">Alimentacion habitual</span>

            <v-row class="my-10">
                <v-col cols="3"><v-text-field readonly filled label="desayuno" v-model="desayuno"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="comida" v-model="comida"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="cena" v-model="cena"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="peso" v-model="peso"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="estatura" v-model="estatura"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="fc" v-model="fc"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="pa(mmHg)" v-model="pa"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="edad inicio practicar deporte" v-model="edad_deporte"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="ejercicio o deporte con el que inicio" v-model="deporte_inicio"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="ejercicio o deporte actual" v-model="deporte_actual"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="frecuencia" v-model="frecuencia"></v-text-field></v-col>
                <v-col cols="3"><v-text-field readonly filled label="intensidad" v-model="intensidad"></v-text-field></v-col>
            </v-row>

            <span class="text-h5">Exploracion Fisica</span>

            <v-row class="my-10">
                <v-col cols="12">
                    
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr colspan="7">
                                <th class="text-h5">Cabeza</th>
                            </tr>
                            <tr>                                
                                <th>Ojos</th>
                                <th>Nariz</th>
                                <th>Faringe</th>
                                <th>Boca</th>
                                <th>Dentadura</th>
                                <th>Audicion</th>
                                <th>Vision</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ cabeza_ojos==1?'Normal':'Anormal' }}</td>
                                <td>{{ cabeza_nariz==1?'Normal':'Anormal' }}</td>
                                <td>{{ cabeza_faringe==1?'Normal':'Anormal' }}</td>
                                <td>{{ cabeza_boca==1?'Normal':'Anormal' }}</td>
                                <td>{{ cabeza_dentadura==1?'Normal':'Anormal' }}</td>
                                <td>{{ cabeza_audicion==1?'Normal':'Anormal' }}</td>
                                <td>{{ cabeza_vision==1?'Normal':'Anormal' }}</td>
                            </tr>
                            <tr>
                                <td>{{ cabeza_ojos_txt }}</td>
                                <td>{{ cabeza_nariz_txt }}</td>
                                <td>{{ cabeza_faringe_txt }}</td>
                                <td>{{ cabeza_boca_txt }}</td>
                                <td>{{ cabeza_dentadura_txt }}</td>
                                <td>{{ cabeza_audicion_txt }}</td>
                                <td>{{ cabeza_vision_txt }}</td>
                            </tr>
                        </tbody>
                    </template>
                    </v-simple-table>

                </v-col>

                <v-col cols="12">
                    
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr colspan="7">
                                <th class="text-h5">Cuello</th>
                            </tr>
                            <tr>                                
                                <th>Forma</th>
                                <th>Volumen</th>
                                <th>Adenomegalia</th>
                                <th>Tiroides</th>
                                <th>Tumuraciones</th>
                                <th>Pulsos</th>                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ cuello_forma==1?'Normal':'Anormal' }}</td>
                                <td>{{ cuello_volumen==1?'Normal':'Anormal' }}</td>
                                <td>{{ cuello_adenomegalia==1?'Normal':'Anormal' }}</td>
                                <td>{{ cuello_tiroides==1?'Normal':'Anormal' }}</td>
                                <td>{{ cuello_tumuraciones==1?'Normal':'Anormal' }}</td>
                                <td>{{ cuello_pulsos==1?'Normal':'Anormal' }}</td>
                               
                            </tr>
                            <tr>
                                <td>{{ cuello_forma_txt }}</td>
                                <td>{{ cuello_volumen_txt }}</td>
                                <td>{{ cuello_adenomegalia_txt }}</td>
                                <td>{{ cuello_tiroides_txt }}</td>
                                <td>{{ cuello_tumuraciones_txt }}</td>
                                <td>{{ cuello_pulsos_txt }}</td>
                            </tr>
                        </tbody>
                    </template>
                    </v-simple-table>

                </v-col>

                <v-col cols="12">
                    
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr colspan="7">
                                <th class="text-h5">Tórax</th>
                            </tr>
                            <tr>                                
                                <th>Forma</th>
                                <th>Valumen</th>
                                <th>Mov ampliacion</th>
                                <th>Mov amplexacion</th>
                                <th>Precusión</th>
                                <th>Ruido Cardiacos</th>
                                <th>Campos pulmunares</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ torax_forma==1?'Normal':'Anormal' }}</td>
                                <td>{{ torax_volumen==1?'Normal':'Anormal' }}</td>
                                <td>{{ torax_mov_ampliacion==1?'Normal':'Anormal' }}</td>
                                <td>{{ torax_mov_amplexacion==1?'Normal':'Anormal' }}</td>
                                <td>{{ torax_precusion==1?'Normal':'Anormal' }}</td>
                                <td>{{ torax_cardiaco==1?'Normal':'Anormal' }}</td>
                                <td>{{ torax_pulmonares==1?'Normal':'Anormal' }}</td>
                            </tr>
                            <tr>
                                <td>{{ torax_forma_txt }}</td>
                                <td>{{ torax_volumen_txt }}</td>
                                <td>{{ torax_mov_ampliacion_txt }}</td>
                                <td>{{ torax_mov_amplexacion_txt }}</td>
                                <td>{{ torax_precusion_txt }}</td>
                                <td>{{ torax_cardiaco_txt }}</td>
                                <td>{{ torax_pulmonares_txt }}</td>
                            </tr>
                        </tbody>
                    </template>
                    </v-simple-table>

                </v-col>

                <v-col cols="12">
                    
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr colspan="7">
                                <th class="text-h5">Abdomen</th>
                            </tr>
                            <tr>                                
                                <th>Forma</th>
                                <th>Volumen</th>
                                <th>Palpitación</th>
                                <th>Precusión</th>
                                <th>Peristalsis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ abdomen_forma==1?'Normal':'Anormal' }}</td>
                                <td>{{ abdomen_volumen==1?'Normal':'Anormal' }}</td>
                                <td>{{ abdomen_palpitacion==1?'Normal':'Anormal' }}</td>
                                <td>{{ abdomen_precusion==1?'Normal':'Anormal' }}</td>
                                <td>{{ abdomen_peristalsis==1?'Normal':'Anormal' }}</td>                                
                            </tr>
                            <tr>
                                <td>{{ abdomen_forma_txt }}</td>
                                <td>{{ abdomen_volumen_txt }}</td>
                                <td>{{ abdomen_palpitacion_txt }}</td>
                                <td>{{ abdomen_precusion_txt }}</td>
                                <td>{{ abdomen_peristalsis_txt }}</td>
                            </tr>
                        </tbody>
                    </template>
                    </v-simple-table>

                </v-col>


                <v-col cols="12">
                    
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr colspan="7">
                                <th class="text-h5">Extremidades torácicas</th>
                            </tr>
                            <tr>                                
                                <th>Forma</th>
                                <th>Volumen</th>
                                <th>Movilidad articular</th>
                                <th>Pulsos</th>
                                <th>Sensibilidad</th>
                                <th>Reflejos onsotendinosos</th>                             
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ toracico_forma==1?'Normal':'Anormal' }}</td>
                                <td>{{ toracico_volumen==1?'Normal':'Anormal' }}</td>
                                <td>{{ toracico_movilidad==1?'Normal':'Anormal' }}</td>
                                <td>{{ toracico_pulsos==1?'Normal':'Anormal' }}</td>
                                <td>{{ toracico_sensibilidad==1?'Normal':'Anormal' }}</td>
                                <td>{{ toracico_reflejos==1?'Normal':'Anormal' }}</td>
                            </tr>
                            <tr>
                                <td>{{ toracico_forma_txt }}</td>
                                <td>{{ toracico_volumen_txt }}</td>
                                <td>{{ toracico_movilidad_txt }}</td>
                                <td>{{ toracico_pulsos_txt }}</td>
                                <td>{{ toracico_sensibilidad_txt }}</td>
                                <td>{{ toracico_reflejos_txt }}</td>
                            </tr>
                        </tbody>
                    </template>
                    </v-simple-table>

                </v-col>


                <v-col cols="12">
                    
                    <v-simple-table>
                        <template v-slot:default>
                        <thead>
                            <tr colspan="7">
                                <th class="text-h5">Extremidades pélvicas</th>
                            </tr>
                            <tr>                                
                                <th>Forma</th>
                                <th>Volumen</th>
                                <th>Movilidad articular</th>
                                <th>Pulsos</th>
                                <th>Reflejos onsotendinosos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ pelvicas_forma==1?'Normal':'Anormal' }}</td>
                                <td>{{ pelvicas_volumen==1?'Normal':'Anormal' }}</td>
                                <td>{{ pelvicas_movilidad==1?'Normal':'Anormal' }}</td>
                                <td>{{ pelvicas_pulsos==1?'Normal':'Anormal' }}</td>
                                <td>{{ pelvicas_reflejos==1?'Normal':'Anormal' }}</td>
                            </tr>
                            <tr>
                                <td>{{ pelvicas_forma_txt }}</td>
                                <td>{{ pelvicas_volumen_txt }}</td>
                                <td>{{ pelvicas_movilidad_txt }}</td>
                                <td>{{ pelvicas_pulsos_txt }}</td>
                                <td>{{ pelvicas_reflejos_txt }}</td>
                            </tr>
                        </tbody>
                    </template>
                    </v-simple-table>

                </v-col>
            </v-row>


      </div>
      <v-divider vertical></v-divider>
      <div class="bluex flex-grow-1 px-10 imprimir-histo" style="height: 100%;">
        <v-toolbar elevation=0 color="transparent" data-html2canvas-ignore="true">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="printerHistorial">imprimir</v-btn>
        </v-toolbar>
        <v-timeline reverse>
    <v-timeline-item small :class="{'text-right':index%2}" v-for="(histo,index) in lst_historial">
       

        
        <!-- <div>
            {{ histo.descripcion }}
        </div> -->

        <v-card class="elevation-2" color="white">
        <!-- <v-card-title class="text-h5">
          Lorem ipsum
        </v-card-title> -->
        <v-card-text class="white">
            {{ histo.descripcion }}
        </v-card-text>
      </v-card>
    
        <template v-slot:opposite>
        <span
          :class="`headline font-weight-bold secondary--text`"
          v-text="dayjs(histo.fecha_registro).format('DD-MMM-YYYY')"
        ></span>
        <h4 :class="`font-weight-light mb-4 primary--text`">
            
          {{dayjs(histo.hora_inicio,'H:mm:ss').format('H:mm')}} a {{ dayjs(histo.hora_fin,'H:mm:ss').format('H:mm') }}
        </h4>
      </template>

    </v-timeline-item>
    <!-- <v-timeline-item class="text-right">
      timeline item
    </v-timeline-item>
    <v-timeline-item>timeline item</v-timeline-item> -->
  </v-timeline>
      </div>




      <v-dialog v-model="dialog" width="500" persistent scrollable>
            <v-card>
                <v-toolbar color="primary" extended extension-height="70">
                    <v-toolbar-title class="white--text">
                        Buscar Persona
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>

                    <template #extension>
                        <div class="d-flex flex-column flex-grow-1 mt-5" style="row-gap: 10px;">

                            <v-divider class="white"></v-divider>
                            <v-text-field v-model="nombre" dark outlinedx solo-inverted label="Nombre socio"
                                    @keyup.enter="fnAllPersonas"></v-text-field>
                        </div>
                    </template>
                </v-toolbar>
                <v-card-text class="pt-5">

                        <div class="pr-2" style="min-height:100%;width: 100%;">
                            
                            <v-list>
                                <v-list-item @click="fnFindPersonaById(persona.cve_persona)" v-for="persona in lst_personas"
                                    :key="persona.cve_persona">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ persona.nombre }} {{ persona.apellido_paterno
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </div>
                       
                </v-card-text>
            </v-card>
        </v-dialog>
 </div>

</template>

<script setup>
import {ref} from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import numeral from 'numeral'
import html2canvas  from 'html2canvas'
import {saveAs} from 'file-saver'
import jsPDF from 'jspdf'
import { allPersonasService, findPersonaByIdService,getReporteExamenHistorial} from '@/services/historial_medico_service'

dayjs.extend(customParseFormat)

const dialog = ref(false)
let id_persona=0
const nombre = ref();

const nombre_text=ref('')
const accion_text=ref('')

const lst_personas = ref([])

const lst_historial = ref([])


//datos de examen 
const observaciones=ref()
const factores_riesgo=ref()

const cardiovascular=ref()
const presion_arterial=ref()
const diabetes=ref()
const cancer=ref()
const tuberculosis=ref()
const neurologica=ref()
const asma=ref()
const reumatica=ref()

//historia medica personal
const alergias=ref()
const asma_hi=ref()
const cardiaca=ref()
const torax=ref()
const epilepsia=ref()
const diabetes_hi=ref()
const cancer_hi=ref()
const ulcera=ref()
const rinnon=ref()
const peso_perdida=ref()
const visuales=ref()
const audicion=ref()
const reumaticos=ref()
const cirugias=ref()
const menstruales=ref()
const esguince=ref()
const fuma=ref()
const ingerir_alcohol=ref()
const edad_menstruacion=ref()
const numero_embarazo=ref()
const numero_partos=ref()
const numero_cesareas=ref()
const numero_abortos=ref()

const desayuno=ref()
const comida=ref()
const cena=ref()
const peso=ref()
const estatura=ref()
const fc=ref()
const pa=ref()
const edad_deporte=ref()
const deporte_inicio=ref()
const deporte_actual=ref()
const frecuencia=ref()
const intensidad=ref()

const cabeza_ojos=ref()
const cabeza_ojos_txt=ref()
const cabeza_nariz=ref()
const cabeza_nariz_txt=ref()
const cabeza_faringe=ref()
const cabeza_faringe_txt=ref()
const cabeza_boca=ref()
const cabeza_boca_txt=ref()
const cabeza_dentadura=ref()
const cabeza_dentadura_txt=ref()
const cabeza_audicion=ref()
const cabeza_audicion_txt=ref()
const cabeza_vision=ref()
const cabeza_vision_txt=ref()

const cuello_forma=ref()
const cuello_forma_txt=ref()
const cuello_volumen=ref()
const cuello_volumen_txt=ref()
const cuello_adenomegalia=ref()
const cuello_adenomegalia_txt=ref()
const cuello_tiroides=ref()
const cuello_tiroides_txt=ref()
const cuello_tumuraciones=ref()
const cuello_tumuraciones_txt=ref()
const cuello_pulsos=ref()
const cuello_pulsos_txt=ref()

const torax_forma=ref()
const torax_forma_txt=ref()
const torax_volumen=ref()
const torax_volumen_txt=ref()
const torax_mov_ampliacion=ref()
const torax_mov_ampliacion_txt=ref()
const torax_mov_amplexacion=ref()
const torax_mov_amplexacion_txt=ref()
const torax_precusion=ref()
const torax_precusion_txt=ref()
const torax_cardiaco=ref()
const torax_cardiaco_txt=ref()
const torax_pulmonares=ref()
const torax_pulmonares_txt=ref()


const abdomen_forma=ref()
const abdomen_forma_txt=ref()
const abdomen_volumen=ref()
const abdomen_volumen_txt=ref()
const abdomen_palpitacion=ref()
const abdomen_palpitacion_txt=ref()
const abdomen_precusion=ref()
const abdomen_precusion_txt=ref()
const abdomen_peristalsis=ref()
const abdomen_peristalsis_txt=ref()

const toracico_forma=ref()
const toracico_forma_txt=ref()
const toracico_volumen=ref()
const toracico_volumen_txt=ref()
const toracico_movilidad=ref()
const toracico_movilidad_txt=ref()
const toracico_pulsos=ref()
const toracico_pulsos_txt=ref()
const toracico_sensibilidad=ref()
const toracico_sensibilidad_txt=ref()
const toracico_reflejos=ref()
const toracico_reflejos_txt=ref()


const pelvicas_forma=ref()
const pelvicas_forma_txt=ref()
const pelvicas_volumen=ref()
const pelvicas_volumen_txt=ref()
const pelvicas_movilidad=ref()
const pelvicas_movilidad_txt=ref()
const pelvicas_pulsos=ref()
const pelvicas_pulsos_txt=ref()
const pelvicas_reflejos=ref()
const pelvicas_reflejos_txt=ref()









function  openBuscar()
{
    dialog.value=true;
    nombre.value=''
    lst_personas.value=[]
}

async function fnAllPersonas() {

try {
  const dataSend = { nombre: nombre.value }
  const data = await allPersonasService(dataSend)
  lst_personas.value = data
  console.log(data)
}
catch (e) { }

}

async function fnFindPersonaById(id)
{

try {
  const dataSend = { nombre: nombre.value }
  const data = await findPersonaByIdService(id)

//datos de la persona salen de data
  id_persona=data.cve_persona
  nombre_text.value=`${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`
  accion_text.value=data.accion
  dialog.value=false
  nombre.value=''

  const data2 =await getReporteExamenHistorial(id);

  lst_historial.value=data2.historial

  observaciones.value=data2.examen.observacion
  factores_riesgo.value=data2.examen.factores_riesgo

  cardiovascular.value=data2.examen.cardio_vascular
  presion_arterial.value=data2.examen.presion
  diabetes.value=data2.examen.diabetes
  cancer.value=data2.examen.cancer
  tuberculosis.value=data2.examen.tuberculosis
  neurologica.value=data2.examen.neurologica
  asma.value=data2.examen.asma
  reumatica.value=data2.examen.reumatica


alergias.value=data2.examen.alergias
asma_hi.value=data2.examen.asma
cardiaca.value=data2.examen.cardiaca
torax.value=data2.examen.torax
epilepsia.value=data2.examen.epilepsia
diabetes_hi.value=data2.examen.diabetes
cancer_hi.value=data2.examen.cancer
ulcera.value=data2.examen.ulcera
rinnon.value=data2.examen.rinon
peso_perdida.value=data2.examen.perdida_peso
visuales.value=data2.examen.visual
audicion.value=data2.examen.audicion
reumaticos.value=data2.examen.reumaticos
cirugias.value=data2.examen.cirugias
menstruales.value=data2.examen.menstruales
esguince.value=data2.examen.esguince
fuma.value=data2.examen.fuma
ingerir_alcohol.value=data2.examen.ingestion_alcohol
edad_menstruacion.value=data2.examen.primera_mestruacion
numero_embarazo.value=data2.examen.n_embarazos
numero_partos.value=data2.examen.n_partos
numero_cesareas.value=data2.examen.n_cesareas
numero_abortos.value=data2.examen.n_abortos


desayuno.value=data2.examen.desayuno
comida.value=data2.examen.comida
cena.value=data2.examen.cena
peso.value=data2.examen.peso
estatura.value=data2.examen.estatura
fc.value=data2.examen.fc
pa.value=data2.examen.pa
edad_deporte.value=data2.examen.edad_inicio
deporte_inicio.value=data2.examen.deporte_inicia
deporte_actual.value=data2.examen.deporte_actual
frecuencia.value=data2.examen.frecuencia
intensidad.value=data2.examen.instensidad

cabeza_ojos.value=data2.examen.cabeza_ojos
cabeza_ojos_txt.value=data2.examen.cabeza_ojos_txt
cabeza_nariz.value=data2.examen.cabeza_nariz
cabeza_nariz_txt.value=data2.examen.cabeza_nariz_txt
cabeza_faringe.value=data2.examen.cabeza_faringe
cabeza_faringe_txt.value=data2.examen.cabeza_faringe_txt
cabeza_boca.value=data2.examen.cabeza_boca
cabeza_boca_txt.value=data2.examen.cabeza_boca_txt
cabeza_dentadura.value=data2.examen.cabeza_dentadura
cabeza_dentadura_txt.value=data2.examen.cabeza_dentadura_txt
cabeza_audicion.value=data2.examen.cabeza_audicion
cabeza_audicion_txt.value=data2.examen.cabeza_audicion_txt
cabeza_vision.value=data2.examen.cabeza_vision
cabeza_vision_txt.value=data2.examen.cabeza_vision_txt


cuello_forma.value=data2.examen.cuello_forma
cuello_forma_txt.value=data2.examen.cuello_forma_txt
cuello_volumen.value=data2.examen.cuello_volumen
cuello_volumen_txt.value=data2.examen.cuello_volumen_txt
cuello_adenomegalia.value=data2.examen.cuello_adenome
cuello_adenomegalia_txt.value=data2.examen.cuello_adenome_txt
cuello_tiroides.value=data2.examen.cuello_tiroides
cuello_tiroides_txt.value=data2.examen.cuello_tiroides_txt
cuello_tumuraciones.value=data2.examen.cuello_tumuraciones
cuello_tumuraciones_txt.value=data2.examen.cuello_tumuraciones_txt
cuello_pulsos.value=data2.examen.cuello_pulsos
cuello_pulsos_txt.value=data2.examen.cuello_pulsos_txt

torax_forma.value=data2.examen.torax_forma
torax_forma_txt.value=data2.examen.torax_forma_txt
torax_volumen.value=data2.examen.torax_volumen
torax_volumen_txt.value=data2.examen.torax_volumen_txt
torax_mov_ampliacion.value=data2.examen.torax_ampliacion
torax_mov_ampliacion_txt.value=data2.examen.torax_ampliacion_txt
torax_mov_amplexacion.value=data2.examen.torax_amplexa
torax_mov_amplexacion_txt.value=data2.examen.torax_amplexa_txt
torax_precusion.value=data2.examen.torax_precusion
torax_precusion_txt.value=data2.examen.torax_precusion_txt
torax_cardiaco.value=data2.examen.torax_cardiaco
torax_cardiaco_txt.value=data2.examen.torax_cardiaco_txt
torax_pulmonares.value=data2.examen.torax_pulmonares
torax_pulmonares_txt.value=data2.examen.torax_pulmonares_txt


abdomen_forma.value=data2.examen.abdomen_forma
abdomen_forma_txt.value=data2.examen.abdomen_forma_txt
abdomen_volumen.value=data2.examen.abdomen_volumen
abdomen_volumen_txt.value=data2.examen.abdomen_volumen_txt
abdomen_palpitacion.value=data2.examen.abdomen_palpitacion
abdomen_palpitacion_txt.value=data2.examen.abdomen_palpitacion_txt
abdomen_precusion.value=data2.examen.abdomen_percusion
abdomen_precusion_txt.value=data2.examen.abdomen_percusion_txt
abdomen_peristalsis.value=data2.examen.abdomen_peristalsis
abdomen_peristalsis_txt.value=data2.examen.abdomen_peristalsis_txt


toracico_forma.value=data2.examen.toracicas_forma
toracico_forma_txt.value=data2.examen.toracicas_forma_txt
toracico_volumen.value=data2.examen.toracicas_volumen
toracico_volumen_txt.value=data2.examen.toracicas_volumen_txt
toracico_movilidad.value=data2.examen.toracicas_movilidad
toracico_movilidad_txt.value=data2.examen.toracicas_movilidad_txt
toracico_pulsos.value=data2.examen.toracicas_pulso
toracico_pulsos_txt.value=data2.examen.toracicas_pulso_txt
toracico_sensibilidad.value=data2.examen.toracicas_sensibilidad
toracico_sensibilidad_txt.value=data2.examen.toracicas_sensibilidad_txt
toracico_reflejos.value=data2.examen.toracicas_osteo
toracico_reflejos_txt.value=data2.examen.toracicas_osteo_txt


pelvicas_forma.value=data2.examen.pelvicas_forma
pelvicas_forma_txt.value=data2.examen.pelvicas_forma_txt
pelvicas_volumen.value=data2.examen.pelvicas_volumen
pelvicas_volumen_txt.value=data2.examen.pelvicas_volumen_txt
pelvicas_movilidad.value=data2.examen.pelvicas_articular
pelvicas_movilidad_txt.value=data2.examen.pelvicas_articular_txt
pelvicas_pulsos.value=data2.examen.pelvicas_sensibilidad
pelvicas_pulsos_txt.value=data2.examen.pelvicas_sensibilidad_txt
pelvicas_reflejos.value=data2.examen.pelvicas_osteo
pelvicas_reflejos_txt.value=data2.examen.pelvicas_osteo_txt










  
}
catch (e) { }
}


function printerExamen()
{
    html2canvas(document.querySelector('.imprimir-examen'),
    {             
       // height: window.outerHeight + window.innerHeight,
        //windowHeight: window.outerHeight + window.innerHeigh
        //windowWidth: document.querySelector('.imprimir-examen').scrollWidth,
        windowHeight: document.querySelector('.imprimir-examen').scrollHeight
    }).then(function(canvas) {

//saveAs(canvas.toDataURL(), 'file-name.pdf');

//canvas.toBlob(function(blob) {});
    		// saveAs(blob, "canvas_images_leo.pdf");

            var pdf= new jsPDF('p','px',[canvas.width,canvas.height])

            var widthx = pdf.internal.pageSize.getWidth();
            var heightx = pdf.internal.pageSize.getHeight();
            pdf.addImage(canvas, 'PNG', 0, 0,widthx,heightx);
            // pdf.save("download.pdf");
            pdf.output("dataurlnewwindow")
    	

});
}

async function printerHistorial()
{
    const canvas=await html2canvas(document.querySelector('.imprimir-histo'),
    {windowHeight: document.querySelector('.imprimir-histo').scrollHeight})
            var pdf= new jsPDF('p','px',[canvas.width,canvas.height])
            var widthx = pdf.internal.pageSize.getWidth();
            var heightx = pdf.internal.pageSize.getHeight();
            pdf.addImage(canvas, 'PNG', 0, 0,widthx,heightx);
            pdf.output("dataurlnewwindow")
}

</script>