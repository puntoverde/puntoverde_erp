import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const getEntradaReporteService=async(filters)=>{
    try {
        const {data,status}=await $axios.get('/reporte-almacen/entrada',{params:filters})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getRequisicionReporteService=async(filters)=>{
    try {
        const {data,status}=await $axios.get(`/reporte-almacen/requisicion`,{params:filters})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}


export const getPedidoReporteService=async(filters)=>{
    try {
        const {data,status}=await $axios.get(`/reporte-almacen/pedido`,{params:filters})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen salida")
    }
}


export const getSalidaAlmacenReporteService=async(filters)=>{
    try {
        const {data,status}=await $axios.get(`/reporte-almacen/salida`,{params:filters})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen salida")
    }
}


