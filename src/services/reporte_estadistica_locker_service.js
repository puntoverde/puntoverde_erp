import {$axios as $axios} from '@/util/axios_instance'


export const getReporteEstadisticaCardsService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-cards',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteEstadisticaRentadosService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-rentados',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteEstadisticaNoRenovadoService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-norenueva',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteEstadisticaPerteneceClubService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-pertenece-club',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteEstadisticaPerteneceExternoService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-pertenece-externo',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteEstadisticaCargosOrPagosService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-cargos-pagos',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteEstadisticaLibresService=async(periodo)=>{
    try {
        const {data,status}=await $axios.get('/reporte-lockers/estadistica-libres',{params:{periodo}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}