import {$axios as $axios,$axiosOrigin as $axios_origin} from '@/util/axios_instance'

export const getAccionesDisponiblesInvitados=async(data_send)=>{
    try {              
        const { data, status } = await $axios.get("/invitados/accion_disponible");
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getSociosInvitanService=async(numero_accion, clasificacion)=>{
    try {       
        const { data, status } = await $axios.get("/invitados/socios_invitan", {params: { accion: 16, numero_accion, clasificacion }});
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createInvitadoService=async(data_send)=>{
    try {       
        const { data, status } = await $axios.post("/invitados", data_send);
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const reingresoInvitadoService=async(cve_invitado,data_send)=>{
    try {       
        const { data, status } = await $axios.put(`invitados/${cve_invitado}`,data_send);
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getInvitadoService=async(search_invitado)=>{
    try {       
        const { data, status } = await $axios.get("invitados", {params: { search_invitado}});
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getInvitadoByIdService=async(id_invitado)=>{
    try {       
        const { data, status } = await $axios.get(`invitados/${id_invitado}`);
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getHistoricoInvitadosService=async(id_invitado)=>{
    try {               
        const  { data, status } = await $axios.get(`invitados/${id_invitado}/historico`);
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const reporteRegistroInvitadosService=async(fechaInicio, fechaFin)=>{
try {               
    const {data,status}= await $axios_origin.get("/reporteRegistroInvitadosController.php",{params:{ accion: 3, fechaInicio, fechaFin }})
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const reporteRegistroInvitadosChartDiaService=async(fechaInicio, fechaFin)=>{
    try {               
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaInicio', fechaInicio);
        params.append('fechaFin', fechaFin);
        let {data} = await axios_origin.post("/reporteRegistroInvitadosController.php",params);
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const reporteRegistroInvitadosHistoricoService=async(fechaRegistro)=>{
try {               
    const {data,status}= await $axios_origin.get("/reporteRegistroInvitadosController.php",{params:{ accion: 2, fechaRegistro }})
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
export const InvitadosCargosService=async()=>{
try {               
    const {data,status}= await $axios.get("invitados/cargos-historico")
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}
export const BajaInvitadosService=async(id_socio,id_invitado)=>{
try {               
    const {data,status}= await $axios.delete("invitados/eliminar",{params:{ id_socio,id_invitado }})
        
        return data
       
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}