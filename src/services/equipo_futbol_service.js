import {$axiosDeportes as $axios} from '@/util/axios_instance'

export const getTorneoFutbolService=async()=>{
    try {
        const { data } = await $axios.get("torneo-futbol");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getEquiposFutbolServices=async(filtros)=>
{
    try {
        const { data } = await $axios.get("equipo-futbol",{params:filtros});
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getAccionesTipoFutbolService=async()=>
{
    try {       
        let { data } = await $axios.get("equipo-futbol/acciones");
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getJugadoresByAccionService=async(id)=>
{
    try {  
        let { data } = await $axios.get(`equipo-futbol/${id}/jugadores`);
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getSociosAddJugadorService=async(nombre,numero_accion,clasificacion,id_torneo)=>
{
    try {  
        let { data } = await $axios.get(`equipo-futbol/socios`, {
            params: {
              nombre,
              numero_accion,
              clasificacion,
              id_torneo
            },
          });
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setSocioAddJugadorService=async(id_accion,id_socio,numero_jugador,id_torneo)=>
{
    try {  
        let { data } = await $axios.post(
            `equipo-futbol/${id_accion}/jugador`,
            {
              cve_socio: id_socio,
              numero_jugador: numero_jugador,
              id_torneo: id_torneo,
            }
          );
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const activeOrDesactiveJugadorService=async(id_accion,id_socio,estatus)=>
{
    try {  
        let { data } = await $axios.put(`equipo-futbol/${id_accion}/jugador`,{ cve_socio: id_socio, estatus});
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createEquipoService=async(id_torneo,id_accion,nombre)=>
{
    try {  
        let { data } = await $axios.post(`equipo-futbol/${id_torneo}`, {id_accion,nombre});
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getJugadoresActivosService=async(id_equipo)=>
{
    try {  
        let { data } = await $axios.get(`equipo-futbol/${id_equipo}/jugadores-activo`);
        return data; 
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getFotoJugadorService=async(foto)=>
{
    try {  
        let { data } = await $axios.get(`equipo-futbol/foto`, {params: { foto }});
        return data; 
    } catch (error) {
        throw Error("Error en foto")
    }
}

export const getReporteJugadoresService=async(id_torneo)=>{
    try {
        const {data,status}=await $axios.get(`/equipo-futbol/reporte-jugadores/${id_torneo}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setCreateTorneoFutbolService=async(nombre,categoria,limite_edad,fecha_inicio,fecha_fin)=>{
    try {       
        let { data } = await $axios.post(`torneo-futbol`,{nombre,categoria,limite_edad,fecha_inicio,fecha_fin});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}