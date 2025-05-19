import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getReinscripcionesService=async (cuota,fecha_inicio,fecha_fin)=>{
    
    try {
        const {data,status}=await $axios.get('reporte-inscripcion',{params:{cuota,fecha_inicio,fecha_fin}})
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getCuotasReinscripcionServices=async()=>{
    try {
        let {data,status}=await $axios.get('reporte-inscripcion/cuotas')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}