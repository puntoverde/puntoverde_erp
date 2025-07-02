import { $axiosDeportes as $axios} from '@/util/axios_instance'

export const getCargosByFolioService=async(folio)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/cargo-by-folio",{params:{folio}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPersonaExisteService=async(cve_persona)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/persona-exist",{params:{cve_persona}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getProgramaCursoVeranoService=async(curso)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/programa",{params:{curso}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getGrupoCursoVeranoService=async(programa)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/programa-grupo",{params:{programa}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setCreateInscripcionService=async(data_send)=>{
    try {            
        const formData = new FormData();
        for (const [key, value] of Object.entries(data_send)) {formData.append(key,value)}

        const { data ,status} = await $axios.post("curso-verano/inscripcion",formData,{headers: { "Content-Type": "multipart/form-data" }});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getSociosInAccionService=async(cve_accion)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/socios-in-accion",{params:{cve_accion}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}