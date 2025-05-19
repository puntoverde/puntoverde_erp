import {$axiosRh as $axios} from '@/util/axios_instance'




export const getAsistenciaColaboradorService=async(id_colaborador,fechas)=>{
    try {                        
        const { data, status } = await $axios.get(`colaboradores-accesos/${id_colaborador}`,{params: { fecha: fechas }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradoresByAreaService=async(id_persona_session)=>{
    try {                        
        const { data } = await $axios.get(`incidencias/colaboradores-area/${id_persona_session}`)
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAllColaboradoresByAreaService=async(id_persona_session)=>{
    try {                        
        const { data } = await $axios.get(`incidencias/all-colaboradores-area/${id_persona_session}`)
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getTipoIncidenciaService=async()=>{
    try {                        
        const { data } = await $axios.get(`incidencias/tipo-incidencia`)
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createIncidenciaService=async(data_send)=>{
    try {                        
        const { data } = await $axios.post(`incidencias`,data_send)
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateIncidenciaService=async(data_send)=>{
    try {                        
        const { data } = await $axios.post(`incidencias/modifica`,data_send)
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const reporteIncidenciasConcentradoService=async (filtros)=>{
  
    try {                        
        const { data } = await $axios.get(`reporte-incidencias`,{params:filtros})
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}


export const reporteIncidenciasConcentradoDepartamentosService=async ()=>{    
    try {                        
        const { data } = await $axios.get(`reporte-incidencias/departamentos`)
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}