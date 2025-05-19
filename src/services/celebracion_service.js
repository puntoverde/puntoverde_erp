import {$axiosRh as $axios} from '@/util/axios_instance'

export const getCelebracionesService=async()=>{
    try {
        const {data,status}=await $axios.get("celebracion")
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getCelebracionByIdService=async(id_celebracion)=>{
    try {        
        let {data,status} = await $axios.get(`/celebracion/${id_celebracion}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setCreateCelebracionService=async(data_send)=>{
    try {                
        let {data,status}=await $axios.post('celebracion',data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setUpdateCelebracionService=async(id_concepto,data_send)=>{
    console.log(data_send)
    try {                        
        let {data,status}=await $axios.put(`celebracion/${id_concepto}`,data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
