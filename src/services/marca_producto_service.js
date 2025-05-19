import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const allMarcaProductoService=async()=>{
    try {
        const {data,status}=await $axios.get('/marca-producto')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const allMarcaProductoByNameService=async(nombre)=>{
    try {
        const {data,status}=await $axios.get('/marca-producto/find-name',{params:{nombre}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}



