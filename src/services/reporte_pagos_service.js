// import {$axiosOrigin as $axios} from '@/util/axios_instance'
import { $axiosFinanzas as $axios, $axiosOrigin as $axios_origin } from '@/util/axios_instance'


export const getCajeroService = async () => {
    try {
        // const {data,status}=await $axios.get("/reportePagoConceptoController.php", { params: { accion: 5 } }) 
        const { data, status } = await $axios.get("/reporte-pago-concepto/cajero")
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getConceptosService = async () => {
    try {
        // const {data,status}=await $axios.get("/reportePagoConceptoController.php", { params: { accion: 3 } })
        const { data, status } = await $axios.get("/reporte-pago-concepto/conceptos")
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}


export const getBuscarPagosService = async (numero_accion, clasificacion, cve_cuota, cajero, periodo, fecha_inicio, fecha_fin) => {
    try {
        // const {data,status}=await $axios.get("/reportePagoConceptoController.php", {params: {accion: 2,numero_accion,clasificacion,cve_cuota,cajero,periodo,fecha_inicio,fecha_fin}})
        const { data, status } = await $axios.get("/reporte-pago-concepto/pagos", { params: { numero_accion, clasificacion, cve_cuota, cajero, periodo, fecha_inicio, fecha_fin } })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen salida")
    }
}


export const getPagosExportarService = async (fecha_inicio, fecha_fin) => {
    try {
        const { data, status } = await $axios.get("/reportePagoConceptoController.php", { params: { accion: 8, fecha_inicio, fecha_fin } });
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen salida")
    }
}


export const getBuscarPagosDeportesService = async (numero_accion, clasificacion, cve_cuota, fecha_inicio, fecha_fin) => {
    try {
        // const {data,status}=await $axios.get("/reportePagoConceptoController.php", {params: {accion: 2,numero_accion,clasificacion,cve_cuota,cajero,periodo,fecha_inicio,fecha_fin}})
        const { data, status } = await $axios.get("/reporte-pago-concepto/pagos-deporte", { params: { numero_accion, clasificacion, cve_cuota, fecha_inicio, fecha_fin } })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen salida")
    }
}

export const getConceptosDeportesService = async () => {
    try {
        // const {data,status}=await $axios.get("/reportePagoConceptoController.php", { params: { accion: 3 } })
        const { data, status } = await $axios.get("/reporte-pago-concepto/conceptos-deporte")
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}


export const getReportePagosCanceladosService = async (filtros) => {
    try {
        const { data, status } = await $axios.get("/cancelar-pago/reportePagoCancelado", { params: filtros })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}

export const getCajeroReporteConcentradoPagosService = async () => {
    try {
        const { data } = await $axios_origin.get("/reportePagoConceptoController.php", { params: { accion: 5 } })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}

export const getReportePagosConcentradoService = async (cve_persona, fecha_inicio, fecha_fin) => {
    try {
        const { data } = await $axios_origin.get("/reportePagoConceptoController.php", { params: { accion: 6, cve_persona, fecha_inicio, fecha_fin } })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}

export const getReportePagosDescuentoConcentradoService = async (fecha_inicio, fecha_fin) => {
    try {
        const { data } = await $axios_origin.get("/reportePagoConceptoController.php", { params: { accion: 7, fecha_inicio, fecha_fin } })
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos almacen requisicion")
    }
}

export const getAllPagosReporteService = async (fechaI, fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const { data } = await $axios_origin.post("/reportePagosController.php", params)
        return data

    } catch (error) {

    }
}

export const getAllFormaPagosReporteService = async (fechaI, fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios_origin.post("/reportePagosController.php",params)
        
        return data

    } catch (error) {

    }
}

export const getPagosReporteDetalleService = async (cajeras,concepto,fechaI, fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('cajeras', cajeras);
        params.append('concepto', concepto);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios_origin.post("/reportePagosController.php", params)
        
        return data

    } catch (error) {

    }
}

export const getPagosReporteDetalleTableService = async () => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 8);

        const {data}=await $axios_origin.post("/reportePagosController.php", params)
        
        return data

    } catch (error) {

    }
}

export const getPagosReporteListaCajeraService = async (fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 4);
        params.append('cajeras', "");
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios_origin.post("/reportePagosController.php", params)
        
        return data

    } catch (error) {

    }
}

export const getPagosReporteListaConceptosService = async (fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 5);
        params.append('cajeras', "");
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios_origin.post("/reportePagosController.php", params)
        
        return data

    } catch (error) {

    }
}

export const getPagosReporteFormasPagoService = async (cajeras,concepto,fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('cajeras', cajeras);
        params.append('concepto', concepto);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios_origin.post("/reportePagosController.php", params)
     
        
        return data

    } catch (error) {

    }
}


export const getPagosReporteFormasPagoSeleccionadasService = async (cajeras,concepto,fpago,fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 6);
        params.append('cajeras', cajeras);
        params.append('concepto', concepto);
        params.append('fpago', fpago);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios_origin.post("/reportePagosController.php", params)
     
        
        return data

    } catch (error) {

    }
}
