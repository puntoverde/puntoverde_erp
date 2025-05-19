import {$axios as $axios} from '@/util/axios_instance'

export const getAutosUsuarioService=async()=>{
    try {
        const {data,status}=await $axios.get(`/auto-usuario`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setBajaAutoUsuarioService=async(id)=>{
    try {
        const {data,status}=await $axios.put(`/auto-usuario/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const setColorAutoUsuarioService=async(id,color)=>{
    try {
        const {data,status}=await $axios.put(`/auto-usuario/${id}/color`,{color})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const setPlacasAutoUsuarioService=async(id,placa)=>{
    try {
        const {data,status}=await $axios.put(`/auto-usuario/${id}/placas`,{placa})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

