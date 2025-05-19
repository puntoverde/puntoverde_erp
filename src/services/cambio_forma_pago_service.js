import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const getPagoService=async(numero_accion,clasificacion,folio,dia)=>{
    try {               
  const { data, status } = await $axios.get("/cambiar-forma-pago", {params: {numero_accion,clasificacion,folio,dia}})
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const getCatalogoFormaPagoService=async()=>{
    try {               
        const { data } = await $axios.get(`/cambiar-forma-pago/forma-pago`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}


export const setAddNewFormaPagoService=async(id_pago)=>{
    try {                       
        const { data } = await $axios.post(`/cambiar-forma-pago/forma-pago/${id_pago}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}


export const deleteFormaPagoService=async(id_forma_pago)=>{
    try {                       
        const { data } = await $axios.delete(`/cambiar-forma-pago/forma-pago/${id_forma_pago}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const getFormasPagoByPagoService=async(id_pago)=>{
    try {                       
        let { data } = await $axios.get(`/cambiar-forma-pago/pagos/${id_pago}`);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const updateFormaPagoService=async(id_forma,clave,persona)=>{
    try {        
        const { data } = await $axios.put(`/cambiar-forma-pago/forma-pago/${id_forma}`, { clave,persona });
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const updateMontoFormaPagoService=async(id_forma,monto,persona)=>{
    try {        
        const { data } = await $axios.put(`/cambiar-forma-pago/monto/${id_forma}`, { monto,persona });
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const updateMontoCargoService=async(id_cargo,monto,persona)=>{
    try {               
        const { data } = await $axios.put(`/cambiar-forma-pago/cargo-monto/${id_cargo}`, { monto,persona });
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const getListaCajerosService=async(numero_accion,clasificacion,folio,dia)=>{
    try {        
        const {data,status}=await $axios.get("/cambiar-forma-pago/cajeros")
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateCajeroPagoService=async(id_pago,id_persona,persona_cambia)=>{
    try {        
        const {data,status}=await $axios.put(`/cambiar-forma-pago/cajero/${id_pago}`,{cajero:id_persona,persona:persona_cambia})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateFechaPagoService=async(id_pago,fecha,persona_cambia)=>{
    try {        
        const {data,status}=await $axios.put(`/cambiar-forma-pago/fecha/${id_pago}`,{fecha:fecha,persona:persona_cambia})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getCuotasService=async(numero_cuota)=>{
    try {        
        // const {data,status}=await $axios.put(`/cambiar-forma-pago/fecha/${id_pago}`,{fecha:fecha,persona:persona_cambia})
        let { data } = await $axios.get(`/cambiar-forma-pago/cuotas`, { params: { numero_cuota } });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateCuotaCargoService=async(id_cargo,cve_cuota)=>{
    try {        
        // const {data,status}=await $axios.put(`/cambiar-forma-pago/fecha/${id_pago}`,{fecha:fecha,persona:persona_cambia})
        let { data } = await $axios.put(`/cambiar-forma-pago/cuotas/${id_cargo}`, { cve_cuota });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}





