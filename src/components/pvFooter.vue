<template>
    <v-footer color="#f1f3f4" app inset class="d-flex justify-center">
      <span class="black--text">
        Punto Verde &copy; {{dayjs().year()}} - versión 1.8.6 (01-ene-2023)
      </span>
       
    </v-footer>
</template>
<script setup>
import dayjs from 'dayjs'
</script>