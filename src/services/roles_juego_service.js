import { $axiosDeportes as $axios} from '@/util/axios_instance'

export const getTorneosService=async()=>{
    try {              
        const { data ,status} = await $axios.get("roles-juego/torneos");
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getEquiposByTorneosService=async(id_torneo_futbol)=>{
    try {              
        const { data ,status} = await $axios.get("roles-juego/equipos-by-torneo",{params:{id_torneo_futbol}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getFixtureService=async(torneo)=>{
    try {              
        const { data ,status} = await $axios.get("roles-juego/fixture",{params:{torneo}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}



export const setCreateFixtureService=async(data_send)=>{
    try {            
        const { data ,status} = await $axios.post("roles-juego/registrar-fixture",data_send);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const addFechaService=async(partido,fecha)=>{
    try {            
        const { data ,status} = await $axios.put("roles-juego/asignar-fecha",{partido,fecha});
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



export const setUpdateInscripcionService=async(id_inscripcion_curso,data_send)=>{
    try {            
        const { data ,status} = await $axios.put(`curso-verano/inscripcion/${id_inscripcion_curso}`,data_send);
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

export const getInscripcionesCursosVeranoService=async()=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano");
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFotoSocioService=async(cve_persona)=>{
    try {   
        
        const { data, status } = await $axios.get(`curso-verano/foto`, {responseType: "blob",params: { cve_persona}});
        const image_file=new File([data], "fileName.png", { type: data.type })
        const image_view = await new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result)
            reader.onerror = e => reject(e)
            reader.readAsDataURL(data)
        })
    
        return {image_file,image_view}
       
    } catch (error) {
        throw error
    }
}


export const getSemanasRestantesService=async(cve_curso_inscripcion)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/semanas-restantes",{params:{cve_curso_inscripcion}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradorByNominaService=async(nomina)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/colaborador",{params:{nomina}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const bajaInscripcionCursoService=async(cve_curso_inscripcion)=>{
    try {              
        const { data ,status} = await $axios.delete("curso-verano/baja",{params:{cve_curso_inscripcion}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDataReporteCursoService=async(cve_curso_inscripcion)=>{
    try {              
        const { data ,status} = await $axios.get("curso-verano/reporte",{params:{cve_curso_inscripcion}});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getDatosInscripcionService=async(cve_curso_inscripcion)=>{
    try {              
        const { data ,status} = await $axios.get(`curso-verano/inscripcion/${cve_curso_inscripcion}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const setReingresoCursoService=async(id,data_send)=>{
    try {            
        const { data ,status} = await $axios.put(`curso-verano/reingreso/${id}`,data_send);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}