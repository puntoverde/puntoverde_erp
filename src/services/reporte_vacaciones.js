import {$axiosRh as $axios} from '@/util/axios_instance'

export const getReporteVacacionesService=async (nombre,nomina,area)=>{
    
    try {
        const {data,status}=await $axios.get('reporte-vacaciones',{params:{nombre,nomina,area}})
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getReporteVacacionesByAnioServices=async(id_colaborador)=>{
    try {
        let {data,status}=await $axios.get('reporte-vacaciones/by-anio',{params:{id_colaborador}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getReporteVacacionesByAnioDetalleServices=async(id_colaborador,anio)=>{
    try {
        let {data,status}=await $axios.get('reporte-vacaciones/by-anio-detalle',{params:{id_colaborador,anio}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getReporteVacacionesAreaServices=async()=>{
    try {
        let {data,status}=await $axios.get('reporte-vacaciones/area')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}