import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getPagosHaCancelarService=async(numero_accion,clasificacion,folio,dia)=>{
    try {        
        let {data,status}=await $axios.get("/cancelar-pago",{params:{numero_accion,clasificacion,folio,dia}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setCancelarPagosService=async(idpago,accion_text,cve_persona,motivo)=>{
    try {        
       
        let {data}= await $axios.post("/cancelar-pago",{idpago,accion_text,cve_persona,motivo});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}



