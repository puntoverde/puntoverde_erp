import {$axios_token as $axios} from '@/util/axios_instance'
import {useChangeCase} from '@vueuse/integrations/useChangeCase'


export const allPersonas=async(p)=>{
    try {
        const {data,status}=await $axios.get('/formato-m8/personas',{params:p})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findPersonaById=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/formato-m8/persona/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const registrarObservacion=async(p)=>{
    try {
       
        const form = new FormData();
        form.append("cve_usuario", p.cve_usuario);
        form.append("descripcion", p.descripcion);
        form.append("fecha_registro", p.fecha_registro);
        form.append("tipo_formato", p.tipo_formato);
        form.append("folio", p.folio);
        if(Boolean(p.archivo))
            {form.append("archivo", p.archivo);}
        const {data,status}=await $axios.post('/formato-m8',form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const actualizarObservacion=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/formato-m8/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getObservaciones=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/formato-m8/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const registrarRespuestaService=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/formato-m8/respuesta/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const saveFileRespuesta=async(id,foto,clave)=>{
    const form = new FormData();
    form.append("archivo", foto);
    form.append("clave", clave);
    try {
        const {data,status}=await $axios.post(`/formato-m8/upload-file/${id}`,form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getTiposFormatoM8Service=async()=>{
    try {
        const {data,status}=await $axios.get(`/formato-m8/tipo-formato`)
        return data.sort((a,b)=>a.tipo-b.tipo).map(i=>({id_tipo_formato_m8:i.id_tipo_formato_m8,tipo:useChangeCase(i.tipo,'sentenceCase').value}))        
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}


