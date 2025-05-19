import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const allProductoByClaveName=async(p)=>{
    try {
        const {data,status}=await $axios.get('/producto/search',{params:{search:p}})
        return data;
    } catch (error) {
        throw error
    }
}

export const allProducto=async(params)=>{
    try {
        const {data,status}=await $axios.get('/producto',{params})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findProductoById=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/producto/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const createProducto=async(p)=>{
    try {
        const {data,status}=await $axios.post('/producto',p)
        return data;
    } catch (error) {
        throw Error("ERORR AL CREAR EL PRODUCTO...")
    }
}


export const allSubCategoriaProducto=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/producto/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const saveImagenProducto=async(foto,clave)=>{
    const form = new FormData();
    form.append("foto", foto);
    form.append("clave", clave);
    try {
        const {data,status}=await $axios.post(`/producto/upload-foto`,form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        return 'NA'
    }
}

export const reporteProductoRequisicionService=async(params)=>{

    try{
        const {data,status}=await $axios.get(`/reporte-producto`,{params})
        return data;
    }
    catch(error){
        throw Error("Error al guardar.")
    }

}

export const reporteProductoRequisicionRevisonService=async(params)=>{

    try{
        const {data,status}=await $axios.get(`/reporte-producto/revision`,{params})
        return data;
    }
    catch(error){
        throw Error("Error al guardar.")
    }

}

export const reporteProductoRequisicionCuadriculaService=async(params)=>{

    try{
        const {data,status}=await $axios.get(`/reporte-producto/cuadricula`,{params})
        return data;
    }
    catch(error){
        throw Error("Error al guardar.")
    }

}

export const reporteProductoRequisicionCuadriculaDetalleService=async(params)=>{

    try{
        const {data,status}=await $axios.get(`/reporte-producto/cuadricula-detalle`,{params})
        return data;
    }
    catch(error){
        throw Error("Error al guardar.")
    }

}

export const getDetalleNombreProducto=async(nombre)=>
{

    try{
        const {data,status}=await $axios.get(`/producto/detalle-nombre`,{params:{nombre}})
        return data;
    }
    catch(error){
        throw Error("Error al recuperar el nombre")
    } 

}