import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const getDataXmlService=async(p)=>{
    try {
        const { data, status } = await $axios.get("sat-xml", { params: p });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDataXmlComplementoService=async(p)=>{
    try {
        
        const { data, status } = await $axios.get("sat-xml/complementos", {params: p});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getConceptosXmlService=async(uuid)=>{
    try {
        
        const { data, status } = await $axios.get(`sat-xml/conceptos/${uuid}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getConceptosComplementoXmlService=async(uuid)=>{
    try {
        
        const { data, status } = await $axios.get(`sat-xml/conceptos/${uuid}/complementos`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getEmitidoConceptosXmlService=async(uuid)=>{
    try {
        
        const { data, status } = await $axios.get(`sat-xml/emitido/conceptos/${uuid}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDatosNominaExtraXMLService=async(uuid)=>{
    try {
        
        const { data, status } = await $axios.get(`sat-xml/nomina/extras/${uuid}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
export const getDataNominaXMLService=async(p)=>{
    try {
        
        const { data, status } = await $axios.get("sat-xml/nomina", { params: p });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDataEmitidosXmlService=async(p)=>{
    try {
        
        const { data, status } = await $axios.get("sat-xml/emitido", { params: p });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const upFacturaRecibidaXmlService=async(formData)=>{
    try {
        
        const { data, status } = await $axios.post("sat-xml", formData, {headers: { "Content-Type": "multipart/form-data" }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const upFacturaRecibidaComplementariaXmlService=async(formData)=>{
    try {
        
        const { data, status } = await $axios.post("sat-xml", formData, {headers: { "Content-Type": "multipart/form-data" }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const upFacturaNominaXmlService=async(formData)=>{
    try {
        
        const { data, status } = await $axios.post("sat-xml/nomina", formData, {headers: { "Content-Type": "multipart/form-data" },});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
export const upFacturaEmitidaXmlService=async(formData)=>{
    try {
        
        const { data, status } = await $axios.post("sat-xml/emitido", formData, {headers: { "Content-Type": "multipart/form-data" },});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const downloadExcelNominaXmlService=async(p)=>{
    try {
        
        const { data, status } = await $axios.request({url: "sat-xml/nomina/excel",responseType: "arraybuffer",method: "get",params: p,headers: { "Content-Type": "blob" },});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const downloadExcelFacturaXmlService=async(p)=>{
    try {
        
        const { data, status } = await $axios.request({
            url: "sat-xml/excel",
            responseType: "arraybuffer",
            method: "get",
            params: p,
            headers: { "Content-Type": "blob" },
          });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const downloadExcelFacturaComplementoXmlService=async(p)=>{
    try {
        
        const { data, status } = await $axios.request({
            url: "sat-xml/complementos/excel",
            responseType: "arraybuffer",
            method: "get",
            params: p,
            headers: { "Content-Type": "blob" },
          });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const downloadExcelFacturaEmitidaXmlService=async(p)=>{
    try {
        
        const { data, status } = await $axios.request({
            url: "sat-xml/emitido/excel",
            responseType: "arraybuffer",
            method: "get",
            params: p,
            headers: { "Content-Type": "blob" },
          });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const ElimnarFacturaXmlService=async(file_name)=>{
    try {
        
        const { data, status } = await $axios.put(`sat-xml/recibida/${file_name}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const ElimnarFacturaComplementoXmlService=async(file_name)=>{
    try {
        
        const { data, status } = await $axios.put(`sat-xml/complemento/${file_name}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const ElimnarFacturaNominaXmlService=async(file_name)=>{
    try {
        
        const { data, status } = await $axios.put(`sat-xml/nomina/${file_name}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const ElimnarFacturaEmitidaXmlService=async(file_name)=>{
    try {
        
        const { data, status } = await $axios.put(`sat-xml/emitido/${file_name}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}