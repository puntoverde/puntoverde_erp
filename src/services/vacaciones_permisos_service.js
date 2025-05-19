import {$axiosRh as $axios} from '@/util/axios_instance'

export const getDiasDisabled=async(id_colaborador)=>{
    try {              
        const { data, status } = await $axios.get(`vacaciones-permiso/dias-disabled/${id_colaborador}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getVacionesService=async(id_colaborador)=>{
    try {              
        const { data, status } = await $axios.get(`vacaciones-permiso/vacaciones/${id_colaborador}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPermisoService=async(id_colaborador)=>{
    try {              
        const { data, status } = await $axios.get(`vacaciones-permiso/permisos/${id_colaborador}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createVacionesService=async(data_send)=>{
    try {              
        const { data, status } = await $axios.post(`vacaciones-permiso/vacaciones`,data_send);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createPermisosService=async(data_send)=>{
    try {              
        const { data, status } = await $axios.post(`vacaciones-permiso/permisos`,data_send);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const deleteVacionesService=async(id_vacacion)=>{
    try {              
        const { data, status } = await $axios.delete(`vacaciones-permiso/vacaciones/${id_vacacion}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deletePermisoService=async(id_permiso)=>{
    try {              
        const { data, status } = await $axios.delete(`vacaciones-permiso/permisos/${id_permiso}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getVacacionesDisponiblesService=async (id_colaborador)=>{
    try {              
        const { data, status } = await $axios.get(`vacaciones-permiso/vacaciones-disponibles/${id_colaborador}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

