import {$axiosRh as $axios} from '@/util/axios_instance'


//esto esta en el back de rh ????? algun momento se movera 
export const getColoniasByCpService=async(cp)=>{
    try {        
        let { data } = await $axios.get("domicilios", {params: { cp }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getNacionalidadesService=async()=>{
    try {        
        let { data } = await $axios.get("domicilios/nacionalidades");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

