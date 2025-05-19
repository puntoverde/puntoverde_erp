import {$axiosFinanzas as $axios ,$axiosOrigin as $axios_core} from '@/util/axios_instance'

export const getCargosByAccionService=async(numero_accion, clasificacion)=>{
    try {
        // const {data,status}=await $axios.get(`/almacen-entrada/pedidos-libres`)
        const {data, status}=await $axios.get("/cargo",{params:{numero_accion, clasificacion}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getBorrarCargoService=async(id, responsable_cancela,motivo_cancelacion,activa_accion)=>{
    try {
        // const {data,status}=await $axios.get(`/almacen-entrada/pedidos-libres`)
        const {data, status}=await $axios.delete(`/cargo/${id}`,{params:{responsable_cancela, motivo_cancelacion,activa_accion}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getCargosReporteService=async(params)=>{
    try {
        const {data, status}=await $axios.get(`/cargo/reporte`,{params})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getEstatusAccionByCargoService=async(id)=>{
    try {
        // const {data,status}=await $axios.get(`/almacen-entrada/pedidos-libres`)
        const {data, status}=await $axios.get(`/cargo/${id}/estatus`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getReporteCargoPagoService=async(params)=>{
    try {      
        const {data}=await $axios_core.get("/reportePagoConceptoController.php", { params: { accion: 4,...params}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getReporteCargoPagoConceptosService=async()=>{
    try {      
        const {data}=await $axios_core.get("/reportePagoConceptoController.php", { params: { accion: 3}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


