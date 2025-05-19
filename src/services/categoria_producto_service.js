import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const allCategoriaProducto=async()=>{
    try {
        const {data,status}=await $axios.get('/categoria-producto')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findPersonaById=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/categoria-producto/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const createExamenMedico=async(p)=>{
    try {
        const {data,status}=await $axios.post('/categoria-producto',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const allSubCategoriaProducto=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/categoria-producto/sub/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const allSubSubCategoriaProducto=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/categoria-producto/subsub/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const createCategoriaProducto=async(nombre)=>{
    try {
        const {data,status}=await $axios.post('/categoria-producto',{nombre,descripcion:nombre})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const createSubCategoriaProducto=async(id,nombre)=>{
    try {
        const {data,status}=await $axios.post(`/categoria-producto/sub/${id}`,{nombre,descripcion:nombre})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createSubSubCategoriaProducto=async(id,nombre)=>{
    try {
        const {data,status}=await $axios.post(`/categoria-producto/subsub/${id}`,{nombre,descripcion:nombre})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


