// import {$axiosOrigin as $axios} from '@/util/axios_instance'
import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const getCajeroPagosDetalleService=async()=>{
    try {
        const {data}=await $axios.get("/reporte-pago-detalle/cajera")        
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getPagosDetalleService=async(options)=>{
    try {
        const {data}=await $axios.get("/reporte-pago-detalle", {params:options})        
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getExportarPagosDetalleFacturaService=async(fecha_inicio,fecha_fin)=>{
    try {
        const {data}=await $axios.get("/reporte-pago-detalle",{params:{fecha_inicio,fecha_fin}})   
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}