import {$axios} from '@/util/axios_instance'


export const getReporteM8=async(p)=>{
    try {
        const {data,status}=await $axios.get('/reporte-formato-m8',{params:p})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFileReporteM8=async(name)=>{
    try {
        const {data,status}=await $axios.get(`/reporte-formato-m8/documento-file`,{responseType:'blob',params:{documento:name}})  
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}

export const getReporteByAccionesM8=async(p)=>{
    try {
        const {data,status}=await $axios.get('/reporte-formato-m8/by-accion',{params:p})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getReporteByAccionesDetalleM8=async(cve_accion)=>{
    try {
        const {data,status}=await $axios.get('/reporte-formato-m8/by-accion-detalle',{params:{cve_accion}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getReporteByAccionesDetalleArchivoM8=async(archivo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-formato-m8/by-accion-detalle-archivo',{responseType: "blob",params:{archivo}})
        console.log(data)
        const data_=await new Promise((resolve,reject)=>{
            const reader = new FileReader()
            reader.onload=()=>resolve(reader.result)
            reader.onerror=e=>reject(e)
            reader.readAsDataURL(data)
        })
        return data_;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}