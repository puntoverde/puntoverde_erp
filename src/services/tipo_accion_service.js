import {$axios as $axios} from '@/util/axios_instance'

export const getMembresiasService=async()=>{
    try {                
        let { data, status } = await $axios.get("/tipo-accion");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}