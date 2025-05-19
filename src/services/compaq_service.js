import {$axiosCompaq as $axios} from '@/util/axios_instance'

export const getProductoByClaveCompaqService=async(clave)=>{
    try {                
        let {data,status}=await $axios.get(`/productos/${clave}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAllProductoCompaqService=async()=>{
    try {                
        let {data,status}=await $axios.get(`/productos`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}