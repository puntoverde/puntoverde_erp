import { reactive } from "vue"
import { object, number,string, ValidationError,setLocale} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useValidacionFactura= () => {
    //schema 
    const schema = object().shape({  
        rfc: string().max(13).min(12).required(),
        razon_social: string().required().label("Razon social"),
        correo: string().required().email(),
        regimen_fiscal: string().required().label("Regimen fiscal"),
        calle: string().required(),
        num_ext: string().required().label("Numero exterior"),
        num_int: string().notRequired().label("Numero exterior"),
        colonia: string().required(),
        cp: string().required().label("codigo postal"),
        municipio: string().required().label("municipio"),
        estado: string().required(),
        pais: string().required(),       
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        rfc:undefined,
        razon_social:undefined,
        correo:undefined,
        regimen_fiscal:undefined,
        calle:undefined,
        num_ext:undefined,
        num_int:undefined,
        colonia:undefined,
        cp:undefined,
        municipio:undefined,
        estado:undefined,
        pais:undefined,
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