import {$axios as $axios} from '@/util/axios_instance'

export const setDocumentoService=async(documento,tipo,procesos)=>{
    try {                      
        const { data } = await $axios.post("documentos", {documento,tipo,procesos});
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateDocumentoService=async(cve_documento,documento,tipo,procesos,estatus)=>{
    try {                      
        const { data } = await $axios.put(`documentos/${cve_documento}`, {documento,tipo,procesos,estatus});
      
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteDocumentoService=async(cve_documento)=>{
    try {                              
        const  {data}=await $axios.delete(`documentos/${cve_documento}`);
      
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDocumentoByIdService=async(cve_documento)=>{
    try {                              
        const { data } = await $axios.get(`documentos/${cve_documento}`);
      
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDocumentoAllService=async()=>{
    try {                              
        const { data } = await $axios.get("documentos");
      
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}