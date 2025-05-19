import {$axiosRh as $axios} from '@/util/axios_instance'

export const getColaboradorByNominaService=async(nomina)=>{
    try {                
        const { data, status } = await $axios.get(`colaboradores-accesos/colaborador/${nomina}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradoresByNameService=async(name_or_nomina)=>{
    try {                        
        const { data, status } = await $axios.get("colaboradores/find", {params: { name_or_nomina }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getAsistenciaColaboradorService=async(id_colaborador,fechas,cve_persona)=>{
    try {                        
        const { data, status } = await $axios.get(`colaboradores-accesos/${id_colaborador}`,{params: { fecha: fechas,cve_persona }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setUpdateTxtService=async(form)=>{
    try {                        
        const { data } = await $axios.post("colaboradores-accesos/upload-txt", form, {headers: { "Content-Type": "multipart/form-data" }})
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getAsistenciaColaboradorByDiaService=async(fecha)=>{
    try {                        
        const { data, status } = await $axios.get(`reporte-incidencias/by-dia`,{params: { fecha: fecha}});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAsistenciaColaboradorByDiaAutoService=async(fecha,id_colaborador)=>{
    try {                        
        const { data, status } = await $axios.get(`reporte-incidencias/by-dia-auto`,{params: { fecha: fecha,id_colaborador}});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAsistenciaRevisionColaboradorService=async(id_colaborador,fechas,cve_persona)=>{
    try {                        
        const { data, status } = await $axios.get(`colaboradores-accesos/revision/${id_colaborador}`,{params: { fecha: fechas,cve_persona }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createAsistenciaRevisionColaboradorService=async(data_send)=>{
    try {                        
        const { data, status } = await $axios.post(`colaboradores-accesos/revision`,data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateAsistenciaRevisionColaboradorService=async(id_acceso_nuevo,data_send)=>{
    try {                        
        const { data, status } = await $axios.put(`colaboradores-accesos/revision/${id_acceso_nuevo}`,data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAsistenciaFullColaboradoresService=async(fechas)=>
{
    try {                        
        const { data, status } = await $axios.get(`colaboradores-accesos/full`,{params: { fecha: fechas}});
        return data;
    } catch (error) {
        console.log(error)
        throw Error("Error")
    }
}