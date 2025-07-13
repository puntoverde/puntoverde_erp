<template>
  <div>

    <div class="d-flex justify-space-between mb-5">
      <div class="d-flex">
        <!-- :outlined="attrs['aria-expanded'] == 'true'" -->
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-on="on" v-bind="attrs" fab small dark elevation="1" @click="fnAddInscripcion">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
<span>Realizar registro</span>
</v-tooltip> -->

        <h1 class="accent--text oswald--text">Cursos de Verano</h1>

      </div>

      <Search v-model="search" :filters="filters" @emit-buscar="" />
    </div>

    <div class="d-flex">

      <div style="width: 20%;height: calc(100vh - 195px);row-gap: 30px;"
        class="d-flex flex-column align-center justify-centerx">

        <span class="text-h4 accent--text">Curso </span>
        <span class="text-h3 accent--text">Verano</span>
        <span class="text-h2 accent--text">2025</span>

        <v-btn color="primary" @click="fnAddInscripcion" style="width: 250px;height: 250px;" rounded="xl">
          <div class="d-flex flex-column">
            <span class="text-h4 font-weight-bold">Crear</span>
            <span class="text-h4 font-weight-bold">Registro</span>
          </div>
        </v-btn>
        <v-btn @click="fnOpenRegistroColaboradro" color="secondary" rounded large>Colaboradores</v-btn>
      </div>
      <div style="width: 80%;">

        <v-data-table :headers="headers" :items="lst_inscripciones" :search="search" :page.sync="page"
          :items-per-page="itemsPerPage" class="table-pv rounded-xl elevation-5" hide-default-footer>
          <template v-slot:top="{ pagination }">
            <div class="d-flex justify-end align-center">
              <span class="mr-2 text-caption">filas por pagina</span>
              <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
              <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
              <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
            </div>
          </template>

          <template v-slot:footer="{ props }">
            <div>{{ props.pagination.itemsLength }} registro(s)</div>
          </template>

          <template v-slot:item.nombre="{ item }">
            <span>{{ item.nombre }}</span><span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span><span
              class="font-italic">{{ item.apellido_materno }}</span>
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
              :class="{ 'primary--text': item.obligatoria, 'secondary--text': !item.obligatoria }">{{ item.obligatoria ?
                'SI' : 'NO' }}</span>
          </template>

          <template v-slot:item.estatus="{ item }">
            <v-icon v-if="item.estatus==1" color="success">mdi-check-circle</v-icon>
            <v-icon v-else color="error">mdi-close-circle</v-icon>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="redx" style="width: 80px;" v-if="item.estatus==1">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" x-small icon outlined color="secondary" class="mr-1"
                    @click="fnGetReingreso(item.cve_curso_verano_inscripcion)" fab><v-icon>mdi-redo</v-icon></v-btn>
                </template>
                <span>Reingresar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="fnBajaIncripcionCurso(item.cve_curso_verano_inscripcion)" v-on="on" x-small icon outlined color="grey darken-3" class="ml-1"
                    fab><v-icon>mdi-trash-can</v-icon></v-btn>
                </template>
                <span>Cancelacion</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>

      </div>

    </div>





    <v-dialog v-model="dialog_recibo" width="450" content-class="rounded-xl" scrollable>
      <v-card rounded="xl">
        <v-toolbar elevation="0">
          <v-toolbar-title>Cosultar recibo</v-toolbar-title>
          <template v-slot:extension>
            <div class="d-flex align-center redx mb-3" style="width: 100%;column-gap: 10px;">
              <span>Folio de recibo:</span>
              <v-text-field v-model="folio" outlined dense hide-details style="max-width: 150px;font-size: 30px;"
                reverse v-mask="'########'" @keyup.enter="getCargosByFolio"></v-text-field>
              <v-btn @click="getCargosByFolio"> <v-icon>mdi-magnify</v-icon> buscar</v-btn>
            </div>
          </template>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text style="min-height: 100px;" class="pa-0">
          <v-list v-if="lst_cargos.length > 0">
            <v-list-item v-for="cargos in lst_cargos" @click="fnOpenRegistro(cargos)">
              <v-list-item-content>
                <v-list-item-title><v-icon>mdi-account</v-icon> <span>{{ cargos.nombre }}</span> <span
                    class="font-weight-bold">{{ cargos.apellido_paterno }}</span> <span class="font-italic">{{
                      cargos.apellido_materno }}</span> </v-list-item-title>
                <v-list-item-subtitle>{{ cargos.concepto }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                ${{ numeral(cargos.total).format('0,0') }}
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <div v-else class="redx d-flex justify-center align-center text-h5 accent--text"
            style="width: 100%;height: 100%;">Sin datos</div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_inscripcion" persistent scrollable width="900">

      <v-card class="rounded-xl">

        <v-toolbar elevation="0" height="75">
          <v-toolbar-title>Cédula de inscripción</v-toolbar-title>
          <v-text-field v-model="folio_boleta" hide-details outlined dense placeholder="folio boleta" reverse
            v-mask="'########'" style="max-width: 110px;font-size: 18px;" class="ml-5 rounded-xl elevation-1 xtext-h6"
            color="secondary" roundedx :error-messages="iErrors.folio_boleta"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseRegistro">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <template v-slot:extension>
            <div class="d-flex justify-space-between blue-grey lighten-5 rounded-xl px-5 py-1" style="width: 100%;">
              <div><span class="text-subtitle-1 font-weight-bold mr-1 accent--text">Curso:</span><span
                  class="text-subtitle-1 font-weight-bold">2025</span></div>
              <div><span class="text-subtitle-1 font-weight-bold mr-1 accent--text">Folio pago:</span><span
                  class="text-subtitle-1 font-weight-bold">{{ folio }}</span></div>
              <div><span class="text-subtitle-1 font-weight-bold mr-1 accent--text">Cargo:</span><span
                  class="text-subtitle-1 font-weight-bold">${{ numeral(costo).format('0,0') }}</span></div>
              <div>
                <span class="text-subtitle-1 font-weight-bold mr-1 accent--text">Num Accion:</span>
                <span v-if="cve_cuota == 42" class="text-subtitle-1 font-weight-bold">{{ numero_accion }}</span>
                <span v-if="cve_cuota == 43" class="text-subtitle-1 font-weight-bold">Invitado</span>
                <span v-if="cve_cuota == 102" class="text-subtitle-1 font-weight-bold">Colaborador</span>
              </div>
            </div>
          </template>
        </v-toolbar>
        <v-divider inset></v-divider>

        <v-card-text class="pt-2">

          <span>semanas</span>
          <div class="d-flex">
            <div class="d-flex justify-center align-center text-h4" style="width: 90px;">{{ semanas.length }}</div>
            <v-divider vertical class="mx-1"></v-divider>
            <div class="d-flex justify-space-around white" style="width: 100%;">
              <div class="bluex d-flex align-center">
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 1" hide-details value="semana1"
                  :error-messages="iErrors.semana1"></v-checkbox>
              </div>
              <div class="bluex d-flex align-center">
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 2" hide-details value="semana2"
                  :error-messages="iErrors.semana2"></v-checkbox>
              </div>
              <div class="bluex d-flex align-center">
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 3" hide-details value="semana3"
                  :error-messages="iErrors.semana3"></v-checkbox>
              </div>
              <div class="bluex d-flex align-center">
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 4" hide-details value="semana4"
                  :error-messages="iErrors.semana4"></v-checkbox>
              </div>
            </div>
          </div>


          <div class="redx d-flex justify-space-between mt-2" style="column-gap: 5px;">


            <div class="redx">

              <span
                class="text-subtitle-1 font-weight-bold accent--text text-decoration-underline redx d-flex justify-start">Datos
                personales</span>

              <div class="d-flex bluex" style="column-gap: 15px;">
                <div>
                  <span>Nombre</span>
                  <v-menu v-model="menu_socios" v-if="cve_cuota == 42" content-class="rounded-xl">
                    <template v-slot:activator="{ on, attrs }">
                      <span class="text-decoration-underline text-subtitle-2 blue--text ml-3"
                        @click="fnGetSociosInAccion" v-bind="attrs">
                        <v-icon small color="blue">mdi-account</v-icon> cambiar socio</span>
                    </template>
                    <v-card width="350" class="rounded-xl">
                      <v-list dense>
                        <v-list-item v-for="socios_ in lst_socios_accion" @click="fnCambiarSocio(socios_)">
                          <v-list-item-content>
                            <v-list-item-title><v-icon>mdi-account</v-icon> <span>{{ socios_.nombre }}</span> <span
                                class="font-weight-bold">{{ socios_.apellido_paterno }}</span> <span
                                class="font-italic">{{
                                  socios_.apellido_materno }}</span> </v-list-item-title>
                            <v-list-item-subtitle>{{ socios_.sexo }} - {{ dayjs().diff(socios_.fecha_nacimiento, "year")
                            }}
                              años</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item-action>
                            {{ socios_.posicion }}
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-card>

                  </v-menu>
                  <div class="d-flex" style="column-gap: 5px;">
                    <v-text-field v-model="nombre" placeholder="Nombre" outlined dense hide-details
                      :error-messages="iErrors.nombre" class="my-mayus"></v-text-field>
                    <v-text-field v-model="paterno" placeholder="Apellido Paterno" outlined dense hide-details
                      :error-messages="iErrors.paterno" class="my-mayus"></v-text-field>
                    <v-text-field v-model="materno" placeholder="Apellido Materno" outlined dense hide-details
                      :error-messages="iErrors.materno" class="my-mayus"></v-text-field>
                  </div>
                </div>
                <!-- <div style="width: 110px;">
                        <span>Usuario</span>
                        <v-text-field outlined dense></v-text-field>
                    </div>
                    <div>
                        <span>Invitado</span>
                        <v-checkbox small></v-checkbox>
                    </div> -->
              </div>
              <div class="d-flex redx justify-space-betweenx mt-3" style="column-gap: 25px;">

                <div style="width: 280px;" class="bluex">
                  <span>fecha nacimiento</span>
                  <div class="d-flex redx align-end">
                    <v-menu v-model="menu_nacimiento" ref="ref_nacimiento" :close-on-content-click="false"
                      transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-on="on" v-bind="attrs" icon
                          :color="Boolean(iErrors.nacimiento) ? 'red' : ''"><v-icon>mdi-calendar</v-icon></v-btn>
                      </template>
                      <v-card>
                        <v-date-picker v-model="nacimiento" :active-picker.sync="activePicker"
                          @change="saveNacimiento"></v-date-picker>
                        <!-- min="1950-01-01" -->
                        <!-- :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)" -->
                      </v-card>
                    </v-menu>
                    <span class="text-h6">{{ dayjs(nacimiento).isValid() ? dayjs(nacimiento).format(`DD [de] MMMM [de]
                      YYYY`) : 'NA' }}</span>
                  </div>
                </div>



                <div style="width: 100px;" class="redx">
                  <span>Edad</span>
                  <div class="bluex pl-5">
                    <span class="text-h5">{{ cEdad }}</span> <span>años</span>
                  </div>
                </div>



                <div>
                  <span>Genero:</span>
                  <!-- <div class="d-flex align-end" style="column-gap: 5px;">
                    <span class="text-subtitle-1 font-weight-bold" style="height: 22px">M.</span>
                    <v-checkbox class="mt-0 check-size" hide-details></v-checkbox>
                    <span class="text-subtitle-1 font-weight-bold" style="height: 22px">F.</span>
                    <v-checkbox class="mt-0 check-size" hide-details></v-checkbox>
                  </div> -->
                  <v-radio-group v-model="genero" class="mt-0" row hide-details :error-messages="iErrors.genero">
                    <span class="text-subtitle-1 font-weight-bold mr-2" style="height: 22px;color: #0009;">M.</span>
                    <v-radio value="Masculino" class="check-size" off-icon="mdi-checkbox-blank-outline"
                      on-icon="mdi-checkbox-marked"></v-radio>
                    <span class="text-subtitle-1 font-weight-bold mr-2" style="height: 22px;color: #0009;">F.</span>
                    <v-radio value="Femenino" class="check-size" off-icon="mdi-checkbox-blank-outline"
                      on-icon="mdi-checkbox-marked"></v-radio>
                  </v-radio-group>
                </div>
              </div>
            </div>

            {{ foto }}
            <!-- {{ foto_view }} -->
            <div
              style="width: 130px; height: 161px;border:2px solid; background-size: cover;background-repeat: no-repeat;position: relative;"
              :style="{ backgroundImage: `url(${foto_view})`, borderColor: Boolean(iErrors.foto) ? 'red' : '#9e9e9e' }"
              class="greyx rounded-lg">
              <!-- <img v-if="foto" :src="foto_view" alt="" width="130px" height="161px" style="margin-left: 5%;margin-top: 5%;">
              <img v-else src="@/assets/nina.png" width="90%" height="90%" style="margin-left: 5%;margin-top: 5%;"></img>-->
              <v-btn fab x-small style="position:absolute; bottom: -15px;left: -10px;" color="info"
                @click="fnOpenCamara"><v-icon>mdi-camera</v-icon></v-btn>
              <!-- <v-btn fab x-small style="bottom: 10px;left: 5px;" color="info"><v-icon>mdi-folder-image</v-icon></v-btn> -->

            </div>


          </div>


          <span
            class="text-subtitle-1 font-weight-bold accent--text text-decoration-underline redx d-flex justify-start mt-3">Padre,
            Madre o Tutor</span>
          <div class="d-flex" style="column-gap: 5px;">
            <div class="flex-grow-1">
              <span>Nombre Completo</span>
              <v-text-field v-model="tutor" outlined dense hide-details :error-messages="iErrors.tutor"
                class="my-mayus"></v-text-field>
            </div>
            <div>
              <span>telefono de contacto</span>
              <v-text-field v-model="telefono_contacto" outlined dense hide-details
                :error-messages="iErrors.telefono_contacto" class="my-mayus" v-mask="'(###)#######'"></v-text-field>
            </div>
          </div>
          <div class="d-flex" style="column-gap: 5px;">
            <div class="flex-grow-1">
              <span>Calle y numero</span>
              <v-text-field v-model="calle_numero" outlined dense hide-details :error-messages="iErrors.calle_numero"
                class="my-mayus"></v-text-field>
            </div>
            <div>
              <span>Colonia</span>
              <v-text-field v-model="colonia" outlined dense hide-details :error-messages="iErrors.colonia"
                class="my-mayus"></v-text-field>
            </div>
          </div>

          <span
            class="text-subtitle-1 font-weight-bold accent--text text-decoration-underline redx d-flex justify-start mt-3">Datos
            Extras</span>

          <div class="d-flex justify-space-between" style="column-gap: 15px;">
            <div style="width: 280px;">
              <span>Fecha inscripcion</span>
              <div class="text-h6">{{ fecha_inscripcion }}</div>
            </div>
            <div>
              <span>¿Sabe nadar?</span>
              <!-- <div class="d-flex align-end" style="column-gap: 8px;">
                <span class="text-subtitle-1 font-weight-bold" style="height: 22px">Si</span>
                <v-checkbox hide-details class="mt-0 check-size"></v-checkbox>
                <span class="text-subtitle-1 font-weight-bold" style="height: 22px">No</span>
                <v-checkbox hide-details class="mt-0 check-size"></v-checkbox>
              </div> -->
              <v-radio-group v-model="nadar" class="mt-0 ml-0 mr-0" row hide-details style="width: 150px;"
                :error-messages="iErrors.nadar">
                <span class="text-subtitle-1 font-weight-bold mr-2" style="height: 22px;color: #0009;">Si.</span>
                <v-radio :value="1" class="check-size mr-0" off-icon="mdi-checkbox-blank-outline"
                  on-icon="mdi-checkbox-marked"></v-radio>
                <span class="text-subtitle-1 font-weight-bold mr-2" style="height: 22px;color: #0009;">No.</span>
                <v-radio :value="0" class="check-size mr-0" off-icon="mdi-checkbox-blank-outline"
                  on-icon="mdi-checkbox-marked"></v-radio>
              </v-radio-group>
            </div>
            <div>
              <span>Programa</span>
              <v-select v-model="programa" :items="lst_programa" item-value="cve_curso_verano_programa"
                item-text="nombre" placeholder="programa" outlined dense hide-details @change="fnGetProgramasGrupo"
                :error-messages="iErrors.programa"></v-select>
            </div>
            <div>
              <span>Grupo</span>
              <v-select v-model="grupo" placeholder="Grupo" :items="lst_grupos"
                item-value="cve_curso_verano_programa_grupo" :item-text="i => `${i.nombre} - ${i.cupo_actual}`" outlined
                dense hide-details :error-messages="iErrors.grupo"></v-select>
            </div>
          </div>
          <div class="mt-3">
            <span>Observaciones especiales(alergias,fobias,capacidades diferentes,tratamiento medico etc.)</span>
            <div><v-textarea v-model="observaciones" label="Observaciones" filled outlined rows="3" hide-details
                :error-messages="iErrors.observaciones" class="my-mayus"></v-textarea></div>
          </div>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnCreateRegistro"><v-icon>mdi-content-save</v-icon> Guardar Registro</v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>


    <v-dialog v-model="dialog_foto" width="400" persistent>

      <v-card rounded="xl">
        <v-toolbar elevation="1">
          <v-toolbar-title>tomar foto</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseFoto"> <v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">

          <div style="border:solid 1px #9e9e9e;width: 360px; height: 600px;position: relative;overflow: hidden;"
            class="rounded-lg">
            <video id="video-camara" autoplay class="rounded-xl"
              style="position: absolute;margin-left: -220px;"></video>
            <canvas id="photo-camara" style="position: absolute;"></canvas>
            <img src="@/assets/ovalo.png" style="position: absolute; width: 360px;height: 600px;" />
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnCapturePhoto" rounded color="info"><v-icon class="mr-1">mdi-camera</v-icon> captura</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>


    <v-dialog v-model="dialog_reingreso" width="300">
      <v-card class="rounded-xl">
        <v-toolbar>
          <v-toolbar-title>Reingreso</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="mt-5">

          <v-text-field outlined placeholder="Folio" hide-details class="mb-3" style="font-size: 30px;"
            reverse></v-text-field>

          <span>semanas</span>
          <div class="d-flex flex-wrap">

            <div class="d-flex flex-wrap justify-space-around white" style="width: 100%; row-gap: 15px;">
              <div class="bluex d-flex align-center" >
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 1" hide-details value="semana1"
                  :error-messages="iErrors.semana1" :disabled="!Boolean(semana1_view_ins)"></v-checkbox>
              </div>
              <div class="bluex d-flex align-center" >
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 2" hide-details value="semana2"
                  :error-messages="iErrors.semana2" :disabled="!Boolean(semana2_view_ins)"></v-checkbox>
              </div>
              <div class="bluex d-flex align-center" >
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 3" hide-details value="semana3"
                  :error-messages="iErrors.semana3" :disabled="!Boolean(semana3_view_ins)"></v-checkbox>
              </div>
              <div class="bluex d-flex align-center" >
                <v-checkbox class="mt-0 check-size" v-model="semanas" label="semana 4" hide-details value="semana4"
                  :error-messages="iErrors.semana4" :disabled="!Boolean(semana4_view_ins)"></v-checkbox>
              </div>
            </div>
          </div>

        </v-card-text>
        <v-card-actions>
          <v-btn block rounded color="primary"> Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog_colaborador" width="350">
      <v-card class="rounded-xl">
        <v-toolbar>
          <v-toolbar-title>Buscar Colaborador</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="mt-5">

          <v-text-field v-model="nomina" @keypress.enter="fnGetColaboradorByNomina" outlined placeholder="Nomina"
            hide-details class="mb-3" style="font-size: 30px;" reverse></v-text-field>

          <v-list>
            <v-list-item @click="fnOpenRegistroColaborador(colaborador.cve_persona)">
              <v-list-item-content>
                <v-list-item-title>
                  <span>{{ colaborador?.nombre }}</span>
                  <span class="mx-1 font-weight-bold">{{ colaborador?.apellido_paterno }}</span>
                  <span class="font-italic">{{ colaborador?.apellido_materno }}</span>
                </v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-card-text>

      </v-card>
    </v-dialog>





  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance, watch, computed } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";
