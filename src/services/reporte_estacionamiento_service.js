import {$axiosOrigin as $axios} from '@/util/axios_instance'


export const getDatosEstacionamientoService=async(filtros)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 1);
        Object.entries(filtros).forEach(([key,value])=>{params.append(key,value)}) 
        const {data}=await $axios.post("/reporteEstacionamientoController.php",params)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getDatosEstacionamientoChartService=async(fechaI,fechaF)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const  { data } = await $axios.post("/reporteEstacionamientoController.php",params);
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}
export const getDatosEstacionamientoChartGeneroService=async(fechaI,fechaF)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const  { data } = await $axios.post("/reporteEstacionamientoController.php",params);
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}

export const getDatosEstacionamientoChartSemanaService=async(fechaI,fechaF)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 4);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const  { data } = await $axios.post("/reporteEstacionamientoController.php",params);
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}

export const getDatosEstacionamientoChartHorasService=async(fechaI,fechaF)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 5);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const  { data } = await $axios.post("/reporteEstacionamientoController.php",params);
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}

export const getDatosEstacionamientoChartEstanciaService=async(fechaI,fechaF)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 6);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const  { data } = await $axios.post("/reporteEstacionamientoController.php",params);
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}

export const getDatosEstacionamientoChartEdadService=async(fechaI,fechaF)=>{
    try {
        const params = new URLSearchParams();
        params.append('accion', 7);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const  { data } = await $axios.post("/reporteEstacionamientoController.php",params);
        return data
    } catch (error) {
        console.log(error)
        throw Error("no trae archivo")
    }
}