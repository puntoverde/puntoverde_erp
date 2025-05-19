import {$axiosFinanzas as $axios} from '@/util/axios_instance'



export const allProveedor=async(params)=>{
    try {
        const {data,status}=await $axios.get('/proveedor',{params})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findProveedorById=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/proveedor/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const allProveedorByName=async(p)=>{
    try {
        const {data,status}=await $axios.get('/proveedor/search',{params:{search:p}})
        return data;
    } catch (error) {
        throw error
    }
}


export const createProveedor=async(p)=>{
    try {
        const {data,status}=await $axios.post('/proveedor',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateProveedorService=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/proveedor/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const allCategoriaProveedor=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/proveedor/categorias/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const allProductoProveedor=async(id,id_prod)=>{
    try {
        const {data,status}=await $axios.get(`/proveedor/productos-categorias/${id}/${id_prod}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getcolonias=async(cp)=>{
try {
    let { data } = await $axios.get("domicilios", {params: { cp }});
    return data;
} catch (error) {
    throw error
}
}

export const addCategoria=async(id,p)=>{
    try {
        const {data,status}=await $axios.post(`/proveedor/${id}/categoria`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const addProducto=async(id,p)=>{
    try {
        const {data,status}=await $axios.post(`/proveedor/${id}/producto`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

