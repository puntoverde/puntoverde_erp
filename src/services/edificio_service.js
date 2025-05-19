import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getEdificiosService=async(p)=>{
    try {
        const {data,status}=await $axios.get('/edificio')
        return data;
    } catch (error) {
        throw error
    }
}

export const getEspacioFisicoByEdificioService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/edificio/${id}/espacios`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getEspacioFisicoFullService=async()=>{
    try {
        const {data,status}=await $axios.get(`/edificio/espacios`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
