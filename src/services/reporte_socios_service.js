import {$axios as $axios} from '@/util/axios_instance'


export const getSociosReporteService=async(nombre,numero_accion,clasificacion,estatus)=>{
    try {
        let { data, status } = await $axios.get("/reporte-socios", { params: { nombre, numero_accion, clasificacion, estatus }})
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getSocioDetalleReporteService=async(id_socio)=>{
    try {        
        let { data, status } = await $axios.get(`/reporte-socios/${id_socio}`)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const setToggleSocioService=async(id_socio,numero_accion, clasificacion)=>{
    try {                
        let { data, status } = await $axios.put(`/reporte-socios/${id_socio}`, { numero_accion, clasificacion })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const saveFotoSocioService=async(id_socio,foto)=>{
    const form = new FormData();
    form.append("foto", foto);    
    try {
        const {data,status}=await $axios.post(`/reporte-socios/${id_socio}/upload-foto`,form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getSociosHistoricoReporteService=async(nombre)=>{
    try {
        const {data,status}=await $axios.get('reporte-historico-socios',{params:{nombre}})
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}
export const getSocioHistoricoByIdReporteService=async(id)=>{
    try {
        // let {data,status}=await $axios.get('reporte-historico-socios',{params:{nombre}})
        const {data,status} =await $axios.get(`reporte-historico-socios/${id}`)
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getDatosSocioHistoricoByIdReporteService=async(id)=>{
    try {
        // let {data,status}=await $axios.get('reporte-historico-socios',{params:{nombre}})
        // const {data,status} =await $axios.get(`reporte-historico-socios/${id}`)
        const {data,status}=await $axios.get(`reporte-historico-socios/datos/${id}`)
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getFotoSocioService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`reporte-socios/foto`,{responseType: "blob",params:{foto:id}})

        const image_ = await new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result)
            reader.onerror = e => reject(e)
            reader.readAsDataURL(data)
        })
    
        return image_
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

