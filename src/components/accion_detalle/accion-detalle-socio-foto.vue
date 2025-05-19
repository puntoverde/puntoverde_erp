<template>
  <div class="mr-3">

    <v-menu>
      <template v-slot:activator="{ on }">
        <v-badge
          :color="parentesco == 11 ? 'primary' : 'transparent'"
          overlap
          left
          offset-x="20"
        >
          <template v-slot:badge v-if="parentesco == 11">
            <v-icon small>mdi-trophy</v-icon>
          </template>
          <v-hover v-slot="{ hover }">
            <v-avatar size="50" color="" v-on="on">
              <v-scale-transition>
                <v-img
                  class="elevation-15"
                  :src="profile2"
                  v-if="hover"
                ></v-img>

                <v-img class="elevation-15" :src="imagenFoto" v-else></v-img>
              </v-scale-transition>
            </v-avatar>
          </v-hover>
        </v-badge>
      </template>

      <v-card>
        <v-list-item-content class="justify-center py-0">
          <div class="mx-auto text-center">
            <v-divider class="my-0"></v-divider>
            <v-btn depressed rounded text @click="openFileFoto">
              <v-icon class="mr-2">mdi-image-move</v-icon>Adjuntar Foto
            </v-btn>
            <v-divider class="my-"></v-divider>
            <v-btn depressed rounded text @click="dialog_view = true">
              <v-icon class="mr-2">mdi-image-size-select-large</v-icon>Mostrar
              Foto
            </v-btn>
            <v-divider class="my-"></v-divider>
              <v-btn depressed rounded text @click="fnDeleteFoto">
                <v-icon class="mr-2">mdi-image-remove</v-icon>Eliminar
                Foto
              </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
    

    <!--dialog para la imagen que lleva el crop -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-text class="d-flex justify-center px-0">
          <cropper
            v-show="cropFoto"
            style="height: 400px"
            ref="cropper_ref"
            class="cropper"
            :src="foto"
            :stencil-size="{
              width: 300,
              height: 300,
            }"
            :stencil-props="{
              movable: false,
              resizable: false,
              aspectRatio: 1,
            }"
            @change="ChangeFoto"
          />

          <img id="img-preview" v-show="!cropFoto" style="height: 400px" />
        </v-card-text>

        <v-card-actions>
          <v-btn color="info" @click="crop" v-if="cropFoto"
            ><v-icon>mdi-face-recognition</v-icon> Recorta</v-btn
          >
          <v-btn color="error" @click="cropFoto = true" v-if="!cropFoto"
            ><v-icon>mdi-cancel</v-icon> Regresar</v-btn
          >
          <v-btn color="success" @click="saveFoto" v-if="!cropFoto">
            <v-icon>mdi-content-save</v-icon> Guardar Foto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_view" width="600" rounded="xl">
      <v-card width="100%" height="100%" rounded="xl">
        <v-img :src="imagenFoto"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import isEmpty from "lodash/isEmpty";
import profile2 from "@/assets/image/user-photo-hover.svg";
import {getFotoSocioService,addFotoSocioService,deleteFotoSocioService} from '@/services/socios_service'
import { useFileDialog } from "@vueuse/core";


const props = defineProps({
  cve_socio: {
    type: Number,
    default: 0,
  },
  parentesco: {
    type: Number,
    default: 0,
  },
  foto_socio: {
    type: String,
    default: "",
  },
});

const root = getCurrentInstance().proxy;

const { files, open, reset, onChange } = useFileDialog({ accept: "image/*" });

const dialog = ref(false);
const foto = ref("");
const imagenFoto = ref("");

const cropFoto = ref(true);

const dialog_view = ref(false);

onMounted(() => {
  getFoto();
});

async function getFoto() {
  
  if (Boolean(props.foto_socio)) {
    try {
    //   let { data, status } = await $axios.get(`socios/foto`, {
    //     responseType: "blob",
    //     params: { foto: props.foto_socio },
    //   });
    
      // imagenFoto.value=await getFotoSocioService(props.foto_socio)
      imagenFoto.value=await getFotoSocioService(props.cve_socio)
    } catch (error) {
      imagenFoto.value = new URL("@/assets/image/user-photo-error.svg",import.meta.url).href;
    }
  } else {
    imagenFoto.value = new URL("@/assets/image/user-photo-default.svg",import.meta.url).href;
  }
}

function openFileFoto() {
  cropFoto.value = true;
  open()
}

function ChangeFoto({ coordinates, canvas }) {
  console.log(coordinates, canvas);
  //document.getElementById('img-preview').src=canvas.toDataURL()
}
function crop() {
  const { coordinates, canvas } = root.$refs.cropper_ref.getResult();
  ////// this.coordinates = coordinates;
  // You able to do different manipulations at a canvas
  // but there we just get a cropped image, that can be used
  // as src for <img/> to preview result
  document.getElementById("img-preview").src = canvas.toDataURL();
  cropFoto.value = false;
}

onChange(async ([file]) => {
  const imagen_ = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  foto.value = imagen_;
  dialog.value = true;
});

// async function saveFoto() {
//   const { canvas } = root.$refs.cropper.getResult();
//   if (canvas) {
//     const form = new FormData();
//     canvas.toBlob(async (blob) => {
//       form.append("foto", blob);
//       form.append("cve_socio", props.cve_socio);
//       // You can use axios, superagent and other libraries instead here
//       let { data } = await $axios.post("socios/upload-foto", form, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       let { data: exito } = await $axios.put(
//         `socios/${props.cve_socio}/params`,
//         {
//           foto: data,
//         }
//       );
//       if (exito === 1) imagenFoto.value = canvas.toDataURL();
//       foto.value = null;
//       dialog.value = false;
//       // Perhaps you should add the setting appropriate file format here
//     }, "image/jpeg");
//   }
// }

async function saveFoto() {
  const { canvas } = root.$refs.cropper_ref.getResult();
  if (canvas) {
    
    const blob_=await new Promise((resolve,_)=>canvas.toBlob(blob=>resolve(blob),'image/jpeg'))

    const data=await addFotoSocioService(props.cve_socio,blob_)

    if(Boolean(data))
    {
      foto.value = null;
      dialog.value = false;
      imagenFoto.value = canvas.toDataURL();
    }    
  }
}


async function fnDeleteFoto()
{
  try {
  const confirm=await root.$confirm('Desea realmente eliminar la foto del socio, seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',{title:'info',width:350,persistent:true})
  if(confirm)
  {
    const data =await deleteFotoSocioService(props.cve_socio)
    console.log(data)
  }
    
  } catch (error) {
    
  }
}
</script>
