<template>
  <div>


{{ dia_ }}
    <div class="d-flex justify-space-between mb-2">
      <span></span>
      <h1 class="accent--text oswald--text">Catalogo Actividades</h1>
    </div>

    <v-toolbar class="mb-2" elevation="1">
      <div class="d-flex justify-space-between align-center" style="width: 100%;">

        <v-btn color="info" @click="dialog_proyecto = true">crear proyecto</v-btn>
        <div class="d-flex" style="column-gap: 10px;">

          <v-select label="areas" hide-details solo></v-select>
          <v-select label="colaborador" hide-details solo></v-select>
        </div>
      </div>
    </v-toolbar>

    <div class="d-flex redx">
      <div style="width: 300px;">
        <v-list>
          <v-list-item v-for="n in 10" :key="n">
            <!-- <v-list-content> -->
            <v-list-item-title>Actividad {{ n }}</v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
            <!-- </v-list-content> -->
          </v-list-item>
        </v-list>
      </div>
      <v-divider vertical class="mx-2"></v-divider>
      <div class="flex-grow-1"><v-card>
          <v-toolbar elevation="0">
            <v-btn icon class="ma-2" @click="$refs?.calendar?.prev()">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon class="ma-2" @click="$refs?.calendar?.next()">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>

            <v-toolbar-title>

              {{ $refs?.calendar?.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ types[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Dia</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mes</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>


          </v-toolbar>
          <!-- <v-sheet height="600"> -->
          <v-calendar 
            ref="calendar" 
            v-model="dia_" 
            :weekdays="[1,2,3,4,5,6,0]"
            :weekday-format="fnFormatDay"
            :type="type" 
            :events="events" 
            locale="es-mx"
            :event-overlap-mode="mode" 
            :event-overlap-threshold="30" 
            :event-color="getEventColor" 
            @change="getEvents"
            @click:event="showEvent" 
            @click:date="fnDateCalendar" 
            @click:day="fnDateCalendar2"
            @click:more="showEvent"
            style="height: calc(100vh - 250px);"></v-calendar>
          <!-- </v-sheet> -->
        </v-card>
      </div>
    </div>

    <v-dialog v-model="dialog_proyecto" width="450">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            crear proyecto
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_proyecto=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-10">
          <v-text-field filled></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn>Guardar</v-btn>
        </v-card-actions>
      </v-card>
      

    </v-dialog>

    <v-dialog v-model="dialog" width="600">
      <v-card>
        <v-toolbar extension-height="130" height="50" elevation="1">
          <v-toolbar-title>crear actividad</v-toolbar-title>
          <!-- <div class="d-flex justify-space-between" style="width: 100%;"> -->
          <!-- <div class="flex-grow-1"> -->
          <!-- crear actividad -->
          <!-- <v-text-field label="Titulo" outlined hide-details style="width: 100%;"></v-text-field>
            </div> -->
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
          <!-- </div> -->

          <template v-slot:extension>
            <div class="d-flex flex-column" style="width: 100%;row-gap: 15px;">
              <v-text-field label="Titulo" outlined hide-details style="width: 100%;"></v-text-field>
              <div class="d-flex align-center justify-space-between redx" style="width: 100%;height: 100%;">

                <div class="d-flex" style="column-gap: 10px;">
                  <!-- <v-switch label="todo dia" hide-details small class="mb-1"></v-switch> -->
                  <!-- <span class="accent--text text-subtitle-2">25 marzo 2025</span> -->
                  <span class="accent--text text-subtitle-2"><v-icon small>mdi-calendar</v-icon> {{ dayjs(fecha_inicio_actividad).format('DD-MM-YYYY') }}</span>
                  <span class="accent--text text-subtitle-2" v-if="dias_actividad>1"><v-icon small>mdi-calendar</v-icon> {{ dayjs(fecha_inicio_actividad).add(dias_actividad-1,"day").format('DD-MM-YYYY') }}</span>
                </div>
                <div class="d-flex">

                  <div>
                    <v-btn icon small @click="dias_actividad--"><v-icon>mdi-minus</v-icon></v-btn>
                    {{ dias_actividad }}
                    <v-btn icon small @click="dias_actividad++"><v-icon>mdi-plus</v-icon></v-btn>
                  </div>



                </div>
              </div>
            </div>
          </template>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12">
              <v-select label="responsable" outlined></v-select>
            </v-col>
            <v-col cols="12">
              <v-btn block x-large outlined>color</v-btn>
            </v-col>
            <v-col cols="12">
              <v-select label="Proyecto" outlined></v-select>
            </v-col>
            <v-col cols="12">
              <v-select label="Estimacion horas" outlined></v-select>
            </v-col>
          </v-row>
          <!-- <v-text-field label="Titulo" outlined></v-text-field> -->
          <!-- <v-text-field label="fecha_inicio"></v-text-field> -->
          <!-- <v-text-field label="Fecha_fin"></v-text-field> -->
          <!-- <v-text-field label="persona quine lo realiza"></v-text-field> -->

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn>Crear actividad</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar :color="selectedEvent?.color" dark>
          <v-btn icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-toolbar-title v-html="selectedEvent?.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <span v-html="selectedEvent?.details"></span>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="secondary" @click="selectedOpen = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>



  </div>
</template>
<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'


//#region variables

const calendar = ref(null)

const type = ref('month')
const types = { month: 'Mes', week: 'semana', day: 'dia' }

const mode = ref('stack')
// const modes = ref(['stack', 'column'])

const dia_ = ref(dayjs().format('YYYY-MM-DD'))
const events = ref([])
const colors = ref(['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'])
const names = ref(['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'])

const selectedEvent = ref({})
const selectedOpen = ref(false)
const selectedElement = ref(null)


const dialog = ref(false)
const dialog_proyecto = ref(false)

const lst_areas = ref([])
const lst_colaboradores = ref([])
const lst_formatom8 = ref([])

const titulo_actividad = ref('')
const fecha_inicio_actividad = ref()
const fecha_fin_actividad = ref()
const responsable = ref()
const proyecto = ref()
const estimacion_horas = ref()

const dias_actividad=ref(1)

//#endregion variables


//#region funciones

function fnFormatDay(dia)
{
  console.log('diaxxx',dia)
  return ''
}

function fnGetAreas()
{}

function fnGetColaboradoresByArea()
{

}

function fnGetActividadesFormato8()
{

}

function getEvents({ start, end }) {
  const events_ = []

  const min = new Date(`${start.date}T00:00:00`)
  const max = new Date(`${end.date}T23:59:59`)
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)

    events_.push({
      name: names.value[rnd(0, names.value.length - 1)],
      start: first,
      end: second,
      color: colors.value[rnd(0, colors.value.length - 1)],
      timed: !allDay,
    })
  }

  events.value = events_
}

function getEventColor(event) {
  return event.color
}
function rnd(a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}

// function showEvent({ nativeEvent, event }) {
function showEvent(event) {

  console.log('evento:', event)
  event.nativeEvent.stopPropagation()

  // const open = () => {
  //   selectedEvent.value = event
  //   selectedElement.value = nativeEvent.target
  //   requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
  // }

  // if (selectedOpen.value) {
  //   selectedOpen.value = false
  //   requestAnimationFrame(() => requestAnimationFrame(() => open()))
  // } else {
  //   open()
  // }

  // nativeEvent.stopPropagation()
}

function fnDateCalendar(date_, event) {
  console.log("click date")
  console.log("cliek date-> date_ ", date_)
  console.log("cliek date-> event ", event)
}

function fnDateCalendar2(date_, event) {
  dialog.value = true
  console.log("click day")
  console.log("cliek day-> date_ ", date_)
  console.log("cliek day-> event ", event)
}

function fnDateCalendarMore(date_,event)
{
console.log('',date_)
console.log('',event)
}


//#endregion funciones

</script>
