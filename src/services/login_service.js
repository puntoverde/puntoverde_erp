import {$axiosOrigin as $axios,$axiosSeguridad as $axios_,$axiosSeguridad_token as $axios_token} from '@/util/axios_instance'

export const InicioSessionService=async(user,pass)=>{
    // try {                
    //     const params = new URLSearchParams();
    //     params.append('accion', 4);
    //     params.append('user', user);
    //     params.append('pass', pass);
    //     const { data ,status} = await $axios.post("/homeController.php",params);        
    //     return data
    // } catch (error) {
    //     throw Error("Error al guardar antecedentes familiares")
    // }

    try {
        const {data,status}=await $axios_.post("/login",{username:user,password:pass})
        return data
    } catch (error) {
        
    }
}


export const getNotificacionService=async(user,pass)=>{
    // try {                
    //     const params = new URLSearchParams();
    //     params.append('accion', 4);
    //     params.append('user', user);
    //     params.append('pass', pass);
    //     const { data ,status} = await $axios.post("/homeController.php",params);        
    //     return data
    // } catch (error) {
    //     throw Error("Error al guardar antecedentes familiares")
    // }

    try {
        const {data,status}=await $axios_token.get("/notificaciones")
        return data
    } catch (error) {
        
    }
}

export const setNotificacionVistoService=async(id_notificacion)=>{


    try {
        const {data,status}=await $axios_token.post("/notificaciones/visto",{id_notificacion})
        return data
    } catch (error) {
        
    }
}