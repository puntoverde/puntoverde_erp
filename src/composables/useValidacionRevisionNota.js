import numeral from "numeral"
import { reactive } from "vue"
import { object,string,number, ValidationError,setLocale,mixed} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useValidacionRevisionNota = () => {
    //schema 
    const schema = object().shape({
        id_pedido:number().required().integer().min(1).label("Pedido"),
        nota:string().required().trim().uppercase().label('Descripcion'),
        nota_file:mixed()
        .test({
            name:'file-note-is-required',
            test:(file)=>Boolean(file),
            message:`Es necesario una imagen`,
            params:{nuevo:'lion'}})
            .test({
                name:'file-note-is-type',
                test:(file)=>file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type),
                message:'No es una imagen',
                params:{tipo:''}
            })
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        id_pedido:'',
        nota: '',
        nota_file: '',
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
            throw new Error("ErrorRevisionValidation")
        }
    }

    return { iValid, iErrors };
}