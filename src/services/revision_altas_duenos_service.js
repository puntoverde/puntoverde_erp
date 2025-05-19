import {$axios_token as $axios} from '@/util/axios_instance'

export const getNuevoIngresoUsuariosService=async(filters)=>{
    try {
        const {data,status}=await $axios.get(`/validacion-solicitud-nuevo-dueno`,{params:filters})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getIngresoNuevoUsuarioByIdService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/validacion-solicitud-nuevo-dueno/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}

export const getIngresoNuevoUsuarioFotoService=async(foto)=>{
    try {
        const {data,status}=await $axios.get(`/validacion-solicitud-nuevo-dueno/foto`,{responseType: "blob",params:{foto}})
        console.log(data)
        const data_=await new Promise((resolve,reject)=>{
            const reader = new FileReader()
            reader.onload=()=>resolve(reader.result)
            reader.onerror=e=>reject(e)
            reader.readAsDataURL(data)
        })
        return data_;        
    } catch (error) {
        console.log(error)
        throw Error("Error al intentar recuperar la foto")
    }
}

export const setValidacionNuevoIngreso=async(ids_dueno,clave)=>
{
    try {
        const {data,status}=await $axios.put(`/validacion-solicitud-nuevo-dueno`,{ids_dueno,clave})
        return data
    } catch (error) {
        
    }
}
