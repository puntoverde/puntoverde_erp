import {$axios as $axios} from '@/util/axios_instance'

export const getListaLockerService=async(filters)=>{
    try {
        const {data,status}=await $axios.get(`/lockers/lista-locker`,{params:filters})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getLockerByIdService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/lockers/find-locker/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}

export const crearLockerService=async(data_send)=>{
    try {
        const {data,status}=await $axios.post(`lockers`,data_send)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}
export const actualizarLockerService=async(id,data_send)=>{
    try {
        const {data,status}=await $axios.put(`/lockers/${id}/actualizar`,data_send)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}



export const getEdificiosService=async ()=>{
    try {
        const {data,status}=await $axios.get(`lockers/edificios`)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}


export const getDuenosEditLockerService=async (name_or_accion)=>{
    try {
        let { data, status } = await $axios.get("lockers/duenos", {params: { nombre: name_or_accion }});
        return data
      } catch (error) {}
}

export const getLockerByNumeroOrUbicacionService=async (numero_locker,ubicacion)=>{
    try {
        // let { data, status } = await $axios.get("lockers/duenos", {params: { nombre: name_or_accion }});
        let { data, status } = await $axios.get("lockers", {params: {numero_locker,ubicacion}});
        return data
      } catch (error) {}
}

export const getHistoricoLockerService=async (id_locker)=>{
    try {
        // let { data, status } = await $axios.get("lockers/duenos", {params: { nombre: name_or_accion }});
        let { data, status } = await $axios.get(`lockers/liberar-historico/${id_locker}`)
        return data
      } catch (error) {}
}

export const getSociosLockerService=async (nombre)=>{
    try {
        // let { data, status } = await $axios.get("lockers/duenos", {params: { nombre: name_or_accion }});
        let { data, status } = await $axios.get("lockers/socios", {params: { nombre }});
        return data
      } catch (error) {}
}

export const setLiberarLockerService=async (id_locker,id_persona,motivo,authoriza,realiza)=>{
    try {
        let { data, status } = await $axios.post("lockers/liberar", {id_locker,id_persona,motivo,authoriza,realiza})
        return data
      } catch (error) {}
}

