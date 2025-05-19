import {$axiosOrigin as $axios} from '@/util/axios_instance'

export const guardarUsuarioSistemaService=async(data_send)=>{
    try {       
        
        const params = new URLSearchParams();
        params.append('accion', '1');
        params.append('nombre', data_send.nombre);
        params.append('paterno', data_send.paterno);
        params.append('materno', data_send.materno);
        params.append('sexo', data_send.genero);
        params.append('fecha_nacimiento', data_send.fecha_nacimiento);
        params.append('usuario', data_send.usuario);
        params.append('contrasena', data_send.contrasena);
        params.append('tipo_user', data_send.privilegios);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getUsuariosSistemaService=async()=>{
    try {       
        
        const params = new URLSearchParams();
        params.append('accion', '2');

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const seleccionarUpdateService=async(cve_persona)=>{
    try {       
        // axios.post("/usuariosController.php",qs.stringify({ accion: 3, cve_persona: p }))
        const params = new URLSearchParams();
        params.append('accion', '3');
        params.append('cve_persona', cve_persona);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getModulosService=async(cve_persona)=>{
    try {       
        
        const params = new URLSearchParams();
        params.append('accion', '4');
        params.append('cve_persona', cve_persona);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const asignarModuloService=async(cve_persona,cve_modulo)=>{
    try {       
        // axios.post("/usuariosController.php", qs.stringify({ accion: 5, cve_persona: cve_persona.value, cve_modulo: p }))
        const params = new URLSearchParams();
        params.append('accion', '5');
        params.append('cve_persona', cve_persona);
        params.append('cve_modulo', cve_modulo);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const removerModuloService=async(cve_persona,cve_modulo)=>{
    try {       
        // axios.post("/usuariosController.php",qs.stringify({ accion: 6, cve_persona: cve_persona.value, cve_modulo: p }))
        const params = new URLSearchParams();
        params.append('accion', '6');
        params.append('cve_persona', cve_persona);
        params.append('cve_modulo', cve_modulo);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const bajaUsuarioService=async(cve_persona)=>{
    try {       
        //  axios.post("/usuariosController.php",qs.stringify({ accion: 7, cve_persona: cve_persona.value }))
        const params = new URLSearchParams();
        params.append('accion', '7');
        params.append('cve_persona', cve_persona);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const altaUsuarioService=async(cve_persona)=>{
    try {       
        //  axios.post("/usuariosController.php",qs.stringify({ accion: 8, cve_persona: cve_persona.value }))
        const params = new URLSearchParams();
        params.append('accion', '8');
        params.append('cve_persona', cve_persona);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const actualizarUsuarioService=async(data_send)=>{
    try {       
        //  axios.post("/usuariosController.php",qs.stringify({ accion: 8, cve_persona: cve_persona.value }))
        const params = new URLSearchParams();
        params.append('accion', '9');
        params.append('cve_persona', data_send.cve_persona);
        params.append('nombre', data_send.nombre);
        params.append('paterno', data_send.paterno);
        params.append('materno', data_send.materno);
        params.append('sexo', data_send.genero);
        params.append('fecha_nacimiento', data_send.fecha_nacimiento);
        params.append('usuario', data_send.usuario);
        params.append('contrasena', data_send.contrasena);
        params.append('tipo_user', data_send.privilegios);

        const {data,status}=await $axios.post("/usuariosController.php",params)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}