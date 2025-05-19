import {$axios as $axios} from '@/util/axios_instance'

export const getBuscarLockersService=async(numero_locker,numero_accion,clasificacion,nombre,ubicacion)=>{
    try {
        
        let { data, status } = await $axios.get("lockers", {
            params: {
              numero_locker,
              numero_accion,
              clasificacion,
              nombre,
              ubicacion
            },
          });
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getHistoricoLockerService=async(id_locker)=>{
    try {
        
        let { data, status } = await $axios.get(`lockers/${id_locker}`);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

//en teoria esto debe de ir en servicio de socios
export const getSociosByNameOrAccionService=async(nombre,numero_accion, clasificacion)=>{
    try {
        
        let { data, status } = await $axios.get("lockers/socios", { params: { nombre, numero_accion, clasificacion }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDuenosByNameService=async(nombre)=>{
    try {        
        let { data, status } = await $axios.get("lockers/duenos", { params: { nombre }});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setAsignarLockerService=async(id_locker,data_send)=>{
    try {                
        let { data, status } = await $axios.post(`lockers/${id_locker}`, data_send);
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getCuotaLockerService=async()=>{
    try {                
        let { data, status } = await $axios.get("lockers/cuota");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const EliminarRentaLockerService=async(id_locker,cve_persona,cve_persona_cancela,motivo_cancelacion)=>{
    try {                
        let { data, status } = await $axios.delete(`lockers/${id_locker}`, { params: { cve_persona,cve_persona_cancela,motivo_cancelacion} })
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const CambioEstadoLockerService=async(id_locker,estado)=>{
    try {                        
        let { data, status } = await $axios.put(`lockers/cambio-estado/${id_locker}`, { estado })
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setSaveContratoLockerService=async(id_locker,id_contrato,contrato_file,cve_persona,folio,observaciones)=>{
    try {             
        const form = new FormData();
        form.append("cve_locker_socio", id_contrato);           
        form.append("contrato", contrato_file);
        let { data } = await $axios.post("lockers/upload-contrato", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

        await $axios.put(`lockers/${id_locker}`,{cve_persona,folio,documento: data,observaciones});

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getEdificioLockerService=async()=>{
    try {                                
        let { data, status } = await $axios.get("lockers/edificios");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setAsignarLockerEditarService=async(id_locker,cve_persona)=>{
    try {                                
        let { data, status } = await $axios.put(`lockers/${id_locker}/asignar`, {cve_persona});        
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setAsignarLockerEditarDuenoService=async(id_locker,cve_persona)=>{
    try {                                        
        let { data, status } = await $axios.put(`lockers/${id_locker}/dueno`, {cve_persona});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const EditarNumeroLockerAnteriorDuenoService=async(id_locker,numero_locker)=>{
    try {                                        
        let { data, status } = await $axios.put(`lockers/${id_locker}/numero_locker`, {numero_locker});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const EditarObservacionLockerService=async(id_asignacion,observacion)=>{
    try {                                        
        let { data, status } = await $axios.put(`lockers/${id_asignacion}/observaciones`, {observacion});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getBuscarPermutaLockerService=async(numero_locker)=>{
    try {                                        
        let { data, status } = await $axios.get("lockers",{params: {numero_locker}});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setAsignarPermutaLockerService=async(cve_locker_uno,cve_locker_dos)=>{
    try {                                               
        let { data, status } = await $axios.post("lockers/permuta", {cve_locker_uno,cve_locker_dos});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getDetalleContratoService=async(documento)=>{
    try {                                               
        return `${$axios.defaults.baseURL}/lockers/view-contrato?file=${documento}`
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

//locker masivo

export const getLockerDisponiblesService=async(documento)=>{
    try {                                                      
        let { data, status } = await $axios.get("lockers/libres");
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setAsignarLockerMasivamenteService=async(data_send)=>{
    // data_send= {
    //     cve_locker: i.cve_locker,
    //     cve_persona: i.rentador,
    //     cve_accion: i.cve_accion,
    //     concepto: "renta locker",
    //     total: i.costo,
    //     fecha_inicio:i.fecha_inicio,
    //     fecha_fin: i.fecha_fin,
    //     tipo: 3,//renueva
    //   }
    try {                                                      
        let { data, status } = await $axios.post(`lockers/asignar-masivo`,data_send);
        return data
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}