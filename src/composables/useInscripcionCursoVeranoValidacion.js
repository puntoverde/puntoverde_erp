import { reactive } from "vue"
import { object, number,string, ValidationError,setLocale,mixed} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useInscripcionCursoVeranoValidacion= () => {
    //schema 
    const schema = object().shape({  
        // cve_curso_verano:number().required().oneOf([1,2]).label("Curso Verano"),   
        cve_curso_verano:number().required().label("Curso Verano"),
        folio:string().when('cve_cuota',{is:102,then:s=>s.notRequired(),otherwise:s=>s.required()}).trim().uppercase().label("Folio de pago"),
        folio_boleta:string().required().trim().uppercase().label("Folio boleta"),
        cve_accion:number().required().label("Accion"),
        cve_persona:number().required().label("Persona"),
        cve_cargo:number().when('cve_cuota',{is:102,then:s=>s.notRequired(),otherwise:s=>s.required()}).label("Cargo"),
        cve_cuota:number().required().label("Cuota"),
        nombre:string().required().trim().uppercase().label("Nombre"),
        paterno:string().required().trim().uppercase().label("Apellido paterno"),
        materno:string().required().trim().uppercase().label("Apellido materno"),
        genero:string().required().equals(['Masculino','Femenino']).label("Genero"),
        nacimiento:string().required().trim().label("Fecha nacimiento"),            
        calle_numero:string().required().trim().uppercase().label("Calle y numero"),
        colonia:string().required().trim().uppercase().label("Colonia"),
        telefono_contacto:string().required().trim().uppercase().label("Telefono contacto"),
        tutor:string().required().trim().uppercase().label("Tutor"),
        nadar:number().required().equals([0,1]).label("Nadar?"),
        programa:number().required().label("Programa"),
        grupo:number().required().label("Grupo"),
        observaciones:string().required().trim().uppercase().label("Observaciones"),
        semana1:number()
        .when(['semana2','semana3','semana4'],([semana2,semana3,semana4],s)=>[semana2,semana3,semana4].some(i=>Boolean(i))?s.notRequired():s.required())
        .label("Semana 1"),
        semana2:number()
        .when(['semana1','semana3','semana4'],([semana1,semana3,semana4],s)=>[semana1,semana3,semana4].some(i=>Boolean(i))?s.notRequired():s.required())
        .label("Semana 2"),
        semana3:number()
        .when(['semana1','semana2','semana4'],([semana1,semana2,semana4],s)=>[semana1,semana2,semana4].some(i=>Boolean(i))?s.notRequired():s.required())
        .label("Semana 3"),
        semana4:number()
        .when(['semana1','semana2','semana3'],([semana1,semana2,semana3],s)=>[semana1,semana2,semana3].some(i=>Boolean(i))?s.notRequired():s.required())
        .label("Semana 4"),
        foto: mixed()
      .required("Foto es requerida")
    //   .test("is-valid-type", "No es una  foto valida",
    //     value => isValidFileType(value && value.name.toLowerCase(), "image"))
    //   .test("is-valid-size", "tamaño maximo de 100KB",
    //     value => value && value.size <= MAX_FILE_SIZE)
    },[['semana1','semana2'],['semana1','semana3'],['semana1','semana4'],['semana2','semana3'],['semana2','semana4'],['semana3','semana4']])

// ['semana1','semana3']

    // ...semanas_,
    


    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        cve_curso_verano:'',
        folio:'',
        folio_boleta:'',
        cve_accion:'',
        cve_persona:'',
        cve_cargo:'',
        cve_cuota:'',
        nombre:'',
        paterno:'',
        materno:'',
        genero:'',
        nacimiento:'',
        calle_numero:'',
        colonia:'',
        telefono_contacto:'',
        tutor:'',
        nadar:'',
        programa:'',
        grupo:'',
        observaciones:'',
        semana1:'',
        semana2:'',
        semana3:'',
        semana4:'',
        foto:''
    })

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i) => {

        
        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false})
        } catch (error) {

            console.log("🚀 ~ file: useSocioValidacion.js:84 ~ iValid ~ error:", error);

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

    const iClear=()=>Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');

    return { iValid, iErrors, iClear };
}

export const useUpdateCursoVeranoValidacion= () => {
    //schema 
    const schema = object().shape({                  
        folio_boleta:string().required().trim().uppercase().label("Folio boleta"),        
        cve_persona:number().required().label("Persona"),                
        nombre:string().required().trim().uppercase().label("Nombre"),
        paterno:string().required().trim().uppercase().label("Apellido paterno"),
        materno:string().required().trim().uppercase().label("Apellido materno"),
        genero:string().required().equals(['Masculino','Femenino']).label("Genero"),
        nacimiento:string().required().trim().label("Fecha nacimiento"),            
        calle_numero:string().required().trim().uppercase().label("Calle y numero"),
        colonia:string().required().trim().uppercase().label("Colonia"),
        telefono_contacto:string().required().trim().uppercase().label("Telefono contacto"),
        tutor:string().required().trim().uppercase().label("Tutor"),
        nadar:number().required().equals([0,1]).label("Nadar?"),        
        observaciones:string().required().trim().uppercase().label("Observaciones"),                
    },)

// ['semana1','semana3']

    // ...semanas_,
    


    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        cve_curso_verano:'',
        folio:'',
        folio_boleta:'',
        cve_accion:'',
        cve_persona:'',
        cve_cargo:'',
        cve_cuota:'',
        nombre:'',
        paterno:'',
        materno:'',
        genero:'',
        nacimiento:'',
        calle_numero:'',
        colonia:'',
        telefono_contacto:'',
        tutor:'',
        nadar:'',
        programa:'',
        grupo:'',
        observaciones:'',
        semana1:'',
        semana2:'',
        semana3:'',
        semana4:'',
        foto:''
    })

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i) => {

        
        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false})
        } catch (error) {

            console.log("🚀 ~ file: useSocioValidacion.js:84 ~ iValid ~ error:", error);

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

    const iClear=()=>Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');

    return { iValid, iErrors, iClear };
}