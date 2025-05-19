import numeral from "numeral"
import { reactive } from "vue"
import { object, number, ValidationError,setLocale,mixed} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useValidacionRevision = () => {
    //schema 
    const schema = object().shape({
        ieps: mixed().required().test('iieps',(value)=>{if(!Boolean(value)) return true;else return numeral(value).value()>0}).transform((value,oldValue)=>numeral(value).value()).label("ieps"),
        iva: mixed().required().test('iiva',(value)=>{if(!Boolean(value)) return true;else return numeral(value).value()>0}).transform((value,oldValue)=>numeral(value).value()).label("iva"),
        subtotal: mixed().required().test('isubtotal',(value)=>{if(!Boolean(value)) return true;else return numeral(value).value()>0}).transform((value,oldValue)=>numeral(value).value()).label("subtotal"),
        total: mixed().required().test('itotal',(value)=>{if(!Boolean(value)) return true;else return numeral(value).value()>0}).transform((value,oldValue)=>numeral(value).value()).label("total"),

        // ieps: number().required().positive().min(1).transform((value,oldValue)=>{
        //     console.log('transform',oldValue,value)
        //     return numeral(oldValue).value()}).label("ieps"),
        // iva: number().required().positive().min(1).transform((value,oldValue)=>{
        //     console.log('transform',oldValue,value)
        //     return numeral(oldValue).value()}).label("iva"),
        // subtotal: number().required().positive().min(1).transform((value,oldValue)=>{
        //     console.log('transform',oldValue,value)
        //     return numeral(oldValue).value()}).label("subtotal"),
        // total: number().required().positive().min(1).transform((value,oldValue)=>{
        //     console.log('transform',oldValue,value)
        //     return numeral(oldValue).value()}).label("total"),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        ieps: '',
        iva: '',
        subtotal: '',
        total: '',
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