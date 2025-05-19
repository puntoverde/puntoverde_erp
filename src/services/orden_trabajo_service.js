import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getOrdenesTabajoService=async(id_persona)=>{
    try {
        const {data,status}=await $axios.get("orden-trabajo",{params:{id_persona}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getOrdenTrabajoByIdService=async(id_concepto)=>{
    try {        
        let {data,status} = await $axios.get(`/orden-trabajo/${id_concepto}`)
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const setCreateOrdenTrabajoService=async(data_send)=>{
    try {                
        let {data,status}=await $axios.post('orden-trabajo',data_send);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const updateOrdenTrabajoService=async(id,data_send)=>{
    try {                
        let {data,status}=await $axios.put(`orden-trabajo/${id}`,data_send);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getDepartamentoService=async(cve_persona)=>{
    try {                
        let {data,status}=await $axios.get(`orden-trabajo/departamento/${cve_persona}`);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getDepartamentosService=async()=>{
    try {                
        let {data,status}=await $axios.get(`orden-trabajo/departamentos`);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const updateCancelarRechzarOrdenTrabajoService=async(id,estatus)=>{
    try {                
        let {data,status}=await $axios.put(`orden-trabajo/cancel-rechazar/${id}`,{estatus});
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const updateIniciarOrdenTrabajoService=async(id,id_colaborador)=>{
    try {                
        let {data,status}=await $axios.put(`orden-trabajo/iniciar/${id}`,{id_colaborador});
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getOrdenTrabajoActividadesService=async(id_orden)=>{
    try {                
        let {data,status}=await $axios.get(`orden-trabajo/${id_orden}/actividad`);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getOrdenTrabajoActividadByIdService=async(id_actividad)=>{
    try {                
        let {data,status}=await $axios.get(`/orden-trabajo/actividad/${id_actividad}`);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const createOrdenTrabajoActividadService=async(id_orden,responsable,actividad,tipo_actividad,fecha_planeada)=>{
    try {                
        let {data,status}=await $axios.post(`orden-trabajo/${id_orden}/actividad`,{responsable,actividad,tipo_actividad,fecha_planeada});
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const deleteOrdenTrabajoActividadService=async(id_actividad)=>{
    try {                
        let {data,status}=await $axios.delete(`/orden-trabajo/actividad/${id_actividad}`);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const terminarOrdenTrabajoActividadService=async(id_actividad)=>{
    try {                
        let {data,status}=await $axios.put(`/orden-trabajo/actividad/${id_actividad}/terminar`);
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const getReporteOrdenTrabajoDepartamentos=async()=>{

    try {
        const {data}=await $axios.get(`/orden-trabajo/reporte-departamentos`)
        return data
    } catch (error) {
        
    }
}

export const getReporteOrdenTrabajoByDepartamentoOrAll=async(id_departamento,folio,cve_socio)=>{

    try {
        const {data}=await $axios.get(`/orden-trabajo/reporte${Boolean(id_departamento)?`/${id_departamento}`:''}`,{params:{folio,cve_socio}})
        return data
    } catch (error) {
        
    }
}
export const getReporteOrdenTrabajoActividades=async(id_orden_trabajo)=>{

    try {
        const {data}=await $axios.get(`/orden-trabajo/reporte/${id_orden_trabajo}/actividades`)
        return data
    } catch (error) {
        
    }
}


export const getTipoOrdenTrabajoService=async()=>{

    try {
        const {data}=await $axios.get(`/orden-trabajo/tipos`)
        return data
    } catch (error) {
        
    }
}

export const getTipoOrdenTrabajoActividadService=async()=>{

    try {
        const {data}=await $axios.get(`/orden-trabajo/tipos-actividad`)
        return data
    } catch (error) {
        
    }
}


export const getActividadesByDepartamentoService=async(cve_persona,fecha,responsable)=>{
    try {
        const {data,status}=await $axios.get('/orden-trabajo/actividades-revision',{params:{cve_persona,fecha,responsable}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const getActividadesByDepartamentoPendientesService=async(cve_persona,responsable)=>{
    try {
        const {data,status}=await $axios.get('/orden-trabajo/actividades-revision-pendientes',{params:{cve_persona,responsable}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const finalizarActividadesByDepartamentoService=async(id_actividad,fecha,observacion)=>{
    try {
        const {data,status}=await $axios.put('/orden-trabajo/actividades-revision-finalizar',{id_actividad,fecha,observacion})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getActividadesReporteService=async(fecha_inicio,fecha_fin,responsable,tipo,departamento)=>{
    try {
        const {data,status}=await $axios.get('/orden-trabajo/actividades-revision-reporte',{params:{fecha_inicio,fecha_fin,responsable,tipo,departamento}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const createActividadesObservacionesService=async(id_orden_trabajo_actividad,responsable,observacion)=>{
    try {
        const {data,status}=await $axios.post('/orden-trabajo/actividades-revision-observacion',{id_orden_trabajo_actividad,responsable,observacion})
        return data;
    } catch (error) {
        throw Error("Error")
    }
}


export const getReporteSociosOrdenTrabajoService=async(folio,estatus)=>{
    try {
        const {data,status}=await $axios.get('/orden-trabajo/reporte-socios',{params:{folio,estatus}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const getReporteInternoOrdenTrabajoService=async(folio,estatus)=>{
    try {
        const {data,status}=await $axios.get('/orden-trabajo/reporte-interno',{params:{folio,estatus}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}

export const getClasificacionOrdenTrabajoService=async(id_departamento)=>{
    try {
        const {data,status}=await $axios.get('/orden-trabajo/clasificacion',{params:{id_departamento}})
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const addFotoOrdenTrabajoService=async(id_orden_trabajo,foto_,id_foto)=>{
    try {   
        const formData = new FormData();
        formData.append("id_orden_trabajo",id_orden_trabajo);        
        formData.append("foto", foto_);
        formData.append("id_foto",id_foto);        

        const { data:foto } = await $axios.post("orden-trabajo/upload-foto", formData, {headers: { "Content-Type": "multipart/form-data" }});
        return data
       
    } catch (error) {
        throw error
    }
}


export const cancelarFotoOrdenTrabajoService=async(id_orden_trabajo,id_foto)=>{
    try {
        const {data,status}=await $axios.put('/orden-trabajo/cancelar-foto',{id_orden_trabajo,id_foto})        
        return data;
    } catch (error) {
        throw Error("Error ")
    }
}


export const getFotoOrdenTrabajoService=async(foto_url)=>{
    try {   
                
        const { data, status } = await $axios.get(`orden-trabajo/foto`, {responseType: "blob",params: { foto:foto_url}});

        const image_ = await new Promise((resolve, reject) => {
            
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result)
            reader.onerror = e => reject(e)
            reader.readAsDataURL(data)
        })
        
        return image_
       
    } catch (error) {
        return null
    }
}



