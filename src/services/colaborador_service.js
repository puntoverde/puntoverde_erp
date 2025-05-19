import {$axiosRh as $axios} from '@/util/axios_instance'


export const getColaboradoresService=async(filtros=[])=>{
    try {        
        const { data, status } = await $axios.get("colaboradores", { params: filtros });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradorByIdService=async(id)=>{
    try {                
        let { data, status } = await $axios.get(`colaboradores/${id}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setColaboradorService=async(data_send)=>{
    try {                        
        let { data, status } = await $axios.post("colaboradores", data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateColaboradorService=async(id_colaborador,data_send)=>{
    try {                        
        let { data, status } = await $axios.put(`colaboradores/${id_colaborador}`,data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteColaboradorService=async(id_colaborador)=>{
    try {                        
        let { data, status } = await $axios.delete(`colaboradores/${id_colaborador}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const reingresoColaboradorService=async(id_colaborador)=>{
    try {                        
        let { data, status } = await $axios.put(`colaboradores/reingreso/${id_colaborador}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDepartamentoColaboradoresService=async()=>{
    try {        
        const { data, status } = await $axios.get("colaboradores/departamentos");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAreaColaboradoresService=async(id_departamento)=>{
    try {                
        let { data, status } = await $axios.get(`colaboradores/areas/${id_departamento}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setJefeDepartamentoService=async(id_departamento,id_colaborador)=>{
    try {                        
        const { data, status } = await $axios.put("colaboradores/jefe-departamento",{id_departamento,id_colaborador});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradorHorarioService=async(id_colaborador)=>{
    try {                        
        const { data, status } = await $axios.get(`/colaboradores-horario/${id_colaborador}`);

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const setColaboradorHorarioService=async(id_colaborador,data_send)=>{
    try {                        
        const { data, status } = await $axios.post(`/colaboradores-horario/${id_colaborador}`,data_send);

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteColaboradorHorarioService=async(id_colaborador)=>{
    try {                        
        const { data, status } = await $axios.delete(`colaboradores-horario/${id_colaborador}`);

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteColaboradorHorarioByDayService=async(id_colaborador_horario)=>{
    try {                        
    
        const {data,status}=await $axios.delete(`colaboradores-horario/dia/${id_colaborador_horario}`)

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradorBeneficiarioService= async (id_colaborador)=>{
    try {
        const {data,status}=await $axios.get(`colaboradores/beneficiario/${id_colaborador}`)
        return data;
    } catch (error) {
        console.log(error)
    }
}
export const createColaboradorBeneficiarioService= async (data_send)=>{
    try {
        const {data,status}=await $axios.post(`colaboradores/beneficiario`,data_send)
        return data;
    } catch (error) {
        console.log(error)
    }
}
export const getColaboradorEscolaridadService= async (id_colaborador)=>{
    try {
        const {data,status}=await $axios.get(`colaboradores/escolaridad/${id_colaborador}`)
        return data;
    } catch (error) {
        console.log(error)
    }
}
export const createColaboradorEscolaridadService= async (data_send)=>{
    try {
        const form = new FormData();
        form.append("id_colaborador",data_send.id_colaborador);           
        form.append("nivel_escolaridad",data_send.nivel_escolaridad);
        form.append("nombre_institucion_curso",data_send.nombre_institucion_curso);
        form.append("anio_curso",data_send.anio_curso);
        form.append("estatus",data_send.estatus);
        form.append("evidencia",data_send.evidencia);
        const {data,status}=await $axios.post(`colaboradores/escolaridad`,form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const getParentescoService= async ()=>{
    try {
        const {data,status}=await $axios.get(`colaboradores/parentesco`)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const getDownloadEvidencia=async (evidencia)=>
{
    try{
        const {data,status}=await $axios.get(`colaboradores/evidencia-download`,{params:{evidencia},responseType:'blob'})
        return data;
    }
    catch(error){}
}

export const getExpedienteService=async (id)=>
{
    try{
        const {data,status}=await $axios.get(`colaboradores/expediente/${id}`)
        return data;
    }
    catch(error){}
}

export const createColaboradorExpedienteService= async (data_send)=>{
    try {
        const form = new FormData();
        form.append("cve_colaborador",data_send.cve_colaborador);           
        form.append("cve_rh_documento",data_send.cve_rh_documento);       
        form.append("documento",data_send.documento);
        const {data,status}=await $axios.post(`colaboradores/expediente`,form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const deleteColaboradorExpedienteDocService=async (id)=>{
    try {        
        const {data,status}=await $axios.delete(`colaboradores/expediente`,{params:{id}})
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const HistoricoColaboradorPermanenciaService= async (id)=>{
    try {
        const {data,status}=await $axios.get(`colaboradores/historico/${id}`)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const getReporteAltasBajasColaboradorService=async(fecha_inicio,fecha_fin,estatus)=>{

    try {
        const {data,status}=await $axios.get(`colaboradores/reporte-altas-bajas`,{params:{fecha_inicio,fecha_fin,estatus}})
        return data;
    } catch (error) {
        
    }

}