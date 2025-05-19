import {$axiosFinanzas as $axios ,$axios as $axiosLegal} from '@/util/axios_instance'

export const getDescuentoByCargosService=async(numero_accion,clasificacion)=>{
    try {       
        let { data,status } = await $axios.get("descuentos/cargos", {params:{numero_accion,clasificacion}});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const setAplicarDescuentoService=async(cargos,total_descuento,responsable)=>{
    try {               
        let {data,status}=await $axios.post("descuentos",{cargos,total_descuento,responsable,descripcion:'na'})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getCuotasObligatoriasService=async()=>{
    try {                       
        let {data,status}=await $axios.get("/descuentos/cuotas-obligatorias")
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFindDuenoAplicaService=async(cve_accion,membresias)=>{
    try {                              
        let {data,status}=await $axios.get("descuentos/dueno-aplica",{params:{cve_accion, membresias}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFindSocioAplicaService=async(cve_accion,parentesco,edad)=>{
    try {                              

        let {data,status}=await $axios.get("descuentos/socio-aplica",{params:{cve_accion,parentesco,edad}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setCreateDescuentoProgramadoService=async(cve_accion,cve_persona,cve_cuota,monto,periodos)=>{
    try {                              

        let {data,status}=await $axios.post("descuentos/programados",{cve_accion,cve_persona,cve_cuota,cve_persona_aplica: 0,monto,periodos});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const eliminarDescuentoService=async(id_descuento,responsable_cancela,motivo_cancelacion)=>{
    try {                              

        const { data, status } = await $axios.delete(`/descuento/${id_descuento}`, {params: { responsable_cancela, motivo_cancelacion }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getDescuentoByAccionService=async(numero_accion,clasificacion)=>{
    try {                              
        const { data, status } = await $axios.get("/descuento", {params: { numero_accion, clasificacion },
          });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getReporteDescuentoCanceladoService=async(params)=>{
    try {                                      
        const {data, status}=await $axiosLegal.get("/descuento/reporte",{params})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
