<template>
  <v-stepper-content step="4">
      <v-card class="mb-12 d-flex" style="column-gap: 25px;" color="grey lighten-3 pa-5 overflow-y-auto" height="600px"
          elevation="0">
          
          <div>
          <div class="text-h5 mt-10 font-weight-bold">1.-Cabeza</div>
          <div class="d-flex flex-column ml-6" style="column-gap: 25px;">
             
            <v-item-group v-model="cabeza_ojos">
                  <div class="text-h6 mb-1">
                  a) Ojos
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">                    
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>            
                  </div>
                  <v-text-field v-model="cabeza_ojos_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="cabeza_nariz">
                  <div class="text-h6 mb-1">
                      b) Nariz
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="cabeza_nariz_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="cabeza_faringe">
                  <div class="text-h6 mb-1">
                     c) Faringe
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="cabeza_faringe_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>


              <v-item-group v-model="cabeza_boca">
                  <div class="text-h6 mb-1">
                      d) Boca
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                      
                  </div>
                  <v-text-field v-model="cabeza_boca_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="cabeza_dentadura">
                  <div class="text-h6 mb-1">
                      e) Dentadura
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="cabeza_dentadura_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="cabeza_audicion">
                  <div class="text-h6 mb-1">
                      f) Audicion
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                     
                  </div>
                  <v-text-field v-model="cabeza_audicion_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="cabeza_vision">
                  <div class="text-h6 mb-1">
                      g) Vision
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="cabeza_vision_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

          </div>
          </div>

          <div>
          <div class="text-h5 mt-10 font-weight-bold">2.-Cuello</div>
          <div class="d-flex flex-column ml-6" style="column-gap: 25px;">
             
            <v-item-group v-model="cuello_forma">
                  <div class="text-h6 mb-1">
                  a) Forma
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">                    
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>            
                  </div>
                  <v-text-field v-model="cuello_forma_text" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="cuello_volumen">
                  <div class="text-h6 mb-1">
                      b) Valumen
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="cuello_volumen_text" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="cuello_adenomegalia">
                  <div class="text-h6 mb-1">
                     c) Adenomegalia
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="cuello_adenomegalia_text" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>


              <v-item-group v-model="cuello_tiroides">
                  <div class="text-h6 mb-1">
                      d) Tiroides
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                      
                  </div>
                  <v-text-field v-model="cuello_tiroides_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="cuello_tumuraciones">
                  <div class="text-h6 mb-1">
                      e) Tumuraciones
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="cuello_tumuraciones_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="cuello_pulsos">
                  <div class="text-h6 mb-1">
                      f) Pulsos
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                     
                  </div>
                  <v-text-field v-model="cuello_pulsos_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>
             

          </div>
        </div>

          <div>
          <div class="text-h5  mt-10 font-weight-bold">3.-Tórax</div>
          <div class="d-flex flex-column ml-6" style="column-gap: 25px;">
             
            <v-item-group v-model="torax_forma">
                  <div class="text-h6 mb-1">
                  a) Forma
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">                    
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>            
                  </div>
                  <v-text-field v-model="torax_forma_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="torax_volumen">
                  <div class="text-h6 mb-1">
                      b) Volumen
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="torax_volumen_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="torax_ampliacion">
                  <div class="text-h6 mb-1">
                     c) Mov ampliacion
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="torax_ampliacion_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>


              <v-item-group v-model="torax_amplexa">
                  <div class="text-h6 mb-1">
                      d) Mov amplexación
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                      
                  </div>
                  <v-text-field v-model="torax_amplexa_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="torax_precusion">
                  <div class="text-h6 mb-1">
                      e) Precusión
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="torax_precusion_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="torax_cardiacos">
                  <div class="text-h6 mb-1">
                      f) Ruidos cardiacos
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                     
                  </div>
                  <v-text-field v-model="torax_cardiacos_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="torax_pulmunares">
                  <div class="text-h6 mb-1">
                      g) Campos pulmunares
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="torax_pulmunares_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

          </div>
        </div>
          
         <div>
          <div class="text-h5  mt-10 font-weight-bold">4.-Abdomen</div>
          <div class="d-flex flex-column ml-6" style="column-gap: 25px;">
             
            <v-item-group v-model="abdomen_forma">
                  <div class="text-h6 mb-1">
                  a) Forma
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">                    
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>            
                  </div>
                  <v-text-field v-model="abdomen_forma_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="abdomen_volumen">
                  <div class="text-h6 mb-1">
                      b) Volumen
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="abdomen_volumen_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="abdomen_palpitacion">
                  <div class="text-h6 mb-1">
                     c) Palpitación
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="abdomen_palpitacion_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>


              <v-item-group v-model="abdomen_percusion">
                  <div class="text-h6 mb-1">
                      d) Percusión
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                      
                  </div>
                  <v-text-field v-model="abdomen_percusion_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>





              <v-item-group v-model="abdomen_peristalsis">
                  <div class="text-h6 mb-1">
                      e) Peristalsis
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                     
                  </div>
                  <v-text-field v-model="abdomen_peristalsis_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

             

          </div>
        </div>

        <div>
          <div class="text-h5 mt-10 font-weight-bold">2.-Extremidades Torácicas</div>
          <div class="d-flex flex-column ml-6" style="column-gap: 25px;">
             
            <v-item-group v-model="toracicas_forma">
                  <div class="text-h6 mb-1">
                  a) Forma
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">                    
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>            
                  </div>
                  <v-text-field v-model="toracicas_forma_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="toracicas_volumen">
                  <div class="text-h6 mb-1">
                      b) Valumen
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="toracicas_volumen_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="toracicas_articular">
                  <div class="text-h6 mb-1">
                     c) Movilidad articular
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="toracicas_articular_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="toracicas_pulsos">
                  <div class="text-h6 mb-1">
                      d) Pulsos
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                     
                  </div>
                  <v-text-field v-model="toracicas_pulsos_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="toracicas_sensibilidad">
                  <div class="text-h6 mb-1">
                      e) Sensibilidad
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                      
                  </div>
                  <v-text-field v-model="toracicas_sensibilidad_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>



              <v-item-group v-model="toracicas_osteotendino">
                  <div class="text-h6 mb-1">
                      f) Reflejos osteotendinosos
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="toracicas_osteotendino_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>


          </div>
        </div>

        <div>
          <div class="text-h5 mt-10 font-weight-bold">2.-Extremidades Pélvicas</div>
          <div class="d-flex flex-column ml-6" style="column-gap: 25px;">
             
            <v-item-group v-model="pelvis_forma">
                  <div class="text-h6 mb-1">
                  a) Forma
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">                    
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>            
                  </div>
                  <v-text-field v-model="pelvis_forma_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="pelvis_volumen">
                  <div class="text-h6 mb-1">
                      b) Valumen
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field v-model="pelvis_volumen_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="pelvis_articular">
                  <div class="text-h6 mb-1">
                     c) Movilidad articular
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                      
                  </div>
                  <v-text-field v-model="pelvis_articular_txt" outlined dense class="mt-3 ml-6  my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="pelvis_sensibilidad">
                  <div class="text-h6 mb-1">
                      d) Pulsos Sensibilidad
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>
                      
                  </div>
                  <v-text-field  v-model="pelvis_sensibilidad_txt" outlined dense class="mt-3 ml-6 my-mayus"></v-text-field>
              </v-item-group>

              <v-item-group v-model="pelvis_osteotendino">
                  <div class="text-h6 mb-1">
                      e) Reflejos osteotendinosos
                  </div>
                  <div class="d-flex ml-5" style="gap:10px">
                      <div v-for="n in 2" :key="n">
                          <v-item v-slot="{ active, toggle }" :value="n">
                              <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                  width="90" height="40" @click="toggle">
                                  <!-- <v-scroll-y-transition> -->
                                  <div class="text-h6 flex-grow-1 text-center">
                                      {{ n == 1 ? 'Normal' : 'Anormal'}}
                                  </div>
                                  <!-- </v-scroll-y-transition> -->
                              </v-card>
                          </v-item>
                      </div>                     
                  </div>
                  <v-text-field  v-model="pelvis_osteotendino_txt" outlined dense class="mt-3 ml-6 my-mayus"></v-text-field>
              </v-item-group>


          </div>
        </div>

      </v-card>

      <v-btn color="secondary mr-3" @click="back">
        <v-icon class="mr-1">mdi-arrow-left</v-icon>
            Anterior
        </v-btn>  

      <v-btn color="primary" @click="next">
        Siguiente
            <v-icon class="ml-1">mdi-arrow-right</v-icon>
      </v-btn>
     
  </v-stepper-content>
