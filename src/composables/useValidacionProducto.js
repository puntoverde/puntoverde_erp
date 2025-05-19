import { reactive, ref } from "vue"
import { object, number, string ,array,ValidationError,mixed} from 'yup'


export const useValidacionProducto = () => {
    
    //scehema validationFile
    const iSchemaFile=mixed()
    .test({
        name:'file-is-required',
        test:(file)=>Boolean(file),
        message:`Es necesario una imagen`,
        params:{nuevo:'lion'}})
        .test({
            name:'file-is-type',
            test:(file)=>file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type),
            message:'No es una imagen',
            params:{tipo:''}
        })

    //schema 
    const schema = object().shape({
        tipo:number().required().label("tipo"),
        id_subcategoria: number().required().label("Subcategoria"),
        id_subsubcategoria: number().optional().label("Subsubcategoria"),
        id_unidad_medida: number().required().label("Unidad medida"),
        id_tipo_producto: number().required().label("Tipo producto"),
        nombre: string().required().trim().uppercase().label("Nombre"),

        material:string().optional().trim().uppercase().label("Material"),
        medida1:string().optional().trim().uppercase().label("Media 1"),
        medida2:string().optional().trim().uppercase().label("Medida 2"),
        forma:string().optional().trim().uppercase().label("Forma"),
        tipo_cuerda:string().optional().trim().uppercase().label("Tipo cuerda"),
        otros:string().optional().trim().uppercase().label("Otros"),

        clave: string().required().trim().uppercase().label("Cantidad"),
        descripcion: string().required().trim().uppercase().label("Descricpion"),
        modelo: string().optional().trim().uppercase().label("Modelo"),
        presentaciones: array().of(object({unidad_medida:number(),cantidad:number()}).optional()).optional().label("Presentaciones"),
        marcas: array().of(number().optional()).optional().label("Marcas"),

        observacion_requisicion:string().optional().trim().uppercase().label("Observacion requisicion")
    })

    // objeto reactivo para guardar los mensajes de validacion
    const iErrors = reactive({
        tipo:"",
        id_subcategoria: "",
        id_subsubcategoria: "",
        id_unidad_medida: "",
        id_tipo_producto: "",
        nombre: "",

        material:"",
        medida1:"",
        medida2:"",
        forma:"",
        tipo_cuerda:"",
        otros:"",

        clave: "",
        descripcion: "",
        modelo: "",
        presentaciones: "",
        marcas: "",
        observacion_requisicion:""
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

    return { iValid, iErrors,iSchemaFile };
}