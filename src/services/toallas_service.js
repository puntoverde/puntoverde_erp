import {$axiosOrigin as $axios} from '@/util/axios_instance'


export const getToallaAlmacenService=async(fechaI,fechaF,nombreB)=>{
    try {
        
        
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('nombreB', nombreB);

        const {data,status}=await $axios.post('toallasController.php',params)

       

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getToallaPrestamoService=async(fechaI,fechaF,nombreB)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('nombreB', nombreB);

        const {data,status}=await $axios.post('toallasController.php',params)

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getToallaSociosService=async(fechaI,fechaF,nombreB)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 4);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('nombreB', nombreB);

        const {data,status}=await $axios.post('toallasController.php',params)

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}

export const getCancelarToallaPrestamoService=async(cve,fechaI,fechaF,nombreB)=>{
    try {
               
        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('cve', cve);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('nombreB', nombreB);

        const {data,status}=await $axios.post('toallasController.php',params)

        return data;
    } catch (error) {
        throw Error("Error al recuperar datos de almacen entrada")
    }
}
