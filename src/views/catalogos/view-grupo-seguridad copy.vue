<template>
  <div>

    <div class="d-flex justify-space-between">     
      <h1 class="accent--text oswald--text">Grupo seguridad</h1>
    </div>

    <v-card class="mb-5">
      <v-card-title class="d-flex justify-space-between">
        {{cve_persona==0?'Alta usuario':'Actualizar usuario'}}
        
        <div>
        <v-btn color="primary" @click="saveOrUpdate">
          {{cve_persona == 0 ? "Guardar Usuario" : "Modificar Usuario"}}
        </v-btn>
        <v-btn @click="fnCancelar" v-if="Boolean(cve_persona)" color="secondary" class="ml-2">
          Cancelar
        </v-btn>
        </div>
      </v-card-title>
      <v-card-text class="my-0 py-0">
        <v-row class="my-0 py-0">
          <v-col class="my-0 py-0">
            <v-text-field
              label="Usuario"
              v-model="usuario"             
              :error-messages="iErrors.usuario"
              filled
            ></v-text-field>
          </v-col>
          <v-col class="my-0 py-0">
            <v-text-field
              label="Contraseña"
              v-model="contrasena"              
              :error-messages="iErrors.contrasena"
              filled
            ></v-text-field>
          </v-col>
          <v-col class="my-0 py-0">
            <v-text-field
              label="Nombre"
              v-model="nombre"              
              :error-messages="iErrors.nombre"
              filled
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col class="my-0 py-0">
            <v-text-field
              label="Apellido Paterno"
              v-model="paterno"              
              :error-messages="iErrors.paterno"
              filled
              class="my-mayus"
            ></v-text-field>
          </v-col>

          <v-col class="my-0 py-0">
            <v-text-field
              label="Apellido Materno"
              v-model="materno"              
              :error-messages="iErrors.materno"
              filled
              class="my-mayus"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="my-0 py-0">
            <v-radio-group
              row
              v-model="genero"              
              :error-messages="iErrors.sexo"
            >
              <v-radio label="Masculino" value="Masculino"></v-radio>
              <v-radio label="Femenino" value="Femenino"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col class="my-0 py-0">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on,attrs }">
                <v-text-field
                  :value="Boolean(fecha_nacimiento)?dayjs(fecha_nacimiento).format('DD [de] MMMM [de] YYYY'):''"
                  label="Fecha Nacimiento"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-on="on"  
                  v-bind="attrs"                
                  :error-messages="iErrors.fecha_nacimiento"
                  filled
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fecha_nacimiento"
                :max="new Date().toISOString().substr(0, 10)"
                @input="menu1 = false"
                color="secondary"
                locale="es-mx"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col class="my-0 py-0">
            <v-radio-group
              row
              v-model="privilegios"              
              :error-messages="iErrors.tipo_user"
            >
              <v-radio label="Adminstrador" value="A"></v-radio>
              <v-radio label="Ordinario" value="O"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col
        cols="12"
        lg="6"
        v-for="item in lst_invitados"
        :key="item.cve_invitado"
      >
        <v-card>
          <v-card-text class="pb-0">
            <v-list-item three-line>
              <v-list-item-avatar size="60">
                <v-icon class="info white--text" large>mdi-account</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  >USUARIO:
                  {{
                    `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`
                  }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >FECHA NACIMIENTO:
                  {{ dayjs(item.fecha_nacimiento).format("DD/MM/YYYY") }},
                  GENERO: {{ item.sexo }}</v-list-item-subtitle
                >
                <v-list-item-subtitle
                  >ESTATUS:
                  {{
                    `${item.estatus === 1 ? "Activo" : "Inactivo"}`
                  }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pt-0xx justify-center">
            <v-btn color="info" @click="seleccionarUpdate(item.cve_persona)">
              <v-icon>mdi-account-edit</v-icon>Actualizar
            </v-btn>
            <v-btn
              color="error"
              @click="openBaja(item)"
              v-if="item.estatus > 0"
            >
              <v-icon>mdi-account-remove</v-icon>Baja
            </v-btn>
            <v-btn color="success" @click="openAlta(item)" v-else>
              <v-icon>mdi-account-check</v-icon>Activar
            </v-btn>
            <v-btn color="warning" @click="getModulosUuario(item.cve_persona)">
              <v-icon>mdi-account-details</v-icon>Modulos
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogModulos"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="warning">
          <v-btn icon dark @click="dialogModulos = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Permisos de Modulos por Usuario</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-list subheader class="elevation-5">
                <v-subheader class="title">Modulos sin Asignar</v-subheader>
                <v-divider inset></v-divider>
                <v-list-item
                  v-for="modu in modulosSinAsignar"
                  :key="modu.cve_modulo"
                >
                  <!-- <v-list-item-avatar>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-avatar> -->

                  <v-list-item-content>
                    <v-list-item-title>{{ modu.nombre }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="asignarModulo(modu.cve_modulo)">
                      <v-icon>mdi-arrow-right-bold-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-list>
            </v-col>
            <v-col cols="6">
              <v-list subheader class="elevation-5">
                <v-subheader class="title"
                  >Modulos Asignados al Usuario</v-subheader
                >
                <v-divider inset></v-divider>
                <v-list-item
                  v-for="modu in modulosAsignados"
                  :key="modu.cve_modulo"
                >
                  <v-list-item-action>
                    <v-btn icon @click="removerModulo(modu.cve_modulo)">
                      <v-icon>mdi-arrow-left-bold-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>{{ modu.nombre }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider inset></v-divider>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogBaja" width="350" persistent>
      <v-card>
        <v-card-title>Baja Usuario Sistema</v-card-title>
        <v-card-text>
          <p>
            Estas realmente seguro de que deseas dar de baja al usuario si es
            asi selecciona la opcion <b>Aceptar</b> en caso contrario selecciona
            <b>Cancelar</b>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogBaja = false">Cancelar</v-btn>
          <v-btn color="success" @click="baja">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAlta" width="350" persistent>
      <v-card>
        <v-card-title>Activacion de Usuario Sistema</v-card-title>
        <v-card-text>
          <p>
            Estas realmente seguro de que deseas activar al usuario si es asi
            selecciona la opcion <b>Aceptar</b> en caso contrario selecciona
            <b>Cancelar</b>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialogAlta = false">Cancelar</v-btn>
          <v-btn color="success" @click="alta">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";
import {
  guardarUsuarioSistemaService,
  actualizarUsuarioService,
  getModulosService,
  getUsuariosSistemaService,
  asignarModuloService,
  removerModuloService,
  bajaUsuarioService,
  altaUsuarioService,
  seleccionarUpdateService,
} from "@/services/modulo_usuarios_service";
import {useValidacionUsuarioGrupoSeguridad} from '@/composables/useValidacionUsuarioGrupoSeguridad'

const {iValid, iErrors, iClear} =useValidacionUsuarioGrupoSeguridad()

const isPlainObject = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

const lst_invitados = ref([]);
const menu1 = ref(false);
const date1 = ref(dayjs().format("YYYY-MM-DD"));
const cve_persona = ref(0);
const dialogModulos = ref(false);
const dialogBaja = ref(false);
const dialogAlta = ref(false);
const modulos = ref([]);
const selected = ref(null);
const usuario = ref("");
const contrasena = ref("");
const estatus_usuario = ref(0);
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const genero = ref("");
const fecha_nacimiento = ref("");
const cve_apis = ref("");
const estatus = ref(0);
const privilegios = ref("");

const modulosAsignados = computed(() => {
  return modulos.value.filter((item) => item.usuario > 0);
});
const modulosSinAsignar = computed(() => {
  return modulos.value.filter((item) => item.usuario == 0);
});

onMounted(() => getList());

async function getModulosUuario(p) {
  cve_persona.value = p;
  dialogModulos.value = true;
  // axios.post("/usuariosController.php",qs.stringify({ accion: 4, cve_persona: p })).then((res) => {modulos.value = res.data;});
  modulos.value = await getModulosService(p);
}

async function getList() {
  // axios.post("/usuariosController.php", qs.stringify({ accion: 2 })).then((res) => {lst_invitados.value = res.data;});
  lst_invitados.value = await getUsuariosSistemaService();
}

async function asignarModulo(p) {
  // axios.post("/usuariosController.php", qs.stringify({ accion: 5, cve_persona: cve_persona.value, cve_modulo: p }))
  // .then((res) => {let data = res.data;if (data > 0) {
  //       let index = modulos.value.findIndex((item) => item.cve_modulo == p);
  //       modulos.value[index].usuario = cve_persona.value;
  //     }
  //   });
  const data = await asignarModuloService(cve_persona.value, p);
  if (data > 0) {
    let index = modulos.value.findIndex((item) => item.cve_modulo == p);
    modulos.value[index].usuario = cve_persona.value;
  }
}

async function removerModulo(p) {
  // axios.post("/usuariosController.php",qs.stringify({ accion: 6, cve_persona: cve_persona.value, cve_modulo: p }))
  //   .then((res) => {
  //     let data = res.data;
  //     if (data > 0) {
  //       let index = modulos.value.findIndex((item) => item.cve_modulo == p);
  //       modulos.value[index].usuario = 0;
  //     }
  //   });
  const data = await removerModuloService(cve_persona.value, p);
  if (data > 0) {
    let index = modulos.value.findIndex((item) => item.cve_modulo == p);
    modulos.value[index].usuario = 0;
  }
}

function openBaja(p) {
  dialogBaja.value = true;
  cve_persona.value = p.cve_persona;
  selected.value = p;
}

function openAlta(p) {
  dialogAlta.value = true;
  cve_persona.value = p.cve_persona;
  selected.value = p;
}

async function baja() {
  // axios.post("/usuariosController.php",qs.stringify({ accion: 7, cve_persona: cve_persona.value }))
  // .then((res) => {
  //   let data = res.data;
  //   if (data > 0) selected.value.estatus = 0;
  //   dialogBaja.value = false;
  // });
  const data = await bajaUsuarioService(cve_persona.value);
  if (data > 0) selected.value.estatus = 0;
  dialogBaja.value = false;
}

async function alta() {
  // axios.post("/usuariosController.php",qs.stringify({ accion: 8, cve_persona: cve_persona.value }))
  //   .then((res) => {
  //     let data = res.data;
  //     if (data > 0) selected.value.estatus = 1;
  //     dialogAlta.value = false;
  //   });

  const data = await altaUsuarioService(cve_persona.value);
  if (data > 0) selected.value.estatus = 1;
  dialogAlta.value = false;
}

async function seleccionarUpdate(p) {
  // axios.post("/usuariosController.php",qs.stringify({ accion: 3, cve_persona: p }))
  //   .then((res) => {
  //     let data = res.data;
  //     if (isPlainObject(data)) {
  //       cve_persona.value = data.cve_persona;
  //       usuario.value = data.usuario;
  //       contrasena.value = data.contrasena;
  //       nombre.value = data.nombre;
  //       paterno.value = data.apellido_paterno;
  //       materno.value = data.apellido_materno;
  //       genero.value = data.sexo;
  //       fecha_nacimiento.value = data.fecha_nacimiento;
  //       privilegios.value = data.privilegios;
  //     }
  //   });
  const data = await seleccionarUpdateService(p);
  if (isPlainObject(data)) {
    cve_persona.value = data.cve_persona;
    usuario.value = data.usuario;
    contrasena.value = data.contrasena;
    nombre.value = data.nombre;
    paterno.value = data.apellido_paterno;
    materno.value = data.apellido_materno;
    genero.value = data.sexo;
    fecha_nacimiento.value = data.fecha_nacimiento;
    privilegios.value = data.privilegios;
  }
}

function saveOrUpdate() {
  // root.$validator
  //   .validate()
  //   .then((valid) => {
  //     if (valid) {
        if (cve_persona.value == 0) guardar();
        else actualizar();
    //   }
    // })
    // .catch((err) => console.error(err));
}

async function guardar() {
  // let dataSend = {
  //   accion: 1,
  //   nombre: nombre.value,
  //   paterno: paterno.value,
  //   materno: materno.value,
  //   sexo: genero.value,
  //   fecha_nacimiento: fecha_nacimiento.value,
  //   usuario: usuario.value,
  //   contrasena: contrasena.value,
  //   tipo_user: privilegios.value,
  // };

  // axios.post("/usuariosController.php", qs.stringify(dataSend)).then((res) => {
  //   let data = res.data;

  //   if (parseInt(data) > 0) {
  //     let newuser = {
  //       cve_persona: data,
  //       usuario: usuario.value,
  //       contrasena: contrasena.value,
  //       nombre: nombre.value,
  //       apellido_paterno: paterno.value,
  //       apellido_materno: materno.value,
  //       sexo: sexo.value,
  //       fecha_nacimiento: fecha_nacimiento.value,
  //       estatus: 1,
  //       privilegios: privilegios.value,
  //     };

  //     lst_invitados.value.push(newuser);
  //   }
  // });

try {
  
  let dataSend = {
    nombre: nombre.value,
    paterno: paterno.value,
    materno: materno.value,
    sexo: genero.value,
    fecha_nacimiento: fecha_nacimiento.value,
    usuario: usuario.value,
    contrasena: contrasena.value,
    tipo_user: privilegios.value,
  };

  const data_valid=await iValid(dataSend)

  const data = await guardarUsuarioSistemaService(data_valid);

  if (parseInt(data) > 0) {
    let newuser = {
      cve_persona: data,
      usuario: usuario.value,
      contrasena: contrasena.value,
      nombre: nombre.value,
      apellido_paterno: paterno.value,
      apellido_materno: materno.value,
      sexo: sexo.value,
      fecha_nacimiento: fecha_nacimiento.value,
      estatus: 1,
      privilegios: privilegios.value,
    };

    lst_invitados.value.push(newuser);
  }

  } catch (error) {
  console.log(error)
}

}

async function actualizar() {
  // let dataSend = {
  //   accion: 9,
  //   cve_persona: cve_persona.value,
  //   nombre: nombre.value,
  //   paterno: paterno.value,
  //   materno: materno.value,
  //   sexo: genero.value,
  //   fecha_nacimiento: fecha_nacimiento.value,
  //   usuario: usuario.value,
  //   contrasena: contrasena.value,
  //   tipo_user: privilegios.value,
  // };

  // axios.post("/usuariosController.php", qs.stringify(dataSend)).then((res) => {
  //   let data = res.data;

  //   if (parseInt(data) > 0) {
  //     selected.value.usuario = usuario.value;
  //     selected.value.contrasena = contrasena.value;
  //     selected.value.nombre = nombre.value;
  //     selected.value.apellido_paterno = paterno.value;
  //     selected.value.apellido_materno = materno.value;
  //     selected.value.sexo = sexo.value;
  //     selected.value.fecha_nacimiento = fecha_nacimiento.value;
  //     selected.value.estatus = 1;
  //   }
  // });

  let dataSend = {
    cve_persona: cve_persona.value,
    nombre: nombre.value,
    paterno: paterno.value,
    materno: materno.value,
    sexo: genero.value,
    fecha_nacimiento: fecha_nacimiento.value,
    usuario: usuario.value,
    contrasena: contrasena.value,
    tipo_user: privilegios.value,
  };


  const data_valid=await iValid(dataSend)


  const data = await actualizarUsuarioService(data_valid);

  if (parseInt(data) > 0) {
    selected.value.usuario = usuario.value;
    selected.value.contrasena = contrasena.value;
    selected.value.nombre = nombre.value;
    selected.value.apellido_paterno = paterno.value;
    selected.value.apellido_materno = materno.value;
    selected.value.sexo = sexo.value;
    selected.value.fecha_nacimiento = fecha_nacimiento.value;
    selected.value.estatus = 1;
  }
}


function fnCancelar()
{
     cve_persona.value=undefined
     nombre.value=undefined
     paterno.value=undefined
     materno.value=undefined
     genero.value=undefined
     fecha_nacimiento.value=undefined
     usuario.value=undefined
     contrasena.value=undefined
     privilegios.value=undefined
     iClear()
}

</script>

<style>
</style>