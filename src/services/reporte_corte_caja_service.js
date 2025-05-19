// import {$axiosOrigin as $axios} from '@/util/axios_instance'
import { $axiosOrigin as $axios } from '@/util/axios_instance'







export const getReporteCorteCajaService = async (fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios.post("/reporteCorteCajaController.php", params)    
        return data

    } catch (error) {
            
    }
}


export const getReporteCorteCajaDetalleService = async (fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('cuota', 0);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios.post("/reporteCorteCajaController.php", params)  
        
        return data

    } catch (error) {

    }
}

export const getReporteCorteCajaTablaFpService = async (idpago,fechaI,fechaF) => {

    try {

        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('idpago', idpago);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);

        const {data}=await $axios.post("/reporteCorteCajaController.php", params)  
    
        
        return data

    } catch (error) {

    }
}
