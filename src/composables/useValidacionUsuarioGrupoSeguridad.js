import { reactive } from "vue"
import { object, number,string, ValidationError,setLocale} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useValidacionUsuarioGrupoSeguridad= () => {
    //schema 
    const schema = object().shape({  
        cve_persona: number().notRequired().label("id persona"),      
        usuario:string().required().label("Usuario"),
        contrasena:string().required().label("Contraseña"),
        nombre:string().required().uppercase().trim().label("Nombre"),
        paterno:string().required().uppercase().trim().label("Apellido Paterno"),
        materno:string().required().uppercase().trim().label("Apellido Materno"),
        sexo:string().required().label("Genero"),
        fecha_nacimiento:string().required().label("Fecha Nacimiento"),
        tipo_user:string().required().label("Tipo Usuario")       
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        usuario:undefined,
        contrasena:undefined,
        nombre:undefined,
        paterno:undefined,
        materno:undefined,
        sexo:undefined,
        fecha_nacimiento:undefined,
        tipo_user:undefined,
    })

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i) => {

        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = undefined);
        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false })
        } catch (error) {
            console.error(error)

            //si error es una instancia de ValidationError y si su name es 'ValidationError' entra al if
            if (error instanceof ValidationError && error.name === "ValidationError") {
                //llena el objeto de tipo IRequestDomicilioValidationError con los mensajes de validacion
                error.inner.forEach(({ path, message }) => iErrors[path] = message)
            }
            //regresa un nuevo error con mensaje personalizado o podria solo regresar el mismo error(throw error) que es una intancia de ValidationError 
            throw new Error("Error Valicacion")
        }
    }

    const iClear=()=>Object.entries(iErrors).forEach(([key]) => iErrors[key] = undefined);

    return { iValid, iErrors, iClear };
}