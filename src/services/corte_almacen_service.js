import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const getCorteAlmacenService=async(p)=>{
    try {
        const {data,status}=await $axios.get('/almacen/corte')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createCorteAlmacenService=async(p)=>{
    try {
        const {data,status}=await $axios.post('/almacen/corte',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getCorteAlmacenDetalleService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/almacen/corte-detalle/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

