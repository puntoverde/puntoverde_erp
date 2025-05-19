import { reactive } from "vue"
import { object, number,string, ValidationError,setLocale,array} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useValidacionVacacionPermiso= (is_vacacion=true) => {

console.log("🚀 ~ file: useValidacionVacacionPermiso.js:9 ~ useValidacionVacacionPermiso ~ is_vacacion:", is_vacacion);


    

    //schema 
    const schema = object().shape({            
        id_colaborador_encargado:number().required().label("Colaborador encargado"),
        id_colaborador:number().required().label("Colaborador"),
        fecha_vacaciones:array().when("$is_vacacion",([is_vacacion],s)=>is_vacacion?s.required():s.notRequired()).label("Fecha vacacion"),
        descripcion:string().required().trim().uppercase().label("Descripcion"),
        fecha_permiso:string().when("$is_vacacion",([is_vacacion],s)=>is_vacacion?s.notRequired():s.required()).trim().uppercase().label("Fecha permiso"),
        tipo:number().when("$is_vacacion",([is_vacacion],s)=>is_vacacion?s.notRequired():s.required()).label("Tipo permiso")
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        id_colaborador_encargado:'',
        id_colaborador:'',
        fecha_vacaciones:'',
        descripcion:'',
        fecha_permiso:'',
        tipo:''
    })

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i) => {
        console.log("🚀 ~ file: useValidacionVacacionPermiso.js:9 ~ useValidacionVacacionPermiso ~ is_vacacion:", is_vacacion);
        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false,context:{is_vacacion} })
        } catch (error) {

            console.log("🚀 ~ file: useSocioValidacion.js:84 ~ iValid ~ error:", error);

            //si error es una instancia de ValidationError y si su name es 'ValidationError' entra al if
            if (error instanceof ValidationError && error.name === "ValidationError") {
                //llena el objeto de tipo IRequestDomicilioValidationError con los mensajes de validacion
                error.inner.forEach(({ path, message }) => iErrors[path] = message)
            }
            //regresa un nuevo error con mensaje personalizado o podria solo regresar el mismo error(throw error) que es una intancia de ValidationError 
            throw new Error("Error Valicacion")
        }
    }

    const iClear=()=>Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');

    return { iValid, iErrors, iClear };
}