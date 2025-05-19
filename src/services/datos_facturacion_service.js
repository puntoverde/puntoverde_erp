import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getSociosService=async(numero_accion, clasificacion)=>{
    try {       
        const { data, status } = await $axios.get("datos-facturacion/socios", {params: { numero_accion, clasificacion }});
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDatosFacturacionService=async(cve_persona)=>{
    try {       
        const { data, status } = await $axios.get(`datos-facturacion/${cve_persona}`);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const saveDatosFacturacionService=async(cve_persona,data_valid)=>{
    try {       
        const { data, status } = await $axios.post(`datos-facturacion/${cve_persona}`,data_valid);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateDatosFacturacionService=async(id_datos_facturacion,data_valid)=>{
    try {       
        const { data, status } = await $axios.put(`datos-facturacion/${id_datos_facturacion}`,data_valid);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getRegimenfiscalService=async()=>{
    try {       
        const { data, status } = await $axios.get(`datos-facturacion/regimen-fiscales`);
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFotoService=async(foto)=>{
    try {       
        //aqui se queda en duda si la peticion es para $axios finanza o $axios legal
        const { data, status } = await $axios.get(`socios/foto`, {responseType: "blob",params: { foto }});
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


