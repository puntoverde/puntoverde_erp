import { reactive, ref } from "vue"
import { object, number, string ,array,ValidationError,mixed} from 'yup'


export const useValidacionOrdenTrabajo = () => {

    //schema 
    const schema = object().shape({
        folio:string().optional().label("Folio"),
        id_departamento:number().required().label("id departamento"),
        departamento_dirigido:number().required().label("Departamento realiza"),
        id_persona: number().required().label("id_persona"),
        nombre_evento: string().required().trim().uppercase().label("Nombre evento"),
        descripcion:string().required().trim().uppercase().label("Descripcion"),
        fecha_inicio_evento:string().optional().nullable().trim().label("Fecha inicio evento"),
        fecha_fin_evento:string().optional().nullable().trim().label("Fecha fin evento"),
        id_tipo_orden_trabajo:number().required().label("Tipo Orden de Trabajo"),
        id_clasificacion_orden_trabajo:number().required().label("Clasificacion Orden de Trabajo"),
        cve_socio:number().optional().label("Socio reporto")
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        folio:"",
        id_departamento:"",
        departamento_dirigido:"",
        id_persona: "",
        nombre_evento: "",
        descripcion: "",
        fecha_inicio_evento: "",
        fecha_fin_evento: "",
        id_tipo_orden_trabajo:"",
        id_clasificacion_orden_trabajo:'',
        cve_socio:""
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

    const iClear=()=> Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');

    return { iValid, iErrors ,iClear};
}