import {$axios as $axios,$axiosOrigin as $axios_origen} from '@/util/axios_instance'

export const getProfesioncoService=async()=>{
    try {                
        let { data, status } = await $axios.get("/profesiones");
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const setProfesionService=async(nombre,sSexo,estatus)=>{
    try {                

        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('nombre', nombre);
        params.append('sSexo', sSexo);
        params.append('estatus', estatus);

        let { data, status } = await $axios_origen.post("/profesionController.php",params);

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const editarProfesionService=async(nombre,estatus,cve_profesion)=>{
    try {                

        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('nombre', nombre);
        params.append('estatus', estatus);
        params.append('cve_profesion', cve_profesion);

        let { data, status } = await $axios_origen.post("/profesionController.php",params);


        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const deleteProfesionService=async(cve_profesion)=>{
    try {                

        const params = new URLSearchParams();
        params.append('accion', 3);
        params.append('cve_profesion', cve_profesion);

        let { data, status } = await $axios_origen.post("/profesionController.php",params);
    

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getProfesionByIdService=async(cve_profesion)=>{
    try {                

        const params = new URLSearchParams();
        params.append('accion', 5);
        params.append('cve_profesion', cve_profesion);

        let { data, status } = await $axios_origen.post("/profesionController.php",params);       

        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getProfesionAllService=async()=>{
    try {                

        const params = new URLSearchParams();
        params.append('accion', 4);        

        let { data, status } = await $axios_origen.post("/profesionController.php",params);    
        
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}