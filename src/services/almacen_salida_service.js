import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getPedidosLibresService=async()=>{
    try {
        const {data,status}=await $axios.get(`/almacen-entrada/pedidos-libres`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getProductosAlmacenService=async(p)=>{
    try {
        const {data,status}=await $axios.get(`/almacen-entrada/productos-almacen`,{params:p})
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}

export const getProductoExistenciaByIdService=async(id_producto)=>{
    try {
        const {data,status}=await $axios.get(`/almacen-entrada/producto-existencia/${id_producto}`)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}

export const saveEntradaAlmacenPedidoService=async(id_pedido)=>{
    try {
        const {data,status}=await $axios.post(`/almacen-entrada/${id_pedido}`)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}


export const saveSalidaAlmacenPedidoService=async(id_almacen_entrada,data_send)=>{
    try {
        const {data,status}=await $axios.post(`/almacen-entrada/salida/${id_almacen_entrada}`,data_send)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}