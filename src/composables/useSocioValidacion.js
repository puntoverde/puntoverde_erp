import { reactive } from "vue"
import { object, number,string, ValidationError,setLocale} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useSociosValidacion= () => {
    //schema 
    const schema = object().shape({
        posicion:number().when('$id_socio', (id_socio, s) =>Boolean(id_socio) ? s.notRequired() : s.required()).label("Posicion"),
        nombre:string().required().trim().uppercase().label("Nombre"),
        apellido_paterno:string().required().trim().uppercase().label("Apellido paterno"),
        apellido_materno:string().required().trim().uppercase().label("Apellido materno"),
        sexo:number().required().oneOf([1,2]).label("Genero"),
        fecha_nacimiento:string().required().trim().label("Fecha nacimiento"),
        curp:string().notRequired().max(18).trim().uppercase().label("Curp"),
        rfc:string().notRequired().max(13).trim().uppercase().label("Rfc"),
        cve_pais:number().required().label("Nacionalidad"),        
        estado_civil:string().required().label("Estado civil"),
        calle:string().required().trim().uppercase().label("Calle"),
        numero_exterior:string().required().trim().uppercase().label("Numero exterior"),
        numero_interior:string().notRequired().trim().uppercase().label("Numero interior"),        
        cve_colonia:number().required().label("Colonia"),
        celular:string().notRequired().trim().uppercase().label("Celular"),
        telefono:string().notRequired().trim().uppercase().label("Telefono"),
        correo:string().required().notRequired().trim().lowercase().label("Correo electronico"),
        grado_estudio:string().notRequired().trim().uppercase().label("Grado estudio"),
        institucion_escolar:string().notRequired().trim().uppercase().label("Institucion escolar"),
        institucion_laboral:string().notRequired().trim().uppercase().label("Institucion laboral"),
        puesto_ejerce:string().notRequired().trim().uppercase().label("Puesto ejerce"),
        experiencia:string().notRequired().trim().uppercase().label("Experiencia"),
        giro_institucion:string().notRequired().trim().uppercase().label("Giro institucion"),
        estado_accion:string().notRequired().trim().uppercase().label("Estado de accion"),
        fecha_alta:string().required().trim().uppercase().label("Fecha alta"),
        fecha_ingreso_club:string().required().trim().uppercase().label("Fecha ingreso al club"),
        cve_profesion:number().required().label("Profesion"),
        cve_parentesco:number().required().label("Parentesco"),
        capacidad:number().required().label("Capacidad diferente"),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        posicion:'',
        nombre:'',
        apellido_paterno:'',
        apellido_materno:'',
        sexo:'',
        fecha_nacimiento:'',
        curp:'',
        rfc:'',
        cve_pais:'',
        estado_civil:'',
        calle:'',
        numero_exterior:'',
        numero_interior:'',
        cve_colonia:'',
        celular:'',
        telefono:'',
        correo:'',
        grado_estudio:'',
        institucion_escolar:'',
        institucion_laboral:'',
        puesto_ejerce:'',
        experiencia:'',
        giro_institucion:'',
        estado_accion:'',
        fecha_alta:'',
        fecha_ingreso_club:'',
        cve_profesion:'',
        cve_parentesco:'',
        capacidad:'',
    })

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i,id_socio) => {

        console.log("🚀 ~ file: useSocioValidacion.js:78 ~ iValid ~ id_socio:", id_socio);

        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false,context:{id_socio} })
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