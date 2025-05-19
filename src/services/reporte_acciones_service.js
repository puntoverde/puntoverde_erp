import {$axios as $axios} from '@/util/axios_instance'


export const getAccionesHistoricoReporteService=async(numero_accion,clasificacion)=>{
    try {
        
        const {data,status}=await $axios.get('reporte-historico-accion',{params:{numero_accion,clasificacion}})
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}
export const getAccionesHistoricoDuenoReporteService=async(id)=>{
    try {
        
        const {data,status} =await $axios.get(`reporte-historico-accion/${id}`)
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getAccionesHistoricoSociosReporteService=async(id)=>{
    try {
        
        const {data,status} =await $axios.get(`reporte-historico-accion/socios/${id}`)
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getAccionesHistoricoCargosReporteService=async(id)=>{
    try {
                
        const {data,status} =await $axios.get(`reporte-historico-accion/cargos/${id}`)
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getAccionesHistoricoEstatusTipoReporteService=async(id)=>{
    try {
                
        const {data,status} =await $axios.get(`reporte-historico-accion/estatus_tipo/${id}`)
        console.log('data->',data)
        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}


