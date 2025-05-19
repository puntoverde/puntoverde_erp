<template>
  <v-app>
    <div id="div-main" class="white d-flex flex-row">
      <div id="logo" style="position: relative" class="purplex">
        <!-- <div style="height: 100%; width: 300px; overflow: hidden; position:absolute; right:0;background-color:white" >
                      <svg viewBox="0 0 220 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M208.08,0.00 C152.69,67.09 262.02,75.98 200.80,150.00 L0.00,150.00 L0.00,0.00 Z" style="stroke: none; fill: transparent;"></path></svg>
                    </div> -->

        <!-- <div style="height: 100vh; overflow: hidden;" ><svg viewBox="0 0 226 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M213.19,0.00 C152.70,70.05 270.04,70.05 202.99,150.00 L500.00,150.00 L500.00,0.00 Z" style="stroke: none; fill: #fff;"></path></svg></div> -->

        <!-- <div style="height: 100vh; overflow: hidden;" ><svg viewBox="0 0 226 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M213.19,0.00 C152.70,70.05 270.04,70.05 202.99,150.00 L500.00,150.00 L500.00,0.00 Z" style="stroke: none; fill: #fff;"></path></svg></div> -->

        <!-- <div style="height: 100vh; overflow: hidden;" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M434.81,-3.45 C422.40,64.63 463.59,76.47 431.99,153.45 L500.00,150.00 L500.27,-2.47 Z" style="stroke: none; fill: #fff;"></path></svg></div> -->

        <div style="height: 100vh; overflow: hidden">
          <svg
            viewBox="0 0 465 150"
            preserveAspectRatio="none"
            style="height: 100%; width: 100%"
          >
            <path
              d="M466.98,-4.43 C373.87,82.40 500.27,70.55 425.22,153.45 L500.00,150.00 L500.27,-2.47 Z"
              style="stroke: none; fill: #fff"
            ></path>
          </svg>
        </div>
      </div>

      <div
        id="form"
        class="d-flex flex-column justify-center align-center bluex"
      >
        <!-- <v-img :src="logo" contain width="400px" class="mb-15" max-height="120px" style="filter: invert(16%) sepia(25%) saturate(1386%) hue-rotate(157deg) brightness(46%) contrast(93%)"></v-img> -->
        <h1 class="text-center primary--text">Inicio Session</h1>
        <v-form style="width: 400px" class="redx">
          <v-text-field
            label="Cuenta"
            v-model="username"
            prepend-inner-icon="mdi-shield-account"
            type="text"
            clearable
            large
            filled
          ></v-text-field>

          <v-text-field
            label="Constraseña"
            v-model="password"
            prepend-inner-icon="mdi-shield-lock"
            type="password"
            clearable
            @keypress.enter="login"
            filled
          ></v-text-field>

          <v-btn
            block
            color="primary"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="login"
            large
            >Entrar</v-btn
          >
        </v-form>
        <div style="position:absolute;bottom:15px;z-index:1">
          <span class="d-block subtitle-1 text-fomtwasene font-weight-bold">@Punto Verde de Leon</span>          
          <span class="subtitle-2 text-accent">Version 1.0.0 (01-02-2023)</span>
        </div>
       
       <!-- <div style="transform: rotate(-50deg);height: 400px; width:300px; overflow: hidden;position:absolute;top:-90px;right:-50px" class="x"><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M213.19,0.00 C152.70,70.05 285.83,70.55 202.99,150.00 L500.00,150.00 L500.00,0.00 Z" style="stroke: none; fill: #14bf98;"></path></svg></div> -->

       <!-- <div style="height: 150px; overflow: hidden;position:absolute;bottom:-10px;right:-10px" ><svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;"><path d="M-15.52,140.62 C150.00,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style="stroke: none; fill: #14bf98;"></path></svg></div> -->


      </div>
    </div>
  </v-app>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import {InicioSessionService} from '@/services/login_service'

// import logo from '@/assets/punto_verde.png'
import logo from "@/assets/logo_blanco_horizontal.png";

const root = getCurrentInstance().proxy;

const username = ref("");
const password = ref("");
const btnLoading = ref(false);

async function login() {
  btnLoading.value = true;
  try {
    // let { data } = await axios.post(
    //   "/homeController.php",
    //   qs.stringify({ accion: 4, user: username.value, pass: password.value })
    // );
    const data=await InicioSessionService(username.value,password.value)
    //esto es para que siga funcionando igual 
    root.$ls.set("logueado", true);
    // root.$ls.set("user",`${data.nombre} ${data.paterno} ${data.materno}`);
    const dat_={cve_persona:data.cve_persona,nombre:data.nombre,apellido_paterno:data.paterno,apellido_materno:data.materno}
    root.$ls.set("user",dat_);

    //esto es lo nuevo 
    root.$ls.set("alias",data.alias);
    root.$ls.set("nombre",data.nombre);
    root.$ls.set("paterno",data.paterno);
    root.$ls.set("materno",data.materno);
    root.$ls.set("perfiles",data.perfiles);
    root.$ls.set("perfil",data.perfiles?.[0]);
    root.$ls.set("token",data.token);
    window.location.replace(`${import.meta.env.BASE_URL}`);
    
    // console.log(data);
    // if (data[1]) {
    //   root.$ls.set("logueado", true);
    //   root.$ls.set("user", data[1]);
    //   root.$ls.set("menu", data[0]);
    //   // root..$router.push({ name: "home" });
    //   // window.location.replace(`${import.meta.env.BASE_URL}`);
    // } else {
    //   alert("usuario o contraseña erronea");
    // }
  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    btnLoading.value = false;
  }
}
</script>

<style>
html,
body {
  overflow-y: hidden !important;
}

#div-main {
  height: 100vh;
  width: 100vw;
}

#logo {
  width: 50%;
  height: 100vh;
  background-color: #14bf98;
  background-image: url("../../assets/fondo-login.png");
  background-position: center;
  background-size: cover;
  /* background-image: linear-gradient(0deg, #14bf98 0%, #10997a 100%); #2AF598 */
}

#form {
  width: 50%;
  height: 100vh;
  /* background-color: red; */
}
</style>