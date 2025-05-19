import {$axiosOrigin as $axios,$axios as $axios_legal} from '@/util/axios_instance'


export const getReporteAccesoService=async(accion,dia,fechaI,fechaF,horaI,horaF,noAccion,clasificacion,nombreDia,rangoHoras)=>{
    try {
        
        
        const params = new URLSearchParams();
        params.append('accion', accion);
        params.append('dia', dia);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('horaI', horaI);
        params.append('horaF', horaF);
        params.append('noAccion', noAccion);
        params.append('clasificacion', clasificacion);
        params.append('nombreDia', nombreDia);
        params.append('rangoHoras', rangoHoras);

        const {data,status}=await $axios.post('reporteAccesoController.php',params)

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoGraficaService=async(accion,dia,fechaI,fechaF,horaI,horaF,noAccion,clasificacion)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', accion);
        params.append('dia', dia);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('horaI', horaI);
        params.append('horaF', horaF);
        params.append('noAccion', noAccion);
        params.append('clasificacion', clasificacion);

        const {data,status}=await $axios.post('reporteAccesoController.php',params)

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoV2Service=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoV2ChartDiaService=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoV2ChartGeneroService=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoV2ChartDiaSemanaService=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 4);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}


export const getReporteAccesoV2ChartHoraService=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 5);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoV2ChartEstanciaService=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 6);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoV2ChartEdadService=async(fechaI,fechaF)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 7);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data,status}=await $axios.post('reporteAccesoSalidaController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const setSalidaCompletaService=async()=>{
    try {
        let {data,status}=await $axios_legal.get('reporte-acceso-salida')
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}


export const getReporteAccesoInvitadosService=async(dia,fechaI,fechaF,horaI,horaF,noAccion,clasificacion)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('dia', dia);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('horaI', horaI);
        params.append('horaF', horaF);
        params.append('noAccion', noAccion);
        params.append('clasificacion', clasificacion);

        const {data,status}=await $axios.post('reporteAccesoInvitadosController.php',params)      

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}


export const getReporteAccesoGraficaDiaService=async(diaInicio,diaFin,cve_accion,cve_socio)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:7,diaInicio,diaFin,cve_accion,cve_socio}})    

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoGraficaEdadesService=async(diaInicio,diaFin)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:9,diaInicio,diaFin}})                

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoGraficaGeneroService=async(diaInicio,diaFin)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:8,diaInicio,diaFin}})    
                  
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoGraficaDiasSemanaService=async(diaInicio,diaFin)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:10,diaInicio,diaFin}})
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}


export const getReporteAccesoGraficaHorasService=async(diaInicio,diaFin)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:11,diaInicio,diaFin}})       
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoGraficaTotalAccesoService=async(diaInicio,diaFin)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:12,diaInicio,diaFin}})           
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getReporteAccesoGraficaFindAccionService=async(numero_accion,clasificacion)=>{
    try {

        const {data,status}=await $axios.get('reporteAccesoGraficasController.php',{params:{accion:13,numero_accion,clasificacion}})  
             
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}