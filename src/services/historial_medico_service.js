import {$axios} from '@/util/axios_instance'


export const allPersonasService=async(p)=>{
    try {
        const {data,status}=await $axios.get('/historial-medico/personas',{params:p})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findPersonaByIdService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/historial-medico/persona/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const registrarPercanceService=async(p)=>{
    try {
        const {data,status}=await $axios.post('/historial-medico',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const actualizarPercanceService=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/historial-medico/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPercancesService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/historial-medico/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const getReporteExamenHistorial=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/historial-medico/reporte/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}