</template>

<script setup>
import {ref,watch } from 'vue'
import {object,string,number} from 'yup'
import isEmpty from 'lodash/isEmpty'
import {getExploracionFisica,saveExploracionFisica,updateExploracionFisica} from '@/services/examen_medico_service'

const props=defineProps({edit:{type:Boolean,default:false},id_examen:{type:Number|String,default:0}})
const emit = defineEmits(['emit-next','emit-back']);

const schema=object().shape({
   
cabeza_ojos:number().required().oneOf([1,2,3]).label("Ojos"),
cabeza_nariz:number().required().oneOf([1,2,3]).label("Nariz"),
cabeza_faringe:number().required().oneOf([1,2,3]).label("Faringe"),
cabeza_boca:number().required().oneOf([1,2,3]).label("Boca"),
cabeza_dentadura:number().required().oneOf([1,2,3]).label("Dentadura"),
cabeza_audicion:number().required().oneOf([1,2,3]).label("Audicion"),
cabeza_vision:number().required().oneOf([1,2,3]).label("Vision"),

cuello_forma:number().required().oneOf([1,2,3]).label("Fomrma del cuello"),
cuello_volumen:number().required().oneOf([1,2,3]).label("Volumnen de cuello"),
cuello_adenomegalia:number().required().oneOf([1,2,3]).label("Adenomegalia"),
cuello_tiroides:number().required().oneOf([1,2,3]).label("Tiroides"),
cuello_tumuraciones:number().required().oneOf([1,2,3]).label("Tumuraciones del cuello"),
cuello_pulsos:number().required().oneOf([1,2,3]).label("Pulsos en cuello"),

torax_forma:number().required().oneOf([1,2,3]).label("Forma del torax"),
torax_volumen:number().required().oneOf([1,2,3]).label("Volumen del torax"),
torax_ampliacion:number().required().oneOf([1,2,3]).label("Ampliacion del torax"),
torax_amplexa:number().required().oneOf([1,2,3]).label("Amplexacion del torax"),
torax_precusion:number().required().oneOf([1,2,3]).label("Precusion del torax"),
torax_cardiacos:number().required().oneOf([1,2,3]).label("Ruidos cardiacos torax"),
torax_pulmunares:number().required().oneOf([1,2,3]).label("Campos pulmonares del torax"),

abdomen_forma:number().required().oneOf([1,2,3]).label("Forma del abdomen"),
abdomen_volumen:number().required().oneOf([1,2,3]).label("Volumen del abdomen"),
abdomen_palpitacion:number().required().oneOf([1,2,3]).label("Palpitacion del abdomen"),
abdomen_percusion:number().required().oneOf([1,2,3]).label("Percusion del abdomen"),
abdomen_peristalsis:number().required().oneOf([1,2,3]).label("Peristalsis abdominal"),

toracicas_forma:number().required().oneOf([1,2,3]).label("Forma toracica"),
toracicas_volumen:number().required().oneOf([1,2,3]).label("Volumen toracico"),
toracicas_articular:number().required().oneOf([1,2,3]).label("Movilidad articular toracico"),
toracicas_pulsos:number().required().oneOf([1,2,3]).label("Pulsos toracicos"),
toracicas_sensibilidad:number().required().oneOf([1,2,3]).label("Sensibilidad toracica"),
toracicas_osteotendino:number().required().oneOf([1,2,3]).label("Reflejo osteotendinosos toracicos"),

pelvis_forma:number().required().oneOf([1,2,3]).label("Forma pelvica"),
pelvis_volumen:number().required().oneOf([1,2,3]).label("Volumen pervico"),
pelvis_articular:number().required().oneOf([1,2,3]).label("Movilidad articular pelvica"),
pelvis_sensibilidad:number().required().oneOf([1,2,3]).label("Pulso sensibilidad pelvico"),
pelvis_osteotendino:number().required().oneOf([1,2,3]).label("Reflejo osteotendinos pelvico"),


//textos
cabeza_ojos_txt:string().notRequired().trim().uppercase(),
cabeza_nariz_txt:string().notRequired().trim().uppercase(),
cabeza_faringe_txt:string().notRequired().trim().uppercase(),
cabeza_boca_txt:string().notRequired().trim().uppercase(),
cabeza_dentadura_txt:string().notRequired().trim().uppercase(),
cabeza_audicion_txt:string().notRequired().trim().uppercase(),
cabeza_vision_txt:string().notRequired().trim().uppercase(),

})

