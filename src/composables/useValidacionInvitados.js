import dayjs from "dayjs"
import { min } from "lodash"
import { reactive } from "vue"
import { object, number, string, mixed, ValidationError, array,date } from 'yup'


export const useValidacionInvitado = () => {

    //schema 
    const schema = object().shape({
        cve_accion: number().optional().label("Accion Ingresar"),//son las acciones seis mil y algo 
        nombre: string().required().trim().uppercase().label("Nombre"),
        paterno: string().required().trim().uppercase().label("Paterno"),
        materno: string().required().trim().uppercase().label("Materno"),
        genero: string().required().trim().uppercase().label("Genero"),
        fecha_nac: mixed().required().label("Fecha Nacimiento").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),
        nacionalidad: number().required().label("Nacionalidad"),
        estado_civil: string().required().trim().uppercase().label("Estado Civil"),
        correo: string().required().trim().uppercase().label("Correo"),
        celular: string().required().trim().uppercase().label("Celular"),
        profesion: number().required().label("Profesion"),
        // parentesco: string().required().trim().uppercase().label("Parentesco"),
        grado_estudio: string().required().trim().uppercase().label("Grado estudio"),
        
        colonia: number().required().label("Colonia"),
        calle: string().required().trim().uppercase().label("Calle"),
        num_ext: string().required().trim().uppercase().label("Numero Exterior"),
        num_int: string().optional().trim().uppercase(),
        
        tipo_acceso:number().required().label("Tipo Acceso"),//es para saber si por dias o periodo --- 1=periodo ,  0=dias
        tipo_invitado:number().required().label("Tipo invitados"),//es para sabe el tipo de invitado ---1=socio invita ,  0=libre(viene solo)
        
        
        fecha_inicio: mixed().required().label("Fecha inicio").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),        
        fecha_fin: mixed().required().label("Fecha fin").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),        
        
        // cve_direccion: number().optional().label("Direccion"),
        //#region 
        
        
        //es esl el socio que invito se busca primero mediante la accion ejemplo un socio de la accion 200 realizo la invitacion mediante una m8
        //en el select regresa un objeto con estos tres 
        cve_socio_invita: number().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).label("Socio Invita"),      
        cve_accion_cargo: number().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).label("Accion cargo"),
        cve_persona_cargo: number().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).label("Persona Cargo"),
        

        total: number().required().label("Costo"),

        dias_acceso: array().of(date()).when('tipo_acceso',{is:1,then:s=>s.min(0),otherwise:s=>min(1)}).label("Dias"),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
            cve_accion:"",
            cve_persona_cargo:"",
            cve_direccion:"",
            nombre:"",
            paterno:"",
            materno:"",
            genero:"",
            fecha_nac:"",
            estado_civil:"",
            calle:"",
            num_ext:"",
            num_int:"",
            colonia:"",
            nacionalidad:"",
            celular:"",
            correo:"",
            profesion:"",
            parentesco:"",
            grado_estudio:"",
            fecha_inicio:"",
            fecha_fin:"",
            cve_accion_cargo:"",
            cve_socio_invita:"",
            total:"",
            dias_acceso:"",
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

    function iClear()
    {
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
    }

    return { iValid, iErrors,iClear };
}
export const useValidacionInvitadoReingreso = () => {

    //schema 
    const schema = object().shape({
        tipo_acceso:number().required().label("Tipo Acceso"),//es para saber si por dias o periodo --- 1=periodo ,  0=dias
        tipo_invitado:number().required().label("Tipo invitados"),//es para sabe el tipo de invitado ---1=socio invita ,  0=libre(viene solo)
        fecha_inicio: mixed().required().label("Fecha inicio").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),        
        fecha_fin: mixed().required().label("Fecha fin").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),
        dias_acceso: array().of(date()).when('tipo_acceso',{is:1,then:s=>s.min(0),otherwise:s=>min(1)}).label("Dias"),
        cve_socio_invita: number().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).label("Socio Invita"),      
        cve_accion_cargo: number().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).label("Accion cargo"),
        cve_persona_cargo: number().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).label("Persona Cargo"),
        total: number().required().label("Costo"),

    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        tipo_acceso:'',
        tipo_invitado:'',
        fecha_inicio:'',
        fecha_fin:'',
        dias_acceso:'',
        cve_socio_invita:'',
        cve_accion_cargo:'',
        cve_persona_cargo:'',
        total:''
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

    function iClear()
    {
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
    }

    return { iValid, iErrors ,iClear};
}
