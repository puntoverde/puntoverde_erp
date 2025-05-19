import {$axios as $axios,$axiosOrigin as $axios_origen} from '@/util/axios_instance'

export const getParentescoService=async()=>{
    try {                
        let { data, status } = await $axios.get("/parentescos");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getParentescoByTipoAccionService=async(id_accion)=>{
    try {                
        let { data, status } = await $axios.get("/parentescos/by-tipo-accion",{params:{id_accion}});
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setParentescoService=async(nombre,sexo,estatus)=>{
    try {                
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('nombre', nombre);
        params.append('sexo', sexo);
        params.append('estatus', estatus);

        let { data, status } = await $axios_origen.post("/parentescoController.php",params);


        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const editarParentescoService=async(nombre,sexo,estatus,cve_parentesco)=>{
    try {                
        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('nombre', nombre);
        params.append('sexo', sexo);
        params.append('estatus', estatus);
        params.append('cve_parentesco', cve_parentesco);

        let { data, status } = await $axios_origen.post("/parentescoController.php",params);


        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteParentescoService=async(cve_parentesco)=>{
    try {                
        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('cve_parentesco', cve_parentesco);

        let { data, status } = await $axios_origen.post("/parentescoController.php",params);        

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getParentescoByIdService=async(cve_parentesco)=>{
    try {                
        const params = new URLSearchParams();
        params.append('accion', 5);
        params.append('cve_parentesco', cve_parentesco);

        let { data, status } = await $axios_origen.post("/parentescoController.php",params);   

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getParentescoAllService=async()=>{
    try {                
        const params = new URLSearchParams();
        params.append('accion', 4);

        let { data, status } = await $axios_origen.post("/parentescoController.php",params);         

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}