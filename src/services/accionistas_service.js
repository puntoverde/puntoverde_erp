import {$axios as $axios} from '@/util/axios_instance'

export const setAccionistaService=async(data_send)=>{
    try {       
        const  {data,status}=await $axios.post("accionistas",data_send);
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateAccionistaService=async(cve_dueno,data_send)=>{
    try {       
        const {data}= await $axios.put(`accionistas/${cve_dueno}`,data_send)
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAccionistaAllService=async()=>{
    try {       
        const {data}= await $axios.get(`accionistas`);
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
export const getAccionistaByIdService=async(cve_dueno)=>{
    try {       
        const {data}= await $axios.get(`accionistas/${cve_dueno}`);
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const cambioAccionistaAccionService=async(cve_dueno,cve_accion)=>{
    try {       
        const {data}= await  $axios.put(`accionista/cambio`,{cve_dueno,cve_accion});
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getFotoAccionistaService=async(foto_url)=>{
    try {   
        
        console.log("🚀 ~ file: accion-detalle-dueno-foto.vue:146 ~ fotoURL:",foto_url);
        const { data, status } = await $axios.get(`accionistas/foto`, {responseType: "blob",params: { foto:foto_url}});

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

export const addFotoAccionistaService=async(cve_dueno,foto_)=>{
    try {   
        const formData = new FormData();
        formData.append("foto", foto_);
        formData.append("cve_dueno",cve_dueno);        

        const { data:foto } = await $axios.post("accionistas/upload-foto", formData, {headers: { "Content-Type": "multipart/form-data" }});
        const { data } = await $axios.put(`accionistas/${cve_dueno}/foto`,{foto});
        return data
       
    } catch (error) {
        throw error
    }
}


export const deleteFotoAccionistaService=async(cve_dueno)=>{
    try {           
        const { data } = await $axios.delete(`accionistas/${cve_dueno}/foto`);
        // return data       
    } catch (error) {
        throw error
    }
}

export const documentosAccionistaService=async(cve_dueno,cve_accion)=>{
    try {           
        const { data } = await $axios.get(`accionistas/${cve_dueno}/documentos`,{params:{cve_accion}});
        return data       
    } catch (error) {
        throw error
    }
}

export const crearDocumentoAccionistaService=async(cve_dueno,cve_accion,cve_documento,file)=>{
    try {           
        const formData = new FormData();
        formData.append("documento",file)
        const { data:documento } = await $axios.post(`accionistas/upload-file`,formData,{headers:{"Content-Type": "multipart/form-data"}});

        const { data } = await $axios.post(`accionistas/${cve_dueno}/documento`,{cve_documento,documento,cve_accion});

        return data       
    } catch (error) {
        throw error
    }
}

export const deleteDocumentoAccionistaService=async(cve_dueno,cve_documento)=>{
    try {           
        
        const { data } = await $axios.delete(`accionistas/${cve_dueno}/documento`,{params:{cve_documento}});

        return data       
    } catch (error) {
        throw error
    }
}

export const createHistoricoAccionistaService=async(data_send)=>{
    try {           
        
        // const { data } = await $axios.delete(`accionistas/${cve_dueno}/documento`,{params:{cve_documento}});
        const  { data } = await $axios.delete("accionistas/historico", data_send);

        return data       
    } catch (error) {
        throw error
    }
}

export const getLibroAccionistaService=async()=>{
    try {           
        
        // const { data } = await $axios.delete(`accionistas/${cve_dueno}/documento`,{params:{cve_documento}});
        const  { data } = await $axios.get("accionistas/libro-accionista");

        return data       
    } catch (error) {
        throw error
    }
}

export const getLibroAccionistaHistoricoService=async(id_accion)=>{
    try {           
        
        // const { data } = await $axios.delete(`accionistas/${cve_dueno}/documento`,{params:{cve_documento}});
        const  { data } = await $axios.get(`accionistas/libro-accionista/${id_accion}`);

        return data       
    } catch (error) {
        throw error
    }
}