watch(()=>props.edit,(val)=>{
    if(val){
        console.log("ejecuta la busqueda:",props.id_examen)
        fnGetExploracionFisica()
    }
})

let id_exploracion=0;
//cabeza
const cabeza_ojos=ref()
const cabeza_ojos_txt=ref('')
const cabeza_nariz=ref()
const cabeza_nariz_txt=ref('')
const cabeza_faringe=ref()
const cabeza_faringe_txt=ref('')
const cabeza_boca=ref()
const cabeza_boca_txt=ref('')
const cabeza_dentadura=ref()
const cabeza_dentadura_txt=ref('')
const cabeza_audicion=ref()
const cabeza_audicion_txt=ref('')
const cabeza_vision=ref()
const cabeza_vision_txt=ref('')

//cuello
const cuello_forma=ref()
const cuello_forma_text=ref('')
const cuello_volumen=ref()
const cuello_volumen_text=ref('')
const cuello_adenomegalia=ref()
const cuello_adenomegalia_text=ref('')
const cuello_tiroides=ref()
const cuello_tiroides_txt=ref('')
const cuello_tumuraciones=ref()
const cuello_tumuraciones_txt=ref('')
const cuello_pulsos=ref()
const cuello_pulsos_txt=ref('')

//torax
const torax_forma=ref()
const torax_forma_txt=ref('')
const torax_volumen=ref()
const torax_volumen_txt=ref('')
const torax_ampliacion=ref()
const torax_ampliacion_txt=ref('')
const torax_amplexa=ref()
const torax_amplexa_txt=ref('')
const torax_precusion=ref()
const torax_precusion_txt=ref('')
const torax_cardiacos=ref()
const torax_cardiacos_txt=ref('')
const torax_pulmunares=ref()
const torax_pulmunares_txt=ref('')

