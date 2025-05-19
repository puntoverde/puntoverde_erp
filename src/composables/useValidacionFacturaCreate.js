import { reactive } from "vue"
import _set from 'lodash/set'
import objectDotKeys  from 'object-dot-keys'
import { object, number,string,boolean,array, ValidationError,setLocale} from 'yup'
import {es} from 'yup-locales'
setLocale(es)


export const useValidacionFacturaCreate= () => {
    //schema 

    const  schema = object().shape({
        flag: boolean().default(false),
        accion: number().required().positive(),
        idpago: number().required().positive(),
        cliente: object().shape({
          rfc: string().required().max(13).min(12).label("rfc"),
          razonSocial: string().required().label("razon social"),
          correo: string().required().email().label("correo"),
          metodoPago: string().required().label("metodo pago"),
          usoCFDI: string().required().label("uso cfdi"),
          regimenFiscal: string().required().label("regimen fiscal"),
        }),
        domicilio: object().shape({
          calle: string().required().label("calle"),
          numExt: string().required().label("numero exterior"),
          colonia: string().required().label("colonia"),
          cp: string().required().length(5).label("codigo postal"),
          municipio: string().required().label("municipio"),
          estado: string().required().label("estado"),
          pais: string().required().label("pais"),
        }),
        movimientos: array()
          .required()
          .min(1)
          .of(
            object().shape({
              codProducto: number().required().label("codigo producto"),
              unidades: number().required().min(1).label("unidades"),
              importe: number().required().label("importe"),
              descuento: number().required().label("descuento"),
            })
          ),
        // fecha_pago:date().required().label("fecha de pago"),
        fecha_pago: string().required().label("fecha de pago"),
        folio_pv: string().required().label("folio pago"),
        observaciones: string().required().label("observaciones"),
        pertenece: string()
          .when("flag", { is: true, then: (s) => s.required() })
          .label("socio registrar"),
        id_dato_factura: string()
          .when("flag", { is: false, then: (s) => s.required() })
          .label("id datos de facturacion"),
      });
  

    const iErrors = reactive({
      flag:undefined,
      accion:undefined,
      idpago:undefined,
      cliente:{
        rfc:undefined,
        razonSocial:undefined,
        correo:undefined,
        metodoPago:undefined,
        usoCFDI:undefined,
        regimenFiscal:undefined,
      },
      domicilio: {
        calle:undefined,
        numExt:undefined,
        colonia:undefined,
        cp:undefined,
        municipio:undefined,
        estado:undefined,
        pais:undefined,
      },
      movimientos: undefined,
      fecha_pago:undefined,
      folio_pv:undefined,
      observaciones:undefined,
      pertenece: undefined,
      id_dato_factura: undefined   
      });

    //accion que se encarga del proceso de validacion
    //recibe un objeto de tipo IRequestDomicilio y regresa una promesa del mismo tipo
    const iValid = async (i) => {

        //limpia el objecto reactivo de tipo IRequestDomicilioValidationError
        // Object.entries(iErrors).forEach(([key]) => _set(iErrors,key,undefined));
        // for (const [key, value] of Object.entries(iErrors)) {
        //   console.log(`${key}: ${value} : ${typeof value}`);
        //   if(typeof value=='object')
        //   {
        //     Object.entries(iErrors[key]).forEach(([key_]) => iErrors[key][key_] = undefined);
        //   }
        //   else{
        //     iErrors[key]=undefined
        //   }
        // }

        
        objectDotKeys(iErrors).forEach(path=>_set(iErrors,path,undefined))

        try {
            //regresa el tipo IRequestDomicilio ya parseado por yup y usa abortEarly:false(para mostrar todos los errores en el catch)
            return await schema.validate(i, { abortEarly: false })
        } catch (error) {
            console.error(error)

            //si error es una instancia de ValidationError y si su name es 'ValidationError' entra al if
            if (error instanceof ValidationError && error.name === "ValidationError") {
                //llena el objeto de tipo IRequestDomicilioValidationError con los mensajes de validacion
                error.inner.forEach(({ path, message }) => _set(iErrors,path,message))
                console.log('inner error->',error.inner)
            }
            //regresa un nuevo error con mensaje personalizado o podria solo regresar el mismo error(throw error) que es una intancia de ValidationError 
            throw error
        }
        finally{
          console.log("iErrors:",iErrors)
        }
    }

    // const iClear=()=>{
    //   for (const [key, value] of Object.entries(iErrors)) {
    //     console.log(`${key}: ${value} : ${typeof value}`);
    //     if(typeof value=='object')
    //     {
    //       Object.entries(iErrors[key]).forEach(([key_]) => iErrors[key][key_] = undefined);
    //     }
    //     else{
    //       iErrors[key]=undefined
    //     }
    //   }
    // }

    const iClear=()=>objectDotKeys(iErrors).forEach(path=>_set(iErrors,path,undefined))

    return { iValid, iErrors, iClear };
}