import { reactive, ref } from "vue"
import {object,number,string} from 'yup'

export const useValidacionRequisicion=()=>{
    //schema 
    const schema=object().shape({
        cantidad:number().required().positive().min(1).integer().label("Colaborar Solicita"),
        revisa:string().required().positive().min(1).integer().label("Colaborador Revisa"),
        autoriza:string().required().positive().min(1).integer().label("Colaborador Autoriza"),
        productos:array().of().label("Productos"),     
        
       })

    //    {
    //     "solicita":1,
    //     "revisa":1,
    //     "autoriza":1,
    //     "productos":[
    //         {"id":1,"cantidad":1,"observacion":"mama","espacio_fisico":1,"marca":1,"presentacion":1},
    //         {"id":12,"cantidad":2,"observacion":"mama2","espacio_fisico":1}
    //     ]
    // }

        // objeto reactivo para guardar los mensajes de validacion
        const iErrors=reactive({
        id_persona:'',
        calle:'',
        n_ext:'',
        n_int:'',
        cp:'',
        id_colonia:'',
        })

         //accion que se encarga del proceso de validacion
        //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
        const iValid=async (i)=>{
            //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
            Object.entries(iErrors).forEach(([key])=>iErrors[key]='');
            try {
                //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
                 return await schema.validate(i,{abortEarly:false})
            } catch (error) {
                //si error es una instancia de ValidationError y si su name es 'ValidationError' entra al if
                if(error instanceof ValidationError && error.name==="ValidationError"){
                    //llena el objeto de tipo IRequestDomicilioValidationError con los mensajes de validacion
                    error.inner.forEach(({ path, message }) => iErrors[path] = message)
                }
                //regresa un nuevo error con mensaje personalizado o podria solo regresar el mismo error(throw error) que es una intancia de ValidationError 
                throw new Error("Error Valicacion")               
            }
        }

return {iValid,iErrors};
}