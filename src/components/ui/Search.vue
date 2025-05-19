<template>
  <div class="d-flex flex-column">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
      left
      rounded
      max-width="500"      
      max-height="calc(100vh - 20px)"
      transition="scale-transition"        
      content-class="overflow-y-auto"
    >
      <template v-slot:activator="{on}">
        <div style="width: 250px" class="align-self-end">
          <v-text-field
            :value="value"
            class="shrink rounded-lg "
            placeholder="Filtros y búsqueda"            
            hide-details
            outlined
            dense            
            color="primary"
            background-color="white"
            @input="$emit('input',$event)"
          >
          <template v-slot:append>
              <v-btn @click="menu = true" v-on="on" fab x-small color="primary" elevation="0" style="margin-top:-4px;margin-right:-8px"><v-icon color="white">mdi-magnify</v-icon></v-btn>
          </template>

          </v-text-field>
        </div>
      </template>

      <v-card width="500" >
        <v-card-text>
          <v-row>
            <template v-for="(filter, index) in filter_local">
              <v-col
                cols="12"
                md="4"
                lg="4"
                class="d-flex align-center"
              >
                <strong>{{ filter.label }}</strong>
              </v-col>
              <v-col cols="12" md="8" lg="8">
                <slot :name="filter.key" :data="filter">
                  <v-text-field
                    v-if="filter.type == 'text'"
                    v-model="filter.value"
                    hide-details
                    densex
                    filled
                    class="my-mayus"
                  ></v-text-field>
                  <v-select
                    v-else-if="filter.type == 'select'"
                    v-model="filter.value"
                    hide-details
                    filled
                    densex
                    :items="filter.items"
                    :item-value="filter.itemValue"
                    :item-text="filter.itemText"
                  ></v-select>
                  <v-menu
                    v-model="filter.menu"
                    offset-y
                    max-width="290"
                    v-else-if="filter.type == 'date'"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="dayjs(filter.value).isValid()?dayjs(filter.value).format('DD-MMM-YYYY'):''"
                        densex
                        hide-details
                        filled
                        prepend-inner-icon="mdi-calendar"
                        v-on="on"
                        v-bind="attrs"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="filter.value"
                      no-title
                      @input="filter.menu = false"
                    ></v-date-picker>
                  </v-menu>
                </slot>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="clean_filtros" outlinedx elevation="0">
            <v-icon class="mr-2">mdi-eraser</v-icon>limpiar
          </v-btn>
          <v-btn color="primary" @click="buscar" :loading="loading" elevation="0">
            <v-icon class="mr-2">mdi-magnify</v-icon>Buscar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <div class="mt-1 d-flex justify-end" v-if="flag_filter">
      <v-chip
        v-for="(chip, index) in selected_filters"
        :key="index"
        small
        close
        class="mr-1"
        @click:close="close_chips(chip)"
      >
        <strong>{{ chip.label }}</strong
        >&nbsp;
        <span v-if="chip.type === 's'" class="ml-1">{{
          chip.items.find((i) => i[chip.itemValue] == chip.value)[chip.itemText]
        }}</span>
        <span v-if="chip.type === 'text'" class="ml-1">{{ chip.value }}</span>
        <span v-else class="ml-1">{{chip.text}}</span>
      </v-chip>
    </div>
  </div>
</template> 

<script setup>
import { onMounted, ref, computed, watch ,getCurrentInstance} from "vue";
import dayjs from 'dayjs'

const props=defineProps({
    value:{ type: String, defaults:''},
    filters: { type: Array, default: () => [] },
    clean: { type: Boolean, default: false },
  })

const emit= defineEmits(['emit-buscar'])

    const root = getCurrentInstance().proxy;
    const flag_filter=ref(false)//indica si se realizo el filtro o no
    const menu = ref(false);
    const loading = ref(false);
    const filter_local = ref([]);
    const selected_filters = computed(() =>filter_local.value.filter((i) => Boolean(i.value)));
    const limpiar= ref(false);

    onMounted(() => {
        filter_local.value = props.filters;
        limpiar.value= props.clean;
    });
    watch(() => props.clean, function(value){
     
      if(value){
        clean_filtros();
      }
    });
    async function buscar() {

      console.log(filter_local.value)
      
      flag_filter.value=true;
      let dataSend = selected_filters.value.map(i=>({[i.key]: i.value })).reduce((reductor,value)=>Object.assign(reductor, value),{});
      console.log('dataSend:',dataSend)
      menu.value=false;
      console.log(dataSend,emit)
      emit("emit-buscar", dataSend);
    }

    function clean_filtros() {
      if(selected_filters.value.length>0)
      {
        filter_local.value.forEach(i=>i.value="");
        emit("emit-buscar",{});
      }
      flag_filter.value=false;
      menu.value=false;
    }

    function close_chips(item) {
      item.value = "";
      buscar();
    }
  
</script>