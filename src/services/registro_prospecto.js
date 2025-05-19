import {$axios} from '@/util/axios_instance'

export const findAccion=async(numero_accion,clasificacion)=>{
    try {
        const {data,status}=await $axios.get('/prospecto/accion',{params:{numero_accion,clasificacion}})
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const saveSolicitud=async(p)=>{
    try {
        const {data,status}=await $axios.post('/prospecto',p)
        return data;
    } catch (error) {
        throw Error("no se pudo guardar la solicitud")
    }
}

export const getSolicitudes=async(p)=>{
    try {
        const {data,status}=await $axios.get('/prospecto/solicitudes',{params:p})
        return data;
    } catch (error) {
        throw Error("no se pudo guardar la solicitud")
    }
}