//abdomen
const abdomen_forma=ref()
const abdomen_forma_txt=ref('')
const abdomen_volumen=ref()
const abdomen_volumen_txt=ref('')
const abdomen_palpitacion=ref()
const abdomen_palpitacion_txt=ref('')
const abdomen_percusion=ref()
const abdomen_percusion_txt=ref('')
const abdomen_peristalsis=ref()
const abdomen_peristalsis_txt=ref('')

//toracicas
const toracicas_forma=ref()
const toracicas_forma_txt=ref('')
const toracicas_volumen=ref()
const toracicas_volumen_txt=ref('')
const toracicas_articular=ref()
const toracicas_articular_txt=ref('')
const toracicas_pulsos=ref()
const toracicas_pulsos_txt=ref('')
const toracicas_sensibilidad=ref()
const toracicas_sensibilidad_txt=ref('')
const toracicas_osteotendino=ref()
const toracicas_osteotendino_txt=ref('')

//pelvis
const pelvis_forma=ref()
const pelvis_forma_txt=ref('')
const pelvis_volumen=ref()
const pelvis_volumen_txt=ref('')
const pelvis_articular=ref()
const pelvis_articular_txt=ref('')
const pelvis_sensibilidad=ref()
const pelvis_sensibilidad_txt=ref('')
const pelvis_osteotendino=ref()
const pelvis_osteotendino_txt=ref('')



function back() {
  emit('emit-back', 3)
}

