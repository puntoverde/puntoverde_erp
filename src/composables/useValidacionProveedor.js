import { reactive, ref } from "vue"
import { object, number, string ,ValidationError,mixed} from 'yup'


export const useValidacionProveedor = () => {
    
    //schema 
    const schema = object().shape({
        codigo: string().required().uppercase().trim().label("Codigo"),
        nombre_comercial: string().required().uppercase().trim().label("Nombre comercial"),
        razon_social: string().required().uppercase().trim().label("Razon social"),
        rfc: string().required().trim().uppercase().label("RFC"),
        moneda_proveedor: string().required().label("Moneda"),
        telefono_empresa: string().notRequired().label("Telefono empresa"),
        
        persona_contacto: string().notRequired().label("Persona contacto"),
        correo_contacto: string().notRequired().label("Correo contacto"),
        whatsapp_contacto: string().notRequired().label("Whatsapp"),

        calle: string().notRequired().trim().uppercase().label("Calle"),
        n_ext: string().notRequired().trim().uppercase().label("Numero Ext"),
        n_int: string().notRequired().trim().uppercase().label("Numero Int"),
        cp: string().notRequired().label("Codigo Postal"),
        id_colonia: number().notRequired().label("Colonia"),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        codigo: "",
        nombre_comercial: "",
        razon_social:"",
        rfc: "",
        moneda_proveedor: "",
        telefono_empresa:"",
        
        persona_contacto:"",
        correo_contacto:"",
        whatsapp_contacto:"",

        calle: "",
        n_ext: "",
        n_int: "",
        cp: "",
        id_colonia: "",
    })

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i) => {
        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false })
        } catch (error) {
            //si error es una instancia de ValidationError y si su name es 'ValidationError' entra al if
            if (error instanceof ValidationError && error.name === "ValidationError") {
                //llena el objeto de tipo IRequestDomicilioValidationError con los mensajes de validacion
                error.inner.forEach(({ path, message }) => iErrors[path] = message)
            }
            //regresa un nuevo error con mensaje personalizado o podria solo regresar el mismo error(throw error) que es una intancia de ValidationError 
            throw new Error("Error Valicacion")
        }
    }

    return { iValid, iErrors };
}