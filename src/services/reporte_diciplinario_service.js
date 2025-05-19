import { $axiosOrigin as $axios } from '@/util/axios_instance'


export const getDatosDiciplinaServices = async (fechaI,fechaF) => {
    try {

        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        
        const { data, status } = await $axios.post("/reporteDisciplinarioController.php",params)
    
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}