async function next()
{

    const dataSend={
        id_examen_medico:props.id_examen,
//cabeza
cabeza_ojos:cabeza_ojos.value,
cabeza_ojos_txt:cabeza_ojos_txt.value,
cabeza_nariz:cabeza_nariz.value,
cabeza_nariz_txt:cabeza_nariz_txt.value,
cabeza_faringe:cabeza_faringe.value,
cabeza_faringe_txt:cabeza_faringe_txt.value,
cabeza_boca:cabeza_boca.value,
cabeza_boca_txt:cabeza_boca_txt.value,
cabeza_dentadura:cabeza_dentadura.value,
cabeza_dentadura_txt:cabeza_dentadura_txt.value,
cabeza_audicion:cabeza_audicion.value,
cabeza_audicion_txt:cabeza_audicion_txt.value,
cabeza_vision:cabeza_vision.value,
cabeza_vision_txt:cabeza_vision_txt.value,

//cuello
cuello_forma:cuello_forma.value,
cuello_forma_text:cuello_forma_text.value,
cuello_volumen:cuello_volumen.value,
cuello_volumen_text:cuello_volumen_text.value,
cuello_adenomegalia:cuello_adenomegalia.value,
cuello_adenomegalia_text:cuello_adenomegalia_text.value,
cuello_tiroides:cuello_tiroides.value,
cuello_tiroides_txt:cuello_tiroides_txt.value,
cuello_tumuraciones:cuello_tumuraciones.value,
cuello_tumuraciones_txt:cuello_tumuraciones_txt.value,
cuello_pulsos:cuello_pulsos.value,
cuello_pulsos_txt:cuello_pulsos_txt.value,

//torax
torax_forma:torax_forma.value,
torax_forma_txt:torax_forma_txt.value,
torax_volumen:torax_volumen.value,
torax_volumen_txt:torax_volumen_txt.value,
torax_ampliacion:torax_ampliacion.value,
torax_ampliacion_txt:torax_ampliacion_txt.value,
torax_amplexa:torax_amplexa.value,
torax_amplexa_txt:torax_amplexa_txt.value,
torax_precusion:torax_precusion.value,
torax_precusion_txt:torax_precusion_txt.value,
torax_cardiacos:torax_cardiacos.value,
torax_cardiacos_txt:torax_cardiacos_txt.value,
torax_pulmunares:torax_pulmunares.value,
torax_pulmunares_txt:torax_pulmunares_txt.value,

//abdomen
abdomen_forma:abdomen_forma.value,
abdomen_forma_txt:abdomen_forma_txt.value,
abdomen_volumen:abdomen_volumen.value,
abdomen_volumen_txt:abdomen_volumen_txt.value,
abdomen_palpitacion:abdomen_palpitacion.value,
abdomen_palpitacion_txt:abdomen_palpitacion_txt.value,
abdomen_percusion:abdomen_percusion.value,
abdomen_percusion_txt:abdomen_percusion_txt.value,
abdomen_peristalsis:abdomen_peristalsis.value,
abdomen_peristalsis_txt:abdomen_peristalsis_txt.value,

//toracicas
toracicas_forma:toracicas_forma.value,
toracicas_forma_txt:toracicas_forma_txt.value,
toracicas_volumen:toracicas_volumen.value,
toracicas_volumen_txt:toracicas_volumen_txt.value,
toracicas_articular:toracicas_articular.value,
toracicas_articular_txt:toracicas_articular_txt.value,
toracicas_pulsos:toracicas_pulsos.value,
toracicas_pulsos_txt:toracicas_pulsos_txt.value,
toracicas_sensibilidad:toracicas_sensibilidad.value,
toracicas_sensibilidad_txt:toracicas_sensibilidad_txt.value,
toracicas_osteotendino:toracicas_osteotendino.value,
toracicas_osteotendino_txt:toracicas_osteotendino_txt.value,

//pelvis
pelvis_forma:pelvis_forma.value,
pelvis_forma_txt:pelvis_forma_txt.value,
pelvis_volumen:pelvis_volumen.value,
pelvis_volumen_txt:pelvis_volumen_txt.value,
pelvis_articular:pelvis_articular.value,
pelvis_articular_txt:pelvis_articular_txt.value,
pelvis_sensibilidad:pelvis_sensibilidad.value,
pelvis_sensibilidad_txt:pelvis_sensibilidad_txt.value,
pelvis_osteotendino:pelvis_osteotendino.value,
pelvis_osteotendino_txt:pelvis_osteotendino_txt.value,
   }
  try {   
        const dataValid=await schema.validate(dataSend)
        if(id_exploracion==0)
        {
            id_exploracion=await saveExploracionFisica(dataValid);
            if(id_exploracion>0)emit('emit-next', 5)
        }
        else{
            await updateExploracionFisica(id_exploracion,dataValid)
            emit('emit-next', 5)
        }
    
    } catch (error) {
        console.log(error);

       
    }
}

