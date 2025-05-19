import {$axios as $axios} from '@/util/axios_instance'
import dayjs from 'dayjs'


export const getReporteGeneralService=async(fecha_inicio,fecha_fin)=>{
    console.log(fecha_inicio)
    try {
        const {data,status}=await $axios.get('/reporte-general',{params:{periodo:dayjs(fecha_inicio).format('MM-YYYY')}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteGeneralDetalleService=async(fecha_inicio,cuotas,pagado)=>{
    console.log(fecha_inicio)
    try {
        const {data,status}=await $axios.get('/reporte-general/detalle',{params:{periodo:dayjs(fecha_inicio).format('MM-YYYY'),cuotas,pagado}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteGeneralAnterioresPagadosDetalleService=async(periodo,cuota)=>{

    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-anteriores',{params:{periodo:dayjs(periodo).format('MM-YYYY'),cuota}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteGeneralAnterioresDetalleService=async(periodo,cuota)=>{

    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-anteriores-faltantes',{params:{periodo:dayjs(periodo).format('MM-YYYY'),cuota}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteGeneralAccion2or3DetalleService=async(fecha_inicio,cuota,cantidad)=>{
   
    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-accion2or3',{params:{periodo:dayjs(fecha_inicio).format('MM-YYYY'),cuota,cantidad}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteGeneralMovimientoAccionDetalleService=async(fecha_inicio,movimiento,tipo)=>{
   
    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-accion-movimientos',{params:{periodo:dayjs(fecha_inicio).format('MM-YYYY'),movimiento,tipo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getDetalleAccionByEstatusService=async()=>{
    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-accion')
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getDetalleSociosActivosService=async()=>{
    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-socios-activos')
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getDetalleSociosMovimientosService=async(periodo,tipo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-general/detalle-socios-movimientos',{params:{periodo:dayjs(periodo).format('MM-YYYY'),tipo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getHistoricoAccionesService=async(periodo,tipo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-general/historico-resumen-acciones',{params:{periodo:dayjs(periodo).format('MM-YYYY'),tipo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}




