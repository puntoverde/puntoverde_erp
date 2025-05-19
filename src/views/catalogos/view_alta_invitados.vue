<template>
  <div>   
    <div class="d-flex justify-space-between">
      
      <h1 class="accent--text oswald--text">Resgistro de Invitados</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :outlined="attrs['aria-expanded'] == 'true'"
            color="primary"
            v-on="on"
            v-bind="attrs"
            fab
            small
            dark
            elevation="1"
            @click="openFormulario"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>nuevo registro</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" />
    </div>

    <v-data-table
      :items="lst_socios"
      :headers="headers"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select
            v-model="itemsPerPage"
            dense
            hide-details
            style="max-width: 50px"
            :items="[5, 10, 50]"
          />
          <span class="mx-2 text-caption"
            >pagina {{ pagination.page }} de {{ pagination.pageCount }}</span
          >
          <v-pagination
            circle
            :total-visible="0"
            v-model="page"
            :length="pagination.pageCount"
          ></v-pagination>
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:item.estatus="{ item }">
        <v-chip v-if="item.estatus == 1" color="success"
          >Con Acceso Vigente</v-chip
        >
        <v-chip v-else color="error">Sin Acceso Vigente</v-chip>
      </template>
      <template v-slot:item.ac="{ item }">
        <v-btn
          v-if="item.estatus == 0"
          color="info"
          @click="
            (dialogReingreso = true),
              (cve_accion = item.cve_accion),
              (cve_invitado = item.id),
              (cve_persona = item.cve_persona)
          "
          >Reingresar{{ cve_accion }}</v-btn
        >
        <v-chip v-else>{{ item.fecha_fin }}</v-chip>
      </template>

      <template v-slot:item.detalle="{ item }">
        <v-btn color="warning" @click="CargarDetalle(item.id)"
          ><v-icon class="mr-2">mdi-eye</v-icon>Ver Detalle</v-btn
        >
      </template>

      <template v-slot:item.historico="{ item }">
        <v-btn color="accent" @click="CargarHistorico(item.id)"
          ><v-icon class="mr-2">mdi-eye</v-icon>Ver Historico</v-btn
        >
      </template>
    </v-data-table>

    <!-- Dialogo de registro -->

    <v-dialog v-model="dialog" fullscreen scrollable content-class="overflow-y-hidden">
      <v-card>
        <v-toolbar color="primary" max-height="64">
          <v-toolbar-title class="white--text">Formulario para Alta de Invitado</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="cerrarRegistro" icon color="white"
            ><v-icon>mdi-close-circle</v-icon></v-btn
          >
        </v-toolbar>
       
        
        <v-card-text>
          <h1 class="mt-5 mb-2">Datos Invitado</h1>
          <v-row wrap>
            <v-col lg="3">
              <v-select
                label="Accion Invitado"
                v-model="cve_accion"
                filled
                :items="lst_acciones"
                item-value="cve_accion"
                item-text="numero_accion"
                @change="posicionesDisponibles"
                :error-messages="iErrors.cve_accion"
              ></v-select>
            </v-col>
            <v-col lg="3">
              <v-text-field
                label="Nombre"
                v-model="nombre"
               filled
               class="my-mayus"
               :error-messages="iErrors.nombre"
              ></v-text-field>
            </v-col>
            <v-col lg="3">
             
              <v-text-field
                label="Apellido Paterno"
                v-model="paterno"
                filled
                class="my-mayus"
                :error-messages="iErrors.paterno"
              ></v-text-field>
            </v-col>
            <v-col lg="3">
              <v-text-field
                label="Apellido Materno"
                v-model="materno"
                filled
                class="my-mayus"
                :error-messages="iErrors.materno"
              ></v-text-field>
            </v-col>

            <v-col lg="3">
              <v-radio-group row v-model="genero" :error-messages="iErrors.genero">
                <v-radio
                  label="Masculino"
                  color="primary"
                  value="Masculino"
                ></v-radio>
                <v-radio
                  label="Femenino"
                  color="primary"
                  value="Femenino"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col lg="3">
              <v-menu
                v-model="menu5"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                  filled
                    :value="Boolean(fecha_nac)?dayjs(fecha_nac).format('DD [de] MMMM [de] YYYY'):''"
                    label="Fecha Nacimiento"
                    prepend-inner-icon="mdi-calendar"
                    v-on="on"
                    v-bind="attrs"
                    :error-messages="iErrors.fecha_nac"
                    ></v-text-field>
                    <!-- v-mask="'####-##-##'" -->
                </template>
                <v-date-picker
                  :max="fecha_fin"
                  no-title
                  v-model="fecha_nac"
                  @input="menu5 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col lg="3">
              <v-select
                :items="lst_nacionalidad"
                item-value="cve_pais"
                item-text="nombre"
                v-model="nacionalidad"
                label="Nacionalidad"
                filled
                :error-messages="iErrors.nacionalidad"
              ></v-select>
            </v-col>
            <v-col lg="3">
              <v-select
              filled
                label="Estado Civil"
                v-model="estado_civil"
                :items="['Casado', 'Soltero', 'Divorciado']"
                :error-messages="iErrors.estado_civil"
              ></v-select>
            </v-col>

            <v-col lg="3">
              
              <v-text-field
                label="Correo"
                v-model="correo"
                prepend-inner-icon="mdi-at"
                filled
                :error-messages="iErrors.correo"
              ></v-text-field>
            </v-col>


            <v-col lg="3">
             
              <v-text-field
                label="Celular"
                v-model="celular"
                prepend-inner-icon="mdi-cellphone-android"
                filled
                :error-messages="iErrors.celular"
              ></v-text-field>
            </v-col>


            <v-col lg="3">
              <v-select
               
                label="Profesion"
                v-model="profesion"
                :items="lst_profesion"
                item-value="cve_profesion"
                item-text="nombre"
                filled
                :error-messages="iErrors.profesion"
              ></v-select>
            </v-col>
            <!-- <v-col lg="1">
             
              <v-select
                label="Parentesco"
                v-model="parentesco"
                :items="lst_parentesco"
                item-value="cve_parentesco"
                item-text="nombre"
                disabled
                filled
                :error-messages="iErrors.parentesco"
              ></v-select>
            </v-col> -->

            <v-col lg="2">
              <v-text-field
                label="Grado de Estudios"
                v-model="grado_estudio"
                filled
                :error-messages="iErrors.grado_estudio"
              ></v-text-field>
            </v-col>

            
            
            <v-col lg="2">
              <v-text-field
                v-mask="'#####'"
                @keyup="getColonias"
                maxlength="5"
                v-model="cp"
                label="Código postal"
                filled
              ></v-text-field>
            </v-col>
            <v-col lg="3">
              <v-select
                
                label="Colonia"
                :items="lst_colonias"
                item-value="cve_colonia"
                item-text="nombre"
                v-model="colonia"
                filled
                :error-messages="iErrors.colonia"
              ></v-select>
            </v-col>

            <v-col lg="3">
              
              <v-text-field v-model="calle" label="Calle" filled :error-messages="iErrors.calle"></v-text-field>
            </v-col>

            <v-col lg="1">
            
            <v-text-field
              v-model="num_ext"
              maxlength="6"
              label="Número exterior"
              filled
              :error-messages="iErrors.num_ext"
            ></v-text-field>
          </v-col>
          <v-col lg="1">
            <v-text-field
              v-model="num_int"
              maxlength="6"
              label="Número interior"
              filled
            ></v-text-field>
          </v-col>
            

            
            
          </v-row>
          <v-divider></v-divider>

          <h1 class="mt-5">Datos Ingreso</h1>
          <div class="primaryxx d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <span
                class="mr-3 title"
                :class="{ 'text--decorate': !tipo_acceso }"
                >Por Dias</span
              >
              <v-switch
                v-model.number="tipo_acceso"
                :true-value="1"
                :false-value="0"
                color="primary"
              ></v-switch>
              <span
                class="ml-3 mr-10 title"
                :class="{ 'text--decorate': tipo_acceso }"
                >Periodo</span
              >
            </div>

            <div class="d-flex align-center">
              <span
                class="mr-3 title"
                :class="{ 'text--decorate': !tipo_invitado }"
                >Libre</span
              >
              <v-switch
                v-model.number="tipo_invitado"
                :true-value="1"
                :false-value="0"
                color="primary"
                @change="changeTipoInvitado"
              ></v-switch>
              <span
                class="ml-3 title"
                :class="{ 'text--decorate': tipo_invitado }"
                >Socio Invita</span
              >
            </div>
          </div>

          <v-row v-if="tipo_acceso == 1">
            <v-col cols="12" md="3">
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                   
                    v-model="fecha_inicio"
                    label="Fecha Inicio"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    filled
                    :error-messages="iErrors.fecha_inicio"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="fecha_fin"
                  no-title
                  v-model="fecha_inicio"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="3">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    
                    v-model="fecha_fin"
                    label="Fecha Fin"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    filled
                    :error-messages="iErrors.fecha_fin"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="fecha_inicio"
                  no-title
                  v-model="fecha_fin"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field                
                v-model="n_accion"
                label="Accion"
                @change="buscarSociosAccion"
                @keyup.enter="buscarSociosAccion"
                v-mask="accionMask"
                :disabled="tipo_invitado === 0"
                filled
                :error-messages="iErrors.accion"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                
                v-model="cve_socio_invita"
                label="Socio Invita"
                :items="lst_socios_accion"
                item-value="cve_socio"
                :item-text="
                  (i) => {
                    return `${i.nombre} ${i.apellido_paterno} ${
                      i.apellido_materno
                    } ,${i.socio == 1 ? 'Socio' : 'Dueño'}`;
                  }
                "
                return-object
                :disabled="tipo_invitado === 0"
                filled
                :error-messages="iErrors.cve_accion_cargo"
              >
              </v-select>
            </v-col>

         
            <v-col cols="12" md="3">
              <v-text-field
                label="Costo"
                
                v-mask="'####################'"
                v-model="total"
                filled
                :error-messages="iErrors.total"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col>
              <v-date-picker
                landscape
                v-model="dias_acceso"
                multiple
                color="primary"
                class="elevation-5" 
                :error-messages="iErrors.dias_acceso"
              ></v-date-picker>
            </v-col>

            <v-col>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    
                    v-model="n_accion"
                    label="Accion"
                    @keyup.enter="buscarSociosAccion"
                    v-mask="accionMask"
                    :disabled="tipo_invitado === 0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-select
                   
                    v-model="cve_socio_invita"
                    label="Socio Invita"
                    :items="lst_socios_accion"
                    item-value="cve_socio"
                    :item-text="
                      (i) => {
                        return `${i.nombre} ${i.apellido_paterno} ${
                          i.apellido_materno
                        } ,${i.socio == 1 ? 'Socio' : 'Dueño'}`;
                      }
                    "
                    return-object
                    :disabled="tipo_invitado === 0"
                    :error-messages="iErrors.cve_socio_invita"
                  ></v-select>
                </v-col>

              
                <v-col cols="12" md="12">
                  <v-text-field
                    v-mask="'####################'"
                    label="Costo"
                    v-model="total"
                    :error-messages="iErrors.total"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col class="text-right">
              <v-btn color="success" width="220" @click="Guardar"
                ><v-icon class="mr-2">mdi-content-save</v-icon> Guardar</v-btn
              >
            </v-col>

            <v-col class="text-left">
              <v-btn color="error" width="220" @click="Limpiar"
                ><v-icon class="mr-2">mdi-close</v-icon>Limpiar</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

      <!-- Dialogo de registro -->
    </v-dialog>

    <!-- dialogo reingreso -->
    <v-dialog v-model="dialogReingreso" width="500" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between"
          >Reingresar Invitacion
          <v-btn
            icon
            @click="fnCancelarReingreso"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="my-0 py-0">
              <div class="d-flex align-center">
                <span
                  class="mr-3 titlexx"
                  :class="{ 'text--decorate': !tipo_acceso }"
                  >Por Dias</span
                >
                <v-switch
                  v-model.number="tipo_acceso"
                  :true-value="1"
                  :false-value="0"
                  color="primary"
                ></v-switch>
                <span
                  class="ml-3 mr-10"
                  :class="{ 'text--decorate': tipo_acceso }"
                  >Periodo</span
                >
              </div>
            </v-col>

            <v-col cols="12" class="my-0 py-0">
              <div class="d-flex align-center">
                <span
                  class="mr-3y"
                  :class="{ 'text--decorate': !tipo_invitado }"
                  >Libre</span
                >
                <v-switch
                  v-model.number="tipo_invitado"
                  :true-value="1"
                  :false-value="0"
                  color="primary"
                  @change="changeTipoInvitado"
                ></v-switch>
                <span
                  class="ml-3 titlex"
                  :class="{ 'text--decorate': tipo_invitado }"
                  >Socio Invita</span
                >
              </div>
            </v-col>

            <v-col cols="12" class="my-0 py-0" v-if="tipo_acceso == 1">
              <v-menu
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    
                    v-model="fecha_inicio"
                    label="Fecha Inicio"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :max="fecha_fin"
                  no-title
                  v-model="fecha_inicio"
                  @input="menu3 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" class="my-0 py-0" v-if="tipo_acceso == 1">
              <v-menu
                v-model="menu4"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    
                    v-model="fecha_fin"
                    label="Fecha Fin"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :min="fecha_inicio"
                  no-title
                  v-model="fecha_fin"
                  @input="menu4 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col
              cols="12"
              md="3"
              class="my-0 py-0 mx-0"
              v-if="tipo_acceso == 0"
            >
              <v-date-picker
                landscape
                v-model="dias_acceso"
                multiple
                color="primary"
                class="elevation-5"
              ></v-date-picker>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
               
                v-model="n_accion"
                label="Accion"
                @keyup.enter="buscarSociosAccion"
                v-mask="accionMask"
                :disabled="tipo_invitado === 0"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-select
               
                v-model="cve_socio_invita"
                label="Socio Invita"
                :items="lst_socios_accion"
                item-value="cve_socio"
                :item-text="
                  (i) => {
                    return `${i.nombre} ${i.apellido_paterno} ${
                      i.apellido_materno
                    } ,${i.socio == 1 ? 'Socio' : 'Dueño'}`;
                  }
                "
                return-object
                :disabled="tipo_invitado === 0"
              ></v-select>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
               
                v-mask="'####################'"
               
                label="Costo"
                v-model="total"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="my-0 py-0">
              <v-btn block color="primary" @click="reingreso"
                ><v-icon>mdi-content-save</v-icon>Guardar Invitacion</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- dialogo historico -->
    <v-dialog persistent="" width="800" v-model="dialogHistorico">
      <v-card>
        <v-card-title class="justify-space-between primary white--text"
          >LISTADO DE INVITACION
          <v-btn icon color="white" @click="dialogHistorico = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              two-line
              v-for="(historico, i) in lst_historico"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ historico.nombre }} {{ historico.apellido_paterno }}
                  {{ historico.apellido_materno }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  <b>Fecha registro:</b> {{ historico.fecha_registro }}
                  <b>Periodo:</b> {{ historico.fecha_inicio }} a
                  {{ historico.fecha_fin }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <b>Folio:</b> {{ historico.folio }} <b>Fecha cobro:</b>
                  {{ historico.fecha_hora_cobro }} <b>Pago:</b>
                  {{ numeral(historico.total).format("$0,0.00") }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip text> Accion: {{ historico.accion }} </v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- dialogo detalle -->

    <v-dialog v-model="dialogDetalle" persistent width="70%">
      <v-card>
        <v-card-title class="d-flex justify-space-between primary white--text"
          >Detalle Invitado
          <v-btn icon="" color="white" @click="dialogDetalle = false">
            <v-icon>mdi-close</v-icon>
          </v-btn></v-card-title
        >
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="4"
              v-for="(detalle, name, i) in detalleSocio"
              :key="i"
            >
              <h3 class="mr-2">{{ name }}:</h3>
              {{ detalle }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- dialog invitados ya registrados como sugerencia -->
     <v-dialog v-model="dialogInvitadoSugerencia" persistent scrollable width="500">
      <v-card rounded="xl">
        <v-card-title class="d-flex justify-space-between primary white--text"
          >Sugerencia de invitados
          <v-btn icon="" color="white" @click="dialogInvitadoSugerencia = false">
            <v-icon>mdi-close</v-icon>
          </v-btn></v-card-title
        >
        <v-card-text>
          <v-list three-line>
            <v-list-item
              cols="12"
              md="4"
              v-for="(sugerencia_invitado,index) in lst_invitados_sugerencia"
              :key="index"
              @click="fnSelectedSugerencia(sugerencia_invitado)"
            >
            <v-list-item-content>
              <v-list-item-title>{{  sugerencia_invitado.nombre }}</v-list-item-title>
              <v-list-item-subtitle>
                <div class="d-flex" style="column-gap: 6px;">
                <span class="font-weight-bold">{{  sugerencia_invitado.apellido_paterno }}</span>
                <span class="font-italic">{{  sugerencia_invitado.apellido_materno }}</span>
              </div>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <div class="d-flex" style="column-gap: 6px;">
                  <span>{{ sugerencia_invitado.fecha_inicio}}</span> al
                  <span>{{ sugerencia_invitado.fecha_fin}}</span>
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action-text>
              {{sugerencia_invitado.numero_accion}}
            </v-list-item-action-text>
            <!-- { "id": "25747", "cve_persona": "29479", "cve_accion": "2071", "posicion": "4", "numero_accion": "6095", "nombre": "JUAN ", "apellido_paterno": "SATO", "apellido_materno": "", "fecha_inicio": "2024-11-16", "fecha_fin": "2024-11-16", "estatus": "0" }  -->
            

            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnContinuar"  color="error" small rounded>continuar sin sugerencia</v-btn>
        </v-card-actions>
      </v-card>
     </v-dialog>

    <v-row>
      <v-col>
        <v-snackbar
          v-model="snackbar"
          :bottom="true"
          :multi-line="true"
          :color="color_mensaje"
        >
          {{ mensaje_alerta }}
          <v-icon color="white" @click="snackbar = false"
            >mdi-close-circle</v-icon
          >
        </v-snackbar>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";

import isPlainObject from "lodash/isPlainObject";
import debounce from "lodash/debounce";
import numeral from "numeral";
import dayjs from "dayjs";

import {getAccionesDisponiblesInvitados,createInvitadoService,reingresoInvitadoService,getSociosInvitanService,getInvitadoService,getInvitadoByIdService,getHistoricoInvitadosService} from '@/services/invitados_service'
import {getNacionalidadesService,getColoniasByCpService} from '@/services/domicilio_service'
import {getPosicionesByAccionService} from '@/services/socios_service'
import {getProfesioncoService} from '@/services/profesion_service'
import {getParentescoService} from '@/services/parentesco_service'
import {useValidacionInvitado} from '@/composables/useValidacionInvitados'



const root = getCurrentInstance().proxy;
const {iValid, iErrors,iClear} =useValidacionInvitado()
// #region variables
//datos del invitado
const cve_accion = ref(null);//accion que entra el invitado son las de 6000 en adelante
const cve_invitado = ref("");
const cve_persona = ref("");
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const genero = ref("Masculino");
const fecha_nac = ref("");
const nacionalidad = ref("");
const estado_civil = ref("");
const celular = ref("");
const calle = ref("");
const num_ext = ref("");
const num_int = ref("");
const cp = ref("");
const colonia = ref("");
const correo = ref("");
const grado_estudio = ref("");
const profesion = ref("");
const parentesco = ref(12);//igual y este se quita ues simeopre es iinvitado 

//datos del ingreso y socio que invita
const tipo_acceso = ref(1);//indica si es por periodo o dias
const fecha_inicio = ref("");//fecha inicio periodo
const fecha_fin = ref("");///fecha fin periodo 
const dias_acceso = ref([]);//son los dias cuando el tipo de acceso es 0 es un array de dias
const tipo_invitado = ref(1);//indica si fue invitado por alguien o el solo acuido 1 es que lo invito un socio 0 es el solo 
const cve_socio_invita = ref({ cve_socio: undefined, nombre: "selecciona" });//es el socio que invita cuando tipo_invitado es 1
const total = ref("");//es el monto de la para la cuota puede varias segun el rango de dias
const n_accion = ref("");//solo sirve para buscar los socios por la accion para que sean los que invitan


//tabla 
const headers = [
  { text: "Numero Acción", value: "numero_accion" },
  { text: "Posicion", value: "posicion" },
  { text: "Nombre", value: "nombre" },
  { text: "Apellido Paterno", value: "apellido_paterno" },
  { text: "Apellido Materno", value: "apellido_materno" },
  { text: "Estatus", value: "estatus" },
  { text: "Fin Periodo", value: "ac" },
  { text: "Detalle", value: "detalle" },
  { text: "Historico", value: "historico" },
];
const search = ref(null);

//combos
const lst_acciones = ref([]);
const lst_socios = ref([]);
const lst_profesion = ref([]);
const lst_parentesco = ref([]);
const lst_nacionalidad = ref([]);
const lst_colonias = ref([]);
const lst_historico = ref([]);
const lst_socios_accion = ref([]);
const lst_invitados_sugerencia=ref([])

const mensaje_alerta = ref("");
const snackbar = ref(false);
const color_mensaje = ref("");

//dialogos
const dialog = ref(false);
const dialogReingreso = ref(false);
const dialogHistorico = ref(false);
const dialogDetalle = ref(false);
const dialogInvitadoSugerencia=ref(false)

const detalleSocio = ref({});
const menu1 = ref(false);
const menu2 = ref(false);
const menu3 = ref(false);
const menu4 = ref(false);
const menu5 = ref(false);
const accionMask = ref({
  mask: "#FFFF",
  tokens: {
    F: {
      pattern: /[0-9a-cA-C]/,
      transform(v) {
        return v.toLocaleUpperCase();
      },
    },
    "#": {
      pattern: /\d/,
    },
  },
});

const page = ref(1);
const itemsPerPage = ref(10);


const nombre_invitado_search = ref("");

const filters = ref([
  // { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
  // { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);
// #endregion variables


onMounted(() => {
  Nacionalidad();
  getParentesco();
  getProfesion();
  CargarInvitados();
  getAcciones();
});

// #region function
function openFormulario() {
  dialog.value = true;
}

async function getProfesion() {
  try {
    // let { data } = await $axios.get("profesiones");
    const data=await getProfesioncoService()
    lst_profesion.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function getParentesco() {
  try {
    // let { data } = await $axios.get("parentescos");
    const data=await getParentescoService()
    lst_parentesco.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function getColonias() {
  lst_colonias.value = [];
  if (cp.value.length >= 5) {
    // let { data, status } = await $axios.get("domicilios", {params: { cp: cp.value }});
    const data=await getColoniasByCpService(cp.value)
    lst_colonias.value = data;
  }
}

const Guardar = debounce(async () => {

  if (tipo_acceso.value == 0) {
    fecha_inicio.value = "2020-01-01";
    fecha_fin.value = "2020-01-01";
  }


  let dataSend = {
    nombre: nombre.value,
    paterno: paterno.value,
    materno: materno.value,
    genero: genero.value,
    fecha_nac: fecha_nac.value,
    nacionalidad: nacionalidad.value,
    estado_civil: estado_civil.value,
    profesion: profesion.value,
    // parentesco: parentesco.value,
    cve_accion: cve_accion.value,
    calle: calle.value,
    num_ext: num_ext.value,
    num_int: num_int.value,
    colonia: colonia.value,
    // posicion: 1, //se omite porque se calcula solo
    // curp: "sin curp",
    // rfc: "sin rfc",
    celular: celular.value,
    // telefono: "sin tel",
    correo: correo.value,
    grado_estudio: grado_estudio.value,
    total: total.value,
    fecha_inicio: fecha_inicio.value,
    fecha_fin: fecha_fin.value,
    tipo_invitado: tipo_invitado.value,
    dias_acceso: dias_acceso.value,
    tipo_acceso: tipo_acceso.value,
  };

  

  if (tipo_invitado.value === 1) {
    // solo se envia cundo el tipo es 1 indica que se busca un socio para poner como el que invita
    dataSend.cve_socio_invita = cve_socio_invita.value.cve_socio;
    dataSend.cve_accion_cargo = cve_socio_invita.value.cve_accion;
    dataSend.cve_persona_cargo = cve_socio_invita.value.cve_persona;
  }

  console.log(dataSend)

  await iValid(dataSend)


  lst_invitados_sugerencia.value=lst_socios.value.filter(i=>i.nombre.toLowerCase().indexOf(nombre.value.toLowerCase()) > -1)
  //si se encontro almenos una sugerencia se abre dialog de sugerencia
  if(lst_invitados_sugerencia.value.length>0)
  {
    dialogInvitadoSugerencia.value=true
    //se crea una promesa tipo confirm
    const confirm=await new Promise(resolve=>document.addEventListener('custom_continuar',(evt)=>{resolve(evt.detail.flag)}))
    //si confirm es true segnifica que termina porq se selecciono una sugerencia y se abre el reingreso 
    if(confirm)return
  }
  
  // let { data, status } = await $axios.post("/invitados", dataSend);
  const data=await createInvitadoService(dataSend)

  if (eval(data) > 0) {
    mensaje_alerta.value = "Guardado correctamente";
    color_mensaje.value = "success";
    snackbar.value = true;
    Limpiar()
    CargarInvitados();
  } else {
    mensaje_alerta.value =
      "Hubo un error, recarga el sitio he intenta de nuevo";
    color_mensaje.value = "error";
    snackbar.value = true;
  }
  
}, 1200);

const reingreso = debounce(async () => {
  if (tipo_acceso.value == 0) {
    fecha_inicio.value = "2020-01-01";
    fecha_fin.value = "2020-01-01";
  }
 
  let dataSend = {
    tipo_acceso: tipo_acceso.value,
    dias_acceso: dias_acceso.value,
    tipo_invitado: tipo_invitado.value,
    fecha_inicio: fecha_inicio.value,
    fecha_fin: fecha_fin.value,
    total: total.value,
    cve_accion_cargo: cve_accion.value, //es la accion misma si se invita el mismo
    cve_persona_cargo: cve_persona.value,
  };

  if (tipo_invitado.value === 1) {
    // solo se envia cundo el tipo es 1
    dataSend.cve_socio_invita = cve_socio_invita.value.cve_socio;
    dataSend.cve_accion_cargo = cve_socio_invita.value.cve_accion;
    dataSend.cve_persona_cargo = cve_socio_invita.value.cve_persona;
  }
  // let { data, status } = await $axios.put(`invitados/${cve_invitado.value}`,dataSend);
  const data=await reingresoInvitadoService(cve_invitado.value,dataSend)

  console.log("data", typeof data, data);

  if (data > 0) {
    mensaje_alerta.value = "Guardado correctamente";
    color_mensaje.value = "success";
    snackbar.value = true;
    CargarInvitados();
  } else {
    mensaje_alerta.value =
      "Hubo un error, recarga el sitio he intenta de nuevo";
    color_mensaje.value = "error";
    snackbar.value = true;
  }

 
}, 800);


function Limpiar() {

    nombre.value=""
    paterno.value=""
    materno.value=""
    genero.value=undefined
    fecha_nac.value=""
    estado_civil.value=""
    profesion.value=undefined
    parentesco.value=undefined
    calle.value=""
    num_ext.value=""
    num_int.value=""
    colonia.value=""
    celular.value=""    
    correo.value=""
    grado_estudio.value=""
    tipo_invitado.value=1
    dias_acceso.value=[]
    tipo_acceso.value=1

    dialog.value = false;
    cp.value = "";
    lst_colonias.value = [];

    parentesco.value = "12"; //es invitado por default
    genero.value = "Masculino";
    nacionalidad.value = "121";

    fecha_inicio.value = null;
    fecha_fin.value = null;
    cve_accion.value = "";
    n_accion.value = "";
    lst_socios_accion.value = [];
    cve_socio_invita.value = null;
    total.value = "";
  
}

async function CargarInvitados(invitado) {
  // let { data, status } = await $axios.get("invitados", {params: { search_invitado: nombre_invitado_search.value }});
  const data=await getInvitadoService(nombre_invitado_search.value)
  lst_socios.value = data;
}

async function CargarHistorico(id_invitado) {
  dialogHistorico.value = true;
  // let { data, status } = await $axios.get(`invitados/${id_invitado}/historico`);
  const data=await getHistoricoInvitadosService(id_invitado)
  lst_historico.value = data;
}

async function CargarDetalle(id_invitado) {
  // let { data, status } = await $axios.get(`invitados/${id_invitado}`);
  const data=await getInvitadoByIdService(id_invitado)
  if (isPlainObject(data)) {
    detalleSocio.value = data;
    dialogDetalle.value = true;
  }
}

async function Nacionalidad() {
  lst_nacionalidad.value = [];
  // let { data, status } = await $axios.get("domicilios/nacionalidades");
  const data = await getNacionalidadesService()
  lst_nacionalidad.value = data;
}

async function getAcciones() {
  // let { data, status } = await $axios.get("/invitados/accion_disponible");
  const data=await getAccionesDisponiblesInvitados()
  lst_acciones.value = data;
}

async function posicionesDisponibles() {
  // let { data, status } = await $axios.get("/socios/posiciones", {
  //   params: { cve_accion: cve_accion.value },
  // });
  await getPosicionesByAccionService(cve_accion.value)
}

async function buscarSociosAccion() {
  let indexTripartidas = -1;
  let numero_accion = 0;
  let clasificacion = 0;

  if (n_accion.value.indexOf("A") > -1) {
    indexTripartidas = n_accion.value.indexOf("A");
    clasificacion = 1;
  } else if (n_accion.value.indexOf("B") > -1) {
    indexTripartidas = n_accion.value.indexOf("B");
    clasificacion = 2;
  } else if (n_accion.value.indexOf("C") > -1) {
    indexTripartidas = n_accion.value.indexOf("C");
    clasificacion = 3;
  }

  numero_accion = n_accion.value;

  if (indexTripartidas > -1) {
    numero_accion = n_accion.value.substr(0, indexTripartidas);
  }

  console.log("numero_accion:", numero_accion);
  console.log("clasificacion:", clasificacion);

  // let { data, status } = await $axios.get("/invitados/socios_invitan", {
  //   params: { accion: 16, numero_accion, clasificacion },
  // });
  const data=await getSociosInvitanService(numero_accion, clasificacion)
  cve_socio_invita.value = { cve_socio: undefined, nombre: "selecciona" };
  data.unshift({
    cve_socio: undefined,
    nombre: "selecciona",
    apellido_paterno: "",
    apellido_materno: "",
  });
  lst_socios_accion.value = data;
}

function changeTipoInvitado() {
  if (tipo_invitado.value === 0) {
    n_accion.value = "";
    cve_socio_invita.value = null;
    lst_socios_accion.value = [];
  }
}

function cerrarRegistro() {
  dialog.value = false;
  cp.value = "";
  lst_colonias.value = [];
  parentesco.value = "12"; //es invitado por default
  genero.value = "Masculino";
  fecha_inicio.value = null;
  fecha_fin.value = null;
  cve_accion.value = "";
  n_accion.value = "";
  lst_socios_accion.value = [];
  cve_socio_invita.value = null;
  total.value = "";
 
}

function fnSelectedSugerencia(item)
{
  console.log(item)

  dialogReingreso.value = true
  cve_accion.value = item.cve_accion
  cve_invitado.value = item.id
  cve_persona.value = item.cve_persona
  dialogInvitadoSugerencia.value=false
  document.dispatchEvent(new CustomEvent('custom_continuar',{detail:{flag:true}}));
}

function fnContinuar(){
  dialogInvitadoSugerencia.value=false
  document.dispatchEvent(new CustomEvent('custom_continuar',{detail:{flag:false}}));
}

function fnCancelarReingreso()
{
  dialogReingreso.value = false
  Limpiar()
}

// #endregion
</script>
<style scoped lang="scss">
.v-input input {
  text-transform: uppercase;
}

.text--decorate {
  text-decoration: underline;
  font-weight: bold;
}
</style>