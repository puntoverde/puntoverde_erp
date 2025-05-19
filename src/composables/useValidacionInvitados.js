import dayjs from "dayjs"
import { min } from "lodash"
import { reactive } from "vue"
import { object, number, string, mixed, ValidationError, array,date } from 'yup'


export const useValidacionInvitado = () => {

    //schema 
    const schema = object().shape({
        cve_accion: number().optional().label("Accion Ingresa"),
        cve_persona_cargo: number().optional().label("Persona"),
        cve_direccion: number().optional().label("Direccion"),
        nombre: string().required().trim().uppercase().label("Nombre"),
        paterno: string().required().trim().uppercase().label("Paterno"),
        materno: string().required().trim().uppercase().label("Materno"),
        genero: string().required().trim().uppercase().label("Genero"),
        fecha_nac: mixed().required().label("FEcha nacimiento").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),
        estado_civil: string().required().trim().uppercase().label("Estado Civil"),
        calle: string().required().trim().uppercase().label("Calle"),
        num_ext: string().required().trim().uppercase().label("Numero Exterior"),
        num_int: string().optional().trim().uppercase(),
        colonia: number().required().label("Colonia"),
        nacionalidad: string().required().trim().uppercase().label("Nacionalidad"),
        celular: string().required().trim().uppercase().label("Celular"),
        correo: string().required().trim().uppercase().label("Correo"),
        profesion: string().required().trim().uppercase().label("Profesion"),
        // parentesco: string().required().trim().uppercase().label("Parentesco"),
        grado_estudio: string().required().trim().uppercase().label("Grado estudio"),
        fecha_inicio: mixed().required().label("Fecha inicio").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),        
        fecha_fin: mixed().required().label("Fecha fin").test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),        
        tipo_invitado:number().required().label("Tipo invitados"),
        cve_accion_cargo: string().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).trim().uppercase().label("Accion cargo"),      
        cve_socio_invita: string().when('tipo_invitado',{is:1,then:s=>s.required(),otherwise:s=>s.optional()}).trim().uppercase().label("Socio Invita"),      
        total: number().required().label("Costo"),
        dias_acceso: array().of(date()).when('tipo_acceso',{is:1,then:s=>s.min(0),otherwise:s=>min(1)}).label("Dias"),
        tipo_acceso:number().required().label("Tipo Acceso"),
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
export const useValidacionColaboradorBeneficiario = () => {

    //schema 
    const schema = object().shape({
        id_colaborador: number().required().label("Colaborador"),
        id_parentesco: number().required().label("Tipo parentesco"),
        nombre: string().required().trim().uppercase().label("Nombre"),
        paterno: string().required().trim().uppercase().label("Paterno"),
        materno: string().required().trim().uppercase().label("Materno"),
        contacto: string().required().trim().uppercase().label("Contacto"),
        domicilio: string().required().trim().uppercase().label("Domicilio"),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        id_colaborador: "",
        id_parentesco: "",
        nombre: "",
        paterno: "",
        materno: "",
        contacto: "",
        domicilio: ""
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
export const useValidacionColaboradorEscolaridad = () => {

    //schema 
    const schema = object().shape({
        id_colaborador: number().required().label("Colaborador"),
        nivel_escolaridad: string().required().label("Nivel Escolaridad"),
        nombre_institucion_curso: string().required().trim().uppercase().label("Institucion curso"),
        anio_curso: string().required().trim().uppercase().label("Año curso"),
        estatus: string().required().trim().uppercase().label("Estatus"),
        evidencia: mixed().test('Evidencia es requerida', 'File', (value) => value),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        id_colaborador: "",
        nivel_escolaridad: "",
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

    function iClear()
    {
        Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
    }

    return { iValid, iErrors ,iClear};
}
