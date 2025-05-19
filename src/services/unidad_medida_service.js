import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const allUnidadMedidaService=async()=>{
    try {
        const {data,status}=await $axios.get('/unidad-medida-producto')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}