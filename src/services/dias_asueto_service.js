import {$axiosRh as $axios} from '@/util/axios_instance'

export const getDiasAsuetoService=async(annio)=>{
    try {       
        let { data,status } = await $axios.get(`/dias-asueto`,{params:{annio}});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createDiasAsuetoService=async(dias)=>{
    try {       
        let { data,status } = await $axios.post(`/dias-asueto`,dias);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteDiaAsuetoService=async(id)=>{
    try {       
        let { data,status } = await $axios.delete(`/dias-asueto/${id}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


