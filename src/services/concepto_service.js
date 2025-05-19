import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getConceptosService=async()=>{
    try {
        const {data,status}=await $axios.get("cuotas")
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getConceptoByIdService=async(id_concepto)=>{
    try {        
        let {data,status} = await $axios.get(`/cuotas/${id_concepto}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setCreateConceptoService=async(data_send)=>{
    try {                
        let {data,status}=await $axios.post('cuotas',data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setUpdateConceptoService=async(id_concepto,data_send)=>{
    try {                        
        let {data,status}=await $axios.put(`cuotas/${id_concepto}`,data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
