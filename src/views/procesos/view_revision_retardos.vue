<template>
    <div class="d-flex" style="background-color: #fff;height: 100%;">
        
        <div>
            <v-date-picker v-model="selected_days" locale="es" show-adjacent-months range @click:month="fnSelectedMonth" @change="fnChangeDate" @update:picker-date="fnUpdatePicker"></v-date-picker>
            <v-select filled class="mt-15"></v-select>
            <v-btn @click="fnCalcularFechas">calcular fechas</v-btn>

        </div>
        <div class="flex-grow-1">
            {{ selected_days }}
        <v-toolbar flat>
            <v-toolbar-title>
                <!-- {{ calendarRef?.title}} -->
                {{ title_month }}
            </v-toolbar-title>
        </v-toolbar>
        <v-calendar 
        v-model="focus"  
        ref="calendarRef" 
        color="primary" 
        locale="es" 
        :short-weekdays="false" 
        :show-week="true"
        :events="events_" 
        :start="start_month" 
        :event-more="false"
        event-overlap-mode="column"
                type="day"
        ></v-calendar>
    </div>
    </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

const calendarRef=ref()
const events_=ref([
   
])

const focus=ref(dayjs().toDate())

const selected_days=ref([])

const start_month=ref()

const title_month=ref()

onMounted(()=>{
    // title_month.value=calendarRef.value.title
    // calendarRef.value.checkChange()
})

function fnSelectedMonth(value)
{
    console.log('selected-month',value)
}

function fnChangeDate(value)
{
console.log('change-date',value)
console.log('change-date sort',value.sort((a,b)=>{
    if(dayjs(a).isBefore(dayjs(b)))return -1
    else if(dayjs(a).isAfter(dayjs(b)))return 1
    else return 0
}))
}


function fnUpdatePicker(value)
{
    
selected_days.value=[]
console.log('update-picker',value)
start_month.value=`${value}-01`
if(Boolean(calendarRef.value)){

title_month.value=calendarRef.value.title
}
}

function fnCalcularFechas()
{
   const two_date=selected_days.value.sort((a,b)=>{
    if(dayjs(a).isBefore(dayjs(b)))return -1
    else if(dayjs(a).isAfter(dayjs(b)))return 1
    else return 0
}) 

console.log('two_date',two_date)
const [date_one,date_two]=two_date;
console.log(date_one,date_two)
console.log(dayjs(date_one).isBefore(date_two))

let date_init=dayjs(date_one)
// events_.value=[]

const horario=[{h:7,m:0,h2:15,m2:0},{h:16,m:0,h2:17,m2:0},{h:7,m:15,h2:19,m2:5},]
const color=['red','green','blue']
const label=['07:00:00/07:05:15 - 16:00:00/17:40:05','15:00:00/NA - 16:00:00/NA','ingreso']
while(date_init.isSameOrBefore(date_two))
{
   
    console.log(date_init)
    

    for(let ii=0;ii<3;ii++){
    events_.value.push({
            name:label[ii],
            start: date_init.hour(horario[ii].h).minute(horario[ii].m).toDate(),
            end: date_init.hour(horario[ii].h2).minute(horario[ii].m2).toDate(),
            color: color[ii],
            timed:  false,
            category:'Leon'
    })
}

    date_init=date_init.clone().add(1,'day')
}


}

</script>