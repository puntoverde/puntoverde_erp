import dayjs from "dayjs"

export default {
    state:{
        cve_accion:0,
        folio:0,
        numero_accion:"",
        idpago:0,
        id_datos_facturacion:0,
        fecha_pago:dayjs().format("YYYY-MM-DD"),
        forma_pago:0,
        forma_pago_text:"",
        lst_uso_cfdi:[],
        lst_forma_pago:[],
        lst_regimen_fiscal:[],
        monto:0
    },
    getters:{
        getUsoCfdiByRegimen:(state)=>(payload)=>state.lst_uso_cfdi.filter(i=>i.regimenes.includes(payload))        
    },
    mutations:{
        SETCVEACCION(state,payload)
        {
            state.cve_accion=payload
        },
        SETFOLIO(state,payload)
        {
            state.folio=payload
        },
        SETNUMEROACCION(state,payload)
        {
            state.numero_accion=payload
        },
        SETIDPAGO(state,payload)
        {
            state.idpago=payload
        },
        SETIDDATOSFACTURACION(state,payload)
        {
            state.idpago=payload
        },
        SETFECHAPAGO(state,payload)
        {
            state.fecha_pago=payload
        },
        SETFORMAPAGO(state,payload)
        {
            state.forma_pago=payload
        },
        SETFORMAPAGOTEXT(state,payload)
        {
            state.forma_pago_text=payload
        },
        SETLSTUSOCFDI(state,payload)
        {
           state.lst_uso_cfdi=payload;
        },
        SETLSTFORMAPAGO(state,payload)
        {
           state.lst_forma_pago=payload;
        },
        SETLSTREGIMENFISCAL(state,payload)
        {
           state.lst_regimen_fiscal=payload;
        },
        SETMONTO(state,payload)
        {
           state.monto=payload;
        }
    },
    actions:{
        async fetchGetUsoCfdi(context)
        {
            const $axios = this._vm.$axiosFinanzas;
            let { data, status } = await $axios.get("pago/uso-cfdi");
            const usoCfdi=data.map(i=>({clave:i.clave,descripcion:i.descripcion,regimenes:i.regimenes.split(',')}))
            context.commit("SETLSTUSOCFDI",usoCfdi)
        },
        async fetchGetFormaPago(context) {
            const $axios = this._vm.$axiosFinanzas;
            let { data, status } = await $axios.get("pago/forma-pago");
            context.commit("SETLSTFORMAPAGO",data)
          },
        async fetchGetRegimenFiscal(context) {
            const $axios = this._vm.$axiosFinanzas;
            let { data, status } = await $axios.get("datos-facturacion/regimen-fiscales");
            context.commit("SETLSTREGIMENFISCAL",data)
          }
    }
}