import dayjs from "dayjs"
import { reactive } from "vue"
import { object, number, string, mixed, ValidationError } from 'yup'


export const useValidacionColaborador = () => {

    //schema 
    const schema = object().shape({
        cve_persona: number().optional().label("Id Persona"),
        cve_direccion: number().optional().label("Direccion"),
        nombre: string().required().trim().uppercase().label("Nombre"),
        paterno: string().required().trim().uppercase().label("Paterno"),
        materno: string().required().trim().uppercase().label("Materno"),
        genero: string().required().trim().uppercase().label("Genero"),
        fecha_nac: mixed().required().test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),
        curp: string().required().trim().uppercase().label("Curp"),
        rfc: string().required().trim().uppercase().label("Rfc"),
        estado_civil: string().required().trim().uppercase().label("Estado Civil"),
        calle: string().required().trim().uppercase().label("Calle"),
        num_ext: string().required().trim().uppercase().label("Numero Exterior"),
        num_int: string().optional().trim().uppercase(),
        cve_colonia: number().required().label("Colonia"),
        nomina: string().required().trim().uppercase().label("Nomina"),
        nomina_reloj: string().required().trim().uppercase().label("Nomina Reloj"),
        fecha_ingreso: mixed().required().test('is-date',({label})=>`${label} no es un a fecha valida`,(value,context)=>dayjs(value).isValid()),        
        id_departamento: number().required().label("Departamento"),
        id_area: number().required().label("Area"),
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        nombre:"",
        paterno:"",
        materno:"",
        genero:"",
        fecha_nac:"",
        curp:"",
        rfc:"",
        estado_civil:"",
        calle:"",
        num_ext:"",
        num_int:"",
        cve_colonia:"",
        nomina:"",
        nomina_reloj:"",
        fecha_ingreso:"",
        id_departamento:"",
        id_area:"",
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