async function fnGetExploracionFisica()
{
try {
    const data=await getExploracionFisica(props.id_examen)
    if(!isEmpty(data)){
id_exploracion=data.id_examen_medico_exploracion;
//cabeza
cabeza_ojos.value=data.cabeza_ojos
cabeza_ojos_txt.value=data.cabeza_ojos_txt
cabeza_nariz.value=data.cabeza_nariz
cabeza_nariz_txt.value=data.cabeza_nariz_txt
cabeza_faringe.value=data.cabeza_faringe
cabeza_faringe_txt.value=data.cabeza_faringe_txt
cabeza_boca.value=data.cabeza_boca
cabeza_boca_txt.value=data.cabeza_boca_txt
cabeza_dentadura.value=data.cabeza_dentadura
cabeza_dentadura_txt.value=data.cabeza_dentadura_txt
cabeza_audicion.value=data.cabeza_audicion
cabeza_audicion_txt.value=data.cabeza_audicion_txt
cabeza_vision.value=data.cabeza_vision
cabeza_vision_txt.value=data.cabeza_vision_txt

//cuello
cuello_forma.value=data.cuello_forma
cuello_forma_text.value=data._txt
cuello_volumen.value=data.cuello_volumen
cuello_volumen_text.value=data.cuello_volumen_txt
cuello_adenomegalia.value=data.cuello_adenome
cuello_adenomegalia_text.value=data.cuello_adenome_txt
cuello_tiroides.value=data.cuello_tiroides
cuello_tiroides_txt.value=data.cuello_tiroides_txt
cuello_tumuraciones.value=data.cuello_tumuraciones
cuello_tumuraciones_txt.value=data.cuello_tumuraciones_txt
cuello_pulsos.value=data.cuello_pulsos
cuello_pulsos_txt.value=data.cuello_pulsos_txt

//torax
torax_forma.value=data.torax_forma
torax_forma_txt.value=data.torax_forma_txt
torax_volumen.value=data.torax_volumen
torax_volumen_txt.value=data.torax_volumen_txt
torax_ampliacion.value=data.torax_ampliacion
torax_ampliacion_txt.value=data.torax_ampliacion_txt
torax_amplexa.value=data.torax_amplexa
torax_amplexa_txt.value=data.torax_amplexa_txt
torax_precusion.value=data.torax_precusion
torax_precusion_txt.value=data.torax_precusion_txt
torax_cardiacos.value=data.torax_cardiaco
torax_cardiacos_txt.value=data.torax_cardiaco_txt
torax_pulmunares.value=data.torax_pulmonares
torax_pulmunares_txt.value=data.torax_pulmonares_txt

//abdomen
abdomen_forma.value=data.abdomen_forma
abdomen_forma_txt.value=data.abdomen_forma_txt
abdomen_volumen.value=data.abdomen_volumen
abdomen_volumen_txt.value=data.abdomen_volumen_txt
abdomen_palpitacion.value=data.abdomen_palpitacion
abdomen_palpitacion_txt.value=data.abdomen_palpitacion_txt
abdomen_percusion.value=data.abdomen_percusion
abdomen_percusion_txt.value=data.abdomen_percusion_txt
abdomen_peristalsis.value=data.abdomen_peristalsis
abdomen_peristalsis_txt.value=data.abdomen_peristalsis_txt

//toracicas
toracicas_forma.value=data.toracicas_forma
toracicas_forma_txt.value=data.toracicas_forma_txt
toracicas_volumen.value=data.toracicas_volumen
toracicas_volumen_txt.value=data.toracicas_volumen_txt
toracicas_articular.value=data.toracicas_movilidad
toracicas_articular_txt.value=data.toracicas_movilidad_txt
toracicas_pulsos.value=data.toracicas_pulso
toracicas_pulsos_txt.value=data.toracicas_pulso_txt
toracicas_sensibilidad.value=data.toracicas_sensibilidad
toracicas_sensibilidad_txt.value=data.toracicas_sensibilidad_txt
toracicas_osteotendino.value=data.toracicas_osteo
toracicas_osteotendino_txt.value=data.toracicas_osteo_txt

//pelvis
pelvis_forma.value=data.pelvicas_forma
pelvis_forma_txt.value=data.pelvicas_forma_txt
pelvis_volumen.value=data.pelvicas_volumen
pelvis_volumen_txt.value=data.pelvicas_volumen_txt
pelvis_articular.value=data.pelvicas_articular
pelvis_articular_txt.value=data.pelvicas_articular_txt
pelvis_sensibilidad.value=data.pelvicas_sensibilidad
pelvis_sensibilidad_txt.value=data.pelvicas_sensibilidad_txt
pelvis_osteotendino.value=data.pelvicas_osteo
pelvis_osteotendino_txt.value=data.pelvicas_osteo_txt
    }
} catch (error) {
    
}
}

</script>