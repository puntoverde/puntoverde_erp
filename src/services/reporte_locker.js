import {$axios as $axios} from '@/util/axios_instance'


export const getReporteCandadoLocker=async(fechaI,fechaF)=>{
    try {
        const { data, status } = await $axios.get("lockers/reporte-liberar-historico", {params: {fechaI,fechaF}});
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteLocker=async(ubicacion,renta,propietario,estado)=>{
    try {
        const { data, status } = await $axios.get("reporte-lockers",{params:{ubicacion,renta,propietario,estado}});
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getEdificioReporteLocker=async()=>{
    try {       
        const { data, status } = await $axios.get("reporte-lockers/edificios");
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

// reporte-locker-simple

export const getLockerTotales=async(filters)=>{
    try {       
        // const { data, status } = await $axios.get("reporte-lockers/edificios");
        const { data, status } = await $axios.get("reporte-lockers/totales",{params:{filters}});
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getLockerTotalesFiltros=async(filters)=>{
    try {       
        // const { data, status } = await $axios.get("reporte-lockers/edificios");        
        const { data, status } = await $axios.get("reporte-lockers/totales-filter",{params:{filters}});
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}


export const getLockerReporteGeneral=async(fecha_inicio,fecha_fin)=>{
    try {       
        // const { data, status } = await $axios.get("reporte-lockers/totales-filter",{params:{filters}});
        const {data, status}=await $axios.get("/lockers/reporte",{params:{fecha_inicio,fecha_fin}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}