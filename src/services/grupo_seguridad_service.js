import {$axiosSeguridad_token as $axios} from '@/util/axios_instance'

export const getUsuariosSistemaService=async(filtros)=>{
    try {       
        
        const {data,status}=await $axios.get("/grupo-seguridad/usuarios",{params:filtros})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createUsuariosSistemaService=async(data_send)=>{
    try {       
        
        const {data,status}=await $axios.post("/grupo-seguridad/usuarios",data_send)
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getColaboradoresDisponiblesService=async()=>{
    try {       
        
        const {data,status}=await $axios.get("/grupo-seguridad/colaboradores-disponibles")
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPerfilesService=async()=>{
    try {       
        
        const {data,status}=await $axios.get("/grupo-seguridad/perfiles")
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const getModuloByPerfilService=async(id_perfil)=>{
    try {       
        
        const {data,status}=await $axios.get("/grupo-seguridad",{params:{id_perfil}})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const addModuloByPerfilService=async(id_perfil,id_modulo)=>{
    try {       
        
        const {data,status}=await $axios.post("/grupo-seguridad",{id_perfil,id_modulo})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const removeModuloByPerfilService=async(id_perfil,id_modulo)=>{
    try {       
        
        const {data,status}=await $axios.delete("/grupo-seguridad",{params:{id_perfil,id_modulo}})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getPerfilesByUsuarioService=async(id_usuario)=>{
    try {       
        
        const {data,status}=await $axios.get("/grupo-seguridad/usuarios-perfiles",{params:{id_usuario}})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const addPerfilesByUsuarioService=async(id_perfil,id_usuario)=>{
    try {       
        
        const {data,status}=await $axios.post("/grupo-seguridad/usuarios-perfiles",{id_perfil,id_usuario})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const removePerfilesByUsuarioService=async(id_perfil,id_usuario)=>{
    try {       
        
        const {data,status}=await $axios.delete("/grupo-seguridad/usuarios-perfiles",{params:{id_perfil,id_usuario}})
        return data;

    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

// export const guardarUsuarioSistemaService=async(data_send)=>{
//     try {       
        
//         const params = new URLSearchParams();
//         params.append('accion', '1');
//         params.append('nombre', data_send.nombre);
//         params.append('paterno', data_send.paterno);
//         params.append('materno', data_send.materno);
//         params.append('sexo', data_send.genero);
//         params.append('fecha_nacimiento', data_send.fecha_nacimiento);
//         params.append('usuario', data_send.usuario);
//         params.append('contrasena', data_send.contrasena);
//         params.append('tipo_user', data_send.privilegios);

//         const {data,status}=await $axios.post("/usuariosController.php",params)
//         return data;

//     } catch (error) {
//         throw Error("Error al guardar antecedentes familiares")
//     }
// }



// export const seleccionarUpdateService=async(cve_persona)=>{
//     try {       
//         // axios.post("/usuariosController.php",qs.stringify({ accion: 3, cve_persona: p }))
//         const params = new URLSearchParams();
//         params.append('accion', '3');
//         params.append('cve_persona', cve_persona);

//         const {data,status}=await $axios.post("/usuariosController.php",params)
//         return data;

//     } catch (error) {
//         throw Error("Error al guardar antecedentes familiares")
//     }
// }
