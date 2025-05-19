import {$axiosFinanzas as $axios} from '@/util/axios_instance'

export const getOrdenCompraService=async(id_pedido)=>{
    try {
        const {data,status}=await $axios.get(`/orden-compra/${id_pedido}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const allPedidosRevisadosService=async()=>{
    try {
        const {data,status}=await $axios.get('/orden-compra/pedidos-revisados')
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}


export const saveOrdenCompraService=async(p)=>{
    try {
        const {data,status}=await $axios.post('/orden-compra',p)
        return data;
    } catch (error) {
        throw Error("Error al intentar recuperar los pedidos")
    }
}








