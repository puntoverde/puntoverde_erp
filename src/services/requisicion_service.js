import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getRequisiciones=async (id_persona,filtros={})=>{
    console.log('filtros:',filtros)
    console.log('filtros params:',{id_persona,...filtros})
    try {
        const {data}=await $axios.get("/requisicion/all",{params:{id_persona,...filtros}})
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const createRequisicion=async(p)=>{
    try {
        const {data,status}=await $axios.post('/requisicion',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getDepartamentoAndColaboradores=async(id)=>{
    try {
        const {data,status}=await $axios.get('/requisicion/departamento-colaborador',{params:{id_persona:id}})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPersonaSolicitaRevisaAprueba=async(id_persona)=>{
    try {
        const {data,status}=await $axios.get(`/requisicion/solicita-revisa-aprueba/${id_persona}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDetalleRequisicion=async (id_requisicion)=>{
    try {
        const {data}=await $axios.get(`/requisicion/detalle/${id_requisicion}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getDetalleRevision=async (id_requisicion)=>{
    try {
        const {data}=await $axios.get(`/requisicion/revision/${id_requisicion}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getDetalleAprobar=async (id_requisicion)=>{
    try {
        const {data}=await $axios.get(`/requisicion/aprobar/${id_requisicion}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}


export const cancelarProductoRequisicionRevision=async (id_requisicion_producto)=>{
    try {
        const {data}=await $axios.put(`/requisicion/revision/producto/${id_requisicion_producto}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const finalizarRequisicionRevision=async (id_requisicion)=>{
    try {
        const {data}=await $axios.put(`/requisicion/revision/finalizar/${id_requisicion}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const cancelarProductoRequisicionAprobacionService=async (id_requisicion_producto)=>{
    try {
        const {data}=await $axios.put(`/requisicion/aprobar/producto/${id_requisicion_producto}`)
        // const {data}=await $axios.put(`/requisicion/revision/producto_aprueba/${id_requisicion_producto}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const finalizarRequisicionAprovacion=async (id_requisicion)=>{
    try {
        const {data}=await $axios.put(`/requisicion/aprobar/finalizar/${id_requisicion}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}


export const CancelarRequisicion=async (id_requisicion)=>{
    try {
        const {data}=await $axios.put(`/requisicion/revision/cancelar/${id_requisicion}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getPresentacionProductos=async (id_producto)=>{
    try {
        const {data}=await $axios.get(`/requisicion/presentacion-productos/${id_producto}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getMarcaAsignarService=async (id_producto)=>{
    try {
        const {data}=await $axios.get(`/requisicion/marca-asignar/${id_producto}`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getAllRequisicionByColaborador=async (cve_persona)=>
{
    try {
        const {data}=await $axios.get(`/requisicion/all-detalle`,{params:{cve_persona}})
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}

export const getRequisicionExistDetalleService=async (id_requisicion)=>
{
    try {
        const {data}=await $axios.get(`/requisicion/${id_requisicion}/existente-detalle`)
        return data
    } catch (error) {
        throw Error("No se pudo recuperar las requisiciones...")
    }
}


