import {$axios as $axios, $axiosOrigin as $axios_core} from '@/util/axios_instance'

export const getTipoAccionService=async()=>{
    try {              
        const { data ,status} = await $axios.get("tipo-accion");
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAccionByIdService=async(id)=>{
    try {              
        const { data,status } = await $axios.get(`acciones/${id}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findAccionByParameterService=async(numero_accion,clasificacion,tipo_accion, estatus)=>{
    try {              
        const { data ,status} = await $axios.get("acciones", {params: {numero_accion,clasificacion,tipo_accion, estatus}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const cambioEstatusAccionService=async(cve_accion,estatus,motivo,persona_motivo)=>{
    try {              
        const { data, status } = await $axios.put(`acciones/${cve_accion}`, {estatus,motivo,persona_motivo});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const cambioTipoAccionService=async(cve_accion,cve_tipo_accion)=>{
    try {              
        const { data, status } = await $axios.put(`acciones/${cve_accion}`, {cve_tipo_accion});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const addConceptoActivacionService=async(cve_accion)=>{
    try {              
        const { data, status } = await $axios.post(`acciones/${cve_accion}/add-activacion`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAccionesExportarService=async()=>{
    try {              
        const {data}=await $axios_core.get("/accionController.php", { params: { accion: 13 } })
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


