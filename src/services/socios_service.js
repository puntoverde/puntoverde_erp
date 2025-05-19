import {$axios as $axios} from '@/util/axios_instance'

export const getSocioService=async(cve_accion)=>{
    try {       
        const { data } = await $axios.get("socios", {params: { cve_accion }});
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getSocioByIdService=async(id)=>{
    try {       
       const {data}= await $axios.get(`socios/${id}`)
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPosicionesByAccionService=async(cve_accion)=>{
    try {               
       const {data}= await $axios.get('socios/posiciones',{params:{cve_accion}})
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createSocioService=async(data_send)=>{
    try {       
       const {data}= await $axios.post('socios',data_send)
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateSocioService=async(id,data_send)=>{
    try {       
       const {data}= await $axios.put(`socios/${id}`,data_send)
       return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFotoSocioService=async(foto_url)=>{
    try {   
        
        const { data, status } = await $axios.get(`socios/foto`, {responseType: "blob",params: { foto:foto_url}});

        const image_ = await new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result)
            reader.onerror = e => reject(e)
            reader.readAsDataURL(data)
        })
    
        return image_
       
    } catch (error) {
        throw error
    }
}

export const addFotoSocioService=async(cve_socio,foto_)=>{
    try {   
        const formData = new FormData();
        formData.append("foto", foto_);
        formData.append("cve_socio",cve_socio);        

        const { data:foto } = await $axios.post("socios/upload-foto", formData, {headers: { "Content-Type": "multipart/form-data" }});
        const { data } = await $axios.put(`socios/${cve_socio}/params`,{foto});
        return data
       
    } catch (error) {
        throw error
    }
}

export const deleteFotoSocioService=async(cve_socio)=>{
    try {           
        const { data } = await $axios.delete(`socios/${cve_socio}/foto`);
        return data       
    } catch (error) {
        throw error
    }
}

export const bajaSocioService=async(cve_socio)=>{
    try {           
        const { status } = await $axios.delete(`socios/${cve_socio}`);        
        return status       
    } catch (error) {
        throw error
    }
}

export const bloqueoSocioService=async(cve_socio,bloqueo_temporal)=>{
    try {           
        const { data } = await $axios.put(`socios/${cve_socio}/params`,{bloqueo_temporal});          
        return data       
    } catch (error) {
        throw error
    }
}

export const posicionesSocioByAccionService=async(numero_accion,clasificacion,cve_accion)=>{
    try {           
        const { data } = await $axios.get(`socios/posiciones_acciones`,{params:{numero_accion,clasificacion,cve_accion}});                   
        return data       
    } catch (error) {
        throw error
    }
}

export const ConfirmarCambioPosicioAccionNuevaSocioService=async(cve_socio,cve_accion,posicion,cve_parentesco)=>{
    try {           
        const { data } = await $axios.put(`socios/${cve_socio}/params`, {cve_accion,posicion,cve_parentesco});                  
        return data       
    } catch (error) {
        throw error
    }
}

export const CambiarPosicioAccionSocioService=async(cve_socio,posicion)=>{
    try {           
        const { data } = await $axios.put(`socios/${cve_socio}/params`, {posicion});                         
        return data       
    } catch (error) {
        throw error
    }
}

export const documentosSocioService=async(cve_socio)=>{
    try {                     
        const { data } = await $axios.get(`socios/${cve_socio}/documentos`);
        return data       
    } catch (error) {
        throw error
    }
}

export const cargarDocumentoSocioService=async(cve_socio,cve_accion,cve_documento,file)=>{
    try {                         
        
        const formData = new FormData();
        formData.append("documento", file);
        const { data: documento } = await $axios.post("socios/upload-file", formData, {headers: { "Content-Type": "multipart/form-data" }});
        
        const { data } = await $axios.post(`socios/${cve_socio}/documento`, {cve_documento,documento,cve_accion});
        
        return {data,documento}       
    } catch (error) {
        throw error
    }
}

export const deleteDocumentosSocioService=async(cve_socio,cve_documento)=>{
    try {                             
        const { status } = await $axios.delete(`socios/${cve_socio}/documento`, {params: { cve_documento }});
        return status       
    } catch (error) {
        throw error
    }
}

export const saveMensajePersonalizadoSocioService=async(cve_socio,observaciones)=>{
    try {                                     
        
        const { data } = await $axios.put(`socios/${cve_socio}/params`, {observaciones});

        return data
    } catch (error) {
        throw error
    }
}

export const SocioDisponiblesCambioService=async()=>{
    try {                                     
        
        const { data } = await $axios.get("socios/cambio");

        return data
    } catch (error) {
        throw error
    }
}

export const SocioAgregarExistentesService=async(socios_disponibles,cve_accion)=>{
    try {                                     
    
        const { data } = await $axios.put(`socios/${socios_disponibles}/params`,{cve_accion});

        return data
    } catch (error) {
        throw error
    }
}

export const showObservacionesSocioService=async(cve_persona)=>{
    try {                                     
    
        
        const { data } = await $axios.get(`observaciones-usuarios/${cve_persona}`);

        return data
    } catch (error) {
        throw error
    }
}

export const saveReporteHistoricoSocioService=async(numero_accion,clasificacion,cve_socio)=>{
    try {                                     
    
        
        const {data}=await $axios.post('reporte-historico-socios',{numero_accion,clasificacion,cve_socio}) 

        return data
    } catch (error) {
        throw error
    }
}


export const getSociosByAccionNumeroClasificacionService=async(numero_accion,clasificacion)=>{
    try {                                     
    
        
        const {data}=await $axios.get('socios/by-accion',{params:{numero_accion,clasificacion}}) 

        return data
    } catch (error) {
        throw error
    }
}