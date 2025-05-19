import { reactive } from "vue"
import { object, number, string ,ValidationError, mixed} from 'yup'



export const useValidacionColaboradorEscolaridad = () => {

    //schema 
    const schema = object().shape({
        id_colaborador: number().required().label("Colaborador"),
        nivel_escolaridad: string().required().label("Nivel Escolaridad"),
        nombre_institucion_curso: string().required().trim().uppercase().label("Institucion curso"),
        anio_curso:string().required().trim().uppercase().label("Año curso"),
        estatus:string().required().trim().uppercase().label("Estatus"),
        evidencia:mixed().test('Evidencia es requerida', 'File', (value) => value),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        id_colaborador:"",
        nivel_escolaridad:"",
        nombre_institucion_curso: "",
        anio_curso: "",
        estatus: "",
        evidencia: ""
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
                console.log(error.inner)
            }
            //regresa un nuevo error con mensaje personalizado o podria solo regresar el mismo error(throw error) que es una intancia de ValidationError 
            throw new Error("Error Valicacion")
        }
    }

    return { iValid, iErrors };
}