import { getCargosByFolioService, getProgramaCursoVeranoService, getGrupoCursoVeranoService, getPersonaExisteService, setCreateInscripcionService, getSociosInAccionService, getInscripcionesCursosVeranoService, getFotoSocioService, getSemanasRestantesService, getColaboradorByNominaService, bajaInscripcionCursoService } from '@/services/curso_verano_service'
import dayjs from "dayjs";
import { useInscripcionCursoVeranoValidacion } from '@/composables/useInscripcionCursoVeranoValidacion'
import { saveAs } from "file-saver";
import { mdiBorderColor } from "@mdi/js";

const { iValid, iErrors, iClear } = useInscripcionCursoVeranoValidacion()

const root = getCurrentInstance().proxy;
const headers = ref([
  { text: "Folio", align: "center", sortable: true, value: "folio_pago" },
  { text: "Folio Boleta", align: "center", sortable: true, value: "folio_boleta" },
  { text: "semanas", value: "semanas" },
  { text: "Nombre completo", value: "nombre" },
  { text: "años", value: "edad" },
  { text: "Tutor", align: "right", value: "responsable" },
  { text: "Telefono Tutor", align: "center", value: "telefono_contacto" },
  { text: "Programa", value: "programa", align: "center" },
  { text: "Grupo", value: "grupo" },
  { text: "Estatus", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const lst_inscripciones = ref([]);
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

const cve_curso = ref(1)
const curso_nombre = ref()

const cve_cargo = ref()
const cve_cuota = ref()
const cve_persona = ref()
const cve_accion = ref()

const folio = ref()
const folio_boleta = ref()
const costo = ref()
const numero_accion = ref()

const nombre = ref()
const paterno = ref()
const materno = ref()
const nacimiento = ref()
const genero = ref()
const tutor = ref()
const telefono_contacto = ref()
const calle_numero = ref()
const colonia = ref()
const nadar = ref()
const programa = ref()
const grupo = ref()
const observaciones = ref()

const nomina = ref()
const colaborador = ref()

const foto_view = ref()
const foto = ref()


const lst_cargos = ref([])
const lst_programa = ref([])
const lst_grupos = ref([])
const lst_socios_accion = ref([])
const semanas = ref([])

const menu_socios = ref(false)

const dialog_recibo = ref(false)

const ref_nacimiento = ref(null)

const dialog_foto = ref(false)

const dialog_reingreso = ref(false)

const dialog_colaborador = ref(false)


const semana1_view_ins = ref(false)
const semana2_view_ins = ref(false)
const semana3_view_ins = ref(false)
const semana4_view_ins = ref(false)


const lst_semanas = [
  { semana: 1, title: 'del 23 al 26' },
  { semana: 2, title: 'del 30 al 02' },
  { semana: 3, title: 'del 06 al 09' },
  { semana: 4, title: 'del 13 al 16' },
]

const fecha_inscripcion = dayjs().format('DD [de] MMMM [de] YYYY')

const menu_nacimiento = ref(false)
const activePicker = ref()


const dialog_inscripcion = ref(false)


const cEdad = computed(() => dayjs().diff(nacimiento.value, "year"))


watch(menu_nacimiento, val => val && setTimeout(() => (activePicker.value = 'YEAR')))




//#region metodos

async function getCargosByFolio() {

  lst_cargos.value = await getCargosByFolioService(folio.value)
}

async function fnOpenRegistro(cargo_) {

  iClear()
  // getFotoSocio()

  if (Boolean(cargo_.cve_persona) && cargo_.cve_cuota == 42) {
    const data_ = await getPersonaExisteService(cargo_.cve_persona)
    nombre.value = data_.nombre
    paterno.value = data_.apellido_paterno
    materno.value = data_.apellido_materno
    genero.value = data_.sexo
    nacimiento.value = data_.fecha_nacimiento

  }
  fnGetProgramas()
  cve_cargo.value = cargo_.cve_cargo
  cve_cuota.value = cargo_.cve_cuota
  cve_persona.value = cargo_.cve_persona
  cve_accion.value = cargo_.cve_accion
  costo.value = cargo_.total
  numero_accion.value = cargo_.accion_
  dialog_inscripcion.value = true
  dialog_recibo.value = false
  lst_cargos.value = []
}

async function fnOpenRegistroColaboradro() {

  iClear()
  fnGetProgramas()
  cve_cargo.value = undefined
  cve_cuota.value = 102
  cve_persona.value = 0
  cve_accion.value = 1948
  costo.value = 0
  numero_accion.value = 3999
  // dialog_inscripcion.value = true
  // dialog_recibo.value = false
  lst_cargos.value = []
  dialog_colaborador.value = true
}

function fnCloseRegistro() {

  iClear()

  cve_curso.value = 1
  folio.value = undefined
  folio_boleta.value = undefined
  cve_accion.value = undefined
  cve_persona.value = undefined
  cve_cargo.value = undefined
  cve_cuota.value = undefined
  nombre.value = undefined
  paterno.value = undefined
  materno.value = undefined
  nacimiento.value = undefined
  genero.value = undefined
  tutor.value = undefined
  telefono_contacto.value = undefined
  calle_numero.value = undefined
  colonia.value = undefined
  nadar.value = undefined
  programa.value = undefined
  grupo.value = undefined
  observaciones.valu = undefined

  semanas.value = []

  costo.value = undefined
  numero_accion.value = undefined
  dialog_inscripcion.value = false
  foto.value = undefined
  foto_view.value = undefined
}




async function fnCreateRegistro() {

  iClear()

  //es 1 cuando no se encuentre ningun folio en el caso de 
  const semanas_ = semanas.value.reduce((a, v) => ({ ...a, [v]: folio.value ?? 1 }), {})

  const data_send = {
    cve_curso_verano: cve_curso.value,
    folio: folio.value,
    folio_boleta: folio_boleta.value,
    cve_accion: cve_accion.value,
    cve_persona: cve_persona.value,
    cve_cargo: cve_cargo.value,
    cve_cuota: cve_cuota.value,
    ...semanas_,
    nombre: nombre.value,
    paterno: paterno.value,
    materno: materno.value,
    nacimiento: nacimiento.value,
    genero: genero.value,
    tutor: tutor.value,
    telefono_contacto: telefono_contacto.value,
    calle_numero: calle_numero.value,
    colonia: colonia.value,
    nadar: nadar.value,
    programa: programa.value,
    grupo: grupo.value,
    observaciones: observaciones.value,
    foto: foto.value
  }

  console.log(data_send)

  const data_valid = await iValid(data_send)

  console.log(data_valid)

  const id_inscripcion = await setCreateInscripcionService(data_valid)

  if (Boolean(id_inscripcion)) {
    root.$toast.success("Inscripcion al curso realizada con exito");
    fnCloseRegistro()
    fnGetInscripcionesCursosVerano()
  }
  else root.$toast.error("No se registro al curso ocurrio un error");


}


async function fnGetProgramas() {
  lst_programa.value = await getProgramaCursoVeranoService(cve_curso.value)
}

async function fnGetProgramasGrupo(e) {
  console.log(e)
  lst_grupos.value = await getGrupoCursoVeranoService(programa.value)
}



function fnAddInscripcion() {
  dialog_recibo.value = true
}



function saveNacimiento(date) {
  console.log(ref_nacimiento.value.save(date))
}

async function fnGetSociosInAccion() {
  console.log("entra aqui...")
  lst_socios_accion.value = await getSociosInAccionService(cve_accion.value)
  menu_socios.value = true
}


function fnCambiarSocio(socios_) {
  cve_persona.value = socios_.cve_persona
  nombre.value = socios_.nombre
  paterno.value = socios_.apellido_paterno
  materno.value = socios_.apellido_materno
  nacimiento.value = socios_.fecha_nacimiento
  genero.value = socios_.sexo
}


async function fnOpenCamara() {


  console.log("abrir camara")
  dialog_foto.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  window.navigator.mediaDevices.getUserMedia({ video: { height: 600, width: 800 } }).then(stream => {
    const video = document.getElementById("video-camara")

    video.srcObject = stream

    console.log(video.videoWidth)
    console.log(video.videoHeight)
  }).catch(error => console.log(error))

  const canvas_photo = document.getElementById('photo-camara');

  const context = canvas_photo.getContext('2d');

  // solo era para ver donde quedaba el recorte
  // context.strokeRect(30,35,300,425)


}

async function fnCapturePhoto() {
  const video_camara = document.getElementById('video-camara');
  const canvas_photo = document.getElementById('photo-camara');
  canvas_photo.width = 300;
  canvas_photo.height = 425;

  // video_camara.style.display="none"

  const context = canvas_photo.getContext('2d');

  // context.drawImage(video_camara, 220, 0, 360, 600,0,0,360,600);
  context.drawImage(video_camara, 250, 35, 300, 425, 0, 0, 300, 425);

  const foto_i = await new Promise(resolve => {

    canvas_photo.toBlob(blob => {
      // saveAs(blob,`${dayjs().format("YYYYMMDDHHmmss")}.png`)
      let file_ = new File([blob], "fileName.png", { type: blob.type });
      resolve(file_)
    })
  })
  // saveAs(foto_i,"prueba1111.png")
  foto.value = foto_i
  foto_view.value = canvas_photo.toDataURL('image/png')

  await new Promise(resolve => setTimeout(resolve, 2000))

  context.clearRect(0, 0, 360, 600);

  console.log(foto_i)
  dialog_foto.value = false;

}

function fnCloseFoto() {
  const canvas_photo = document.getElementById('photo-camara');
  const context = canvas_photo.getContext('2d');
  context.clearRect(0, 0, 360, 600);
  dialog_foto.value = false;
}

async function fnGetInscripcionesCursosVerano() {
  lst_inscripciones.value = await getInscripcionesCursosVeranoService()
}

async function getFotoSocio() {
  //  const {image_file,image_view} =await getFotoSocioService(cve_persona.value)
  const { image_file, image_view } = await getFotoSocioService(24763)
  foto.value = image_file
  foto_view.value = image_view
}

async function fnGetReingreso(id_curso_inscripcion) {
  semanas.value = []
  console.log(id_curso_inscripcion)
  const data_semana = await getSemanasRestantesService(id_curso_inscripcion)
  if (data_semana) {
    semana1_view_ins.value = Boolean(parseInt(data_semana.semana1))
    semana2_view_ins.value = Boolean(parseInt(data_semana.semana2))
    semana3_view_ins.value = Boolean(parseInt(data_semana.semana3))
    semana4_view_ins.value = Boolean(parseInt(data_semana.semana4))
  }
  else {
    semana1_view_ins.value = false
    semana2_view_ins.value = false
    semana3_view_ins.value = false
    semana4_view_ins.value = false
  }
  dialog_reingreso.value = true
}

async function fnGetColaboradorByNomina() {

  colaborador.value = await getColaboradorByNominaService(nomina.value)

}

function fnOpenRegistroColaborador(cve_persona_) {
  cve_persona.value = cve_persona_
  colaborador.value = undefined
  nomina.value = undefined
  dialog_colaborador.value = false
  dialog_inscripcion.value = true
}

async function fnBajaIncripcionCurso(id_curso_inscripcion) {
  // 
  const confirm = await root.$confirm(
      'Desea realmente dar de baja esta inscripcion, seleccione opción <b>"Si"</b> en caso contrario la opción <b>"No"</b>',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
     console.log("da de baja")
     await bajaInscripcionCursoService(id_curso_inscripcion)
     fnGetInscripcionesCursosVerano()
    }
}

//#endregion metodos

onMounted(() => {


  fnGetInscripcionesCursosVerano()

})

</script>

<style>
.check-size i {
  /* background-color: blue; */
  font-size: 36px !important
}
</style>