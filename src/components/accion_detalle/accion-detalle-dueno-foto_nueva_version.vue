<template>
  <div>
    <v-dialog width="500">
      <template v-slot:activator="{ on }">
        <v-badge bordered :color="parentesco === 11 ? 'accent' : 'transparent'" overlap left>
          <template v-slot:badge v-if="parentesco === 11">
            <v-icon color="white">mdi-trophy</v-icon>
          </template>
          <v-avatar size="100" v-on="on" class="mr-3">
            <v-scale-transition>
              <v-img class="elevation-15" :src="profile2" v-if="hover"></v-img>

              <v-img class="elevation-15" :src="imagenFoto" v-else></v-img>
              <v-img :src="imagenFoto"></v-img>
            </v-scale-transition>
          </v-avatar>
        </v-badge>
      </template>

      <v-card>
        <v-window v-model="window_">
          <v-window-item>
            <v-img :src="imagenFoto" style="background-size: contain"></v-img>
            <v-divider class="my-5"></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="openFileFoto">Agregar Foto</v-btn>
              <v-btn color="secondary">Eliminar Foto</v-btn>
            </v-card-actions>
          </v-window-item>
          <v-window-item>
            <v-card-text class="d-flex justify-center px-0">
              <cropper v-show="cropFoto" style="height: 400px" ref="cropper_ref" class="cropper" :src="foto"
                :stencil-size="{
                  width: 300,
                  height: 300,
                }" :stencil-props="{
                  movable: false,
                  resizable: false,
                  aspectRatio: 1,
                }" @change="ChangeFoto" />

              <img id="img-preview" v-show="!cropFoto" style="height: 400px" />
            </v-card-text>

            <v-card-actions>
              <v-btn color="info" @click="crop" v-if="cropFoto"><v-icon>mdi-face-recognition</v-icon> Recorta</v-btn>
              <v-btn color="error" @click="cropFoto = true" v-if="!cropFoto"><v-icon>mdi-cancel</v-icon>
                Regresar</v-btn>
              <v-btn color="success" @click="saveFoto" v-if="!cropFoto">
                <v-icon>mdi-content-save</v-icon> Guardar Foto
              </v-btn>
            </v-card-actions>
          </v-window-item>
        </v-window>
      </v-card>
    </v-dialog>

    <!--dialog para la imagen que lleva el crop -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-text class="d-flex justify-center px-0">
          <cropper v-show="cropFoto" style="height: 400px" ref="cropper_ref" class="cropper" :src="foto" :stencil-size="{
            width: 300,
            height: 300,
          }" :stencil-props="{
              movable: false,
              resizable: false,
              aspectRatio: 1,
            }" @change="ChangeFoto" />

          <img id="img-preview" v-show="!cropFoto" style="height: 400px" />
        </v-card-text>

        <v-card-actions>
          <v-btn color="info" @click="crop" v-if="cropFoto"><v-icon>mdi-face-recognition</v-icon> Recorta</v-btn>
          <v-btn color="error" @click="cropFoto = true" v-if="!cropFoto"><v-icon>mdi-cancel</v-icon> Regresar</v-btn>
          <v-btn color="success" @click="saveFoto" v-if="!cropFoto">
            <v-icon>mdi-content-save</v-icon> Guardar Foto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_view" width="600" rounded="xl">
      <v-card width="100%" height="100%" rounded="xl">
        <v-img :src="imagenFoto" style="background-size: contain"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, getCurrentInstance, computed } from "vue";
import {
  addFotoAccionistaService,
  deleteFotoAccionistaService,
  getFotoAccionistaService,
} from "@/services/accionistas_service";
import { useFileDialog } from "@vueuse/core";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import profile2 from "@/assets/image/user-photo-hover.svg";

const props = defineProps({
  cve_dueno: {
    type: Number,
    default: 0
  },
  parentesco: {
    type: Number
  },
  foto_socio: {
    type: String
  }
});

const { files, open, reset, onChange } = useFileDialog({ accept: "image/*" });

const root = getCurrentInstance().proxy;

const window_ = ref(0);

const dialog = ref(false);
const foto = ref("");
const imagenFoto = ref("");

const cropFoto = ref(true);

const dialog_view = ref(false);

watch(
  () => props.foto_socio,
  () => getFoto()
);

async function getFoto() {
  if (Boolean(props.foto_socio)) {
    try {
      // let { data, status } = await $axios.get(`accionistas/foto`, {responseType: "blob",params: { foto: props.foto_socio },});
      const data = await getFotoAccionistaService(props.foto_socio);
      imagenFoto.value = data;
    } catch (error) {
      imagenFoto.value = new URL(
        "@/assets/image/user-photo-error.svg",
        import.meta.url
      ).href;
    }
  } else {
    imagenFoto.value = new URL(
      "@/assets/image/user-photo-default.svg",
      import.meta.url
    ).href;
  }
}

function openFileFoto() {
  cropFoto.value = true;
  open();
}

function ChangeFoto({ coordinates, canvas }) {
  console.log(coordinates, canvas);
  //document.getElementById('img-preview').src=canvas.toDataURL()
}

function crop() {
  const { coordinates, canvas } = root.$refs.cropper_ref.getResult();

  imagenFoto.value = canvas.toDataURL();
  window_.value = 0
}

onChange(async ([file]) => {
  const imagen_ = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  foto.value = imagen_;
  // dialog.value = true;
  window_.value = 1
});

async function saveFoto() {
  const { canvas } = root.$refs.cropper_ref.getResult();
  if (canvas) {
    const blob_ = await new Promise((resolve, _) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    );

    const data = await addFotoAccionistaService(props.cve_dueno, blob_);

    if (Boolean(data)) {
      foto.value = null;
      dialog.value = false;
      imagenFoto.value = canvas.toDataURL();
    }
  }
}

async function fnDeleteFoto() {
  try {
    const confirm = await root.$confirm(
      'Desea realmente eliminar la foto del dueño, seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      const data = await deleteFotoAccionistaService(props.cve_dueno);
      console.log(data);
    }
  } catch (error) { }
}
</script>
