import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getPagosFacturarService=async(numero_accion,clasificacion,fecha_inicio,fecha_fin)=>{
    try {       
       const { data, status } = await $axios.get("pago", { params: {numero_accion,clasificacion,fecha_inicio,fecha_fin} });
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getCargosByPagosFacturarService=async(id_pago)=>{
    try {               
        const {data,status} = await $axios.get(`pago/${id_pago}/cargos`);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFacturaService=async(id_pago)=>{
    try {               
        const {data,status} = await $axios.get(`pago/${id_pago}/factura`);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createFacturaPublicoGeneralService=async(data_send)=>{
    try {               
        const { data, status } = await $axios.post(`facturacion-v4/publico-general`,data_send);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getNameSociosByAccionUseRazonSocialService=async(id_accion)=>{
    try {               
        //son los nombres de los usuarios de la accion que pueden servir como razon social para publico en general
        //se recuerda que en la version 4.0 se usa cuqluier palabra excepto publico en general
        const { data, status } = await $axios.get(`facturacion-v4/socios-pg/${id_accion}`);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getReporteFacturaCanceladaService=async(fecha_inicio,fecha_fin)=>{
    try {               
        //son los nombres de los usuarios de la accion que pueden servir como razon social para publico en general
        //se recuerda que en la version 4.0 se usa cuqluier palabra excepto publico en general
       const {data, status}=await $axios.get("/reporte-factura-cancelada/reporteFacturaCancelada",{params:{fecha_inicio,fecha_fin}})
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
