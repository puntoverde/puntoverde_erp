import {$axios} from '@/util/axios_instance'


export const allPersonas=async(p)=>{
    try {
        const {data,status}=await $axios.get('/observacion-meta-deporte/personas',{params:p})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findPersonaById=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/observacion-meta-deporte/persona/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const registrarObservacion=async(p)=>{
    try {
        const {data,status}=await $axios.post('/observacion-meta-deporte',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const actualizarObservacion=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/observacion-meta-deporte/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getObservaciones=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/observacion-meta-deporte/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}
