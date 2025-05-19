<template>
<div class="d-flex flex-column justify-center align-center blue-greyx rounded-xl secondary--text" style="height: 100%;">
<h1>Tu sesión ha finalizado</h1>
<h2>será redireccionado vuelva a iniciar</h2>
</div>
</template>

<script setup>
import {onMounted} from 'vue'

onMounted(async ()=>{
    console.log('mounted')
    await new Promise(resolve=>setTimeout(resolve,5000))
    console.log('mounted await ')
    window.location.replace(`${import.meta.env.BASE_URL}login.html`);
})
</script>