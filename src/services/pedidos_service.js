import {$axiosFinanzas as $axios} from '@/util/axios_instance'


export const allPedidos=async()=>{
    try {
        const {data,status}=await $axios.get('/pedido')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const createPedido=async(p)=>{
    try {
        const {data,status}=await $axios.post('/pedido',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const allProductosPedido=async(id_pedido)=>{
    try {
        const {data,status}=await $axios.get(`/pedido/${id_pedido}/producto`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findProductoByRequisicionProveedor=async(id_proveedor)=>{
    try {
        const {data,status}=await $axios.get(`/pedido/producto-requisicion-proveedor/${id_proveedor}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

//elimina el producto del pedido esto es antes de la revision
export const eliminarProductoPedido=async(id_producto_pedido)=>{
    try {
        const {data,status}=await $axios.put(`/pedido/eliminar-producto/${id_producto_pedido}`)
        return data;
    } catch (error) {
        
    }
}



export const agregarProductoPedido=async(id_pedido,producto)=>{
    try {
    const {data,status}=await $axios.post(`/pedido/producto-requisicion-proveedor/${id_pedido}`,{producto})   
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const saveImagenProducto=async(foto,clave)=>{
    const form = new FormData();
    form.append("foto", foto);
    form.append("clave", clave);
    try {
        const {data,status}=await $axios.post(`/producto/upload-foto`,form,{headers: { "Content-Type": "multipart/form-data" }})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const pedidoSinRevision=async()=>{
    try {
        const {data,status}=await $axios.get('/pedido/sin-revisar')
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const pedidoRevision=async(id_pedido)=>{
    try {
        const {data,status}=await $axios.get(`/pedido/revision/${id_pedido}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    } 
}

export const pedidoAceptarProducto=async(p)=>{
    try {
        const {data,status}=await $axios.post('/pedido/revision/aceptar-producto',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const pedidoRechazarProducto=async(p)=>{
    try {
        const {data,status}=await $axios.post('/pedido/revision/rechazar-producto',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const pedidoCambiarProducto=async(p)=>{
    try {
        const {data,status}=await $axios.post('/pedido/revision/cambio-producto',p)
        return data;
    } catch (error) {
        throw Error("es un error")
    }
}

export const pedidoCancelar=async()=>{
    try {
        const {data,status}=await $axios.put('/pedido/revision/cancelar',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const pedidoFinalizarRevisionService=async(id_pedido,p)=>{
    try {
        const {data,status}=await $axios.put(`/pedido/revision/${id_pedido}/finalizar`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const pedidoAgregarNotaService=async(id_pedido,p)=>{
    console.log(p.nota_file)
    try {
        const formData=new FormData()
        formData.append("nota",p.nota)
        formData.append("nota_file",p.nota_file)
        const {data,status}=await $axios.post(`/pedido/revision/${id_pedido}/nota`,formData,{ headers: { "Content-Type": "multipart/form-data" },})
        return data
    } catch (error) {
        
    }
}

export const pedidoAgregarFactura=async(id_pedido,p)=>{
    try {
        const formData=new FormData()
        formData.append("factura",p)        
        const {data,status}=await $axios.post(`/pedido/revision/${id_pedido}/factura`,formData,{ headers: { "Content-Type": "multipart/form-data" },})
        return data
    } catch (error) {
        
    }
}


export const cambiarProveedor=async(id_pedido_producto,id_proveedor)=>{
    try {
        const {data,status}=await $axios.put(`/pedido/revision/proveedor`,{id_pedido_producto,id_proveedor})
        return data
    } catch (error) {
        
    }
}

export const detalleProductosLibresService=async()=>{
    try {
        const {data,status}=await $axios.get(`/pedido/detalle-productos-libres`)
        return data
    } catch (error) {
        
    }
}


export const cambiarMarcaService=async(id_producto_requisicion,id_marca)=>{
    try {
        const {data,status}=await $axios.put(`/pedido/cambio-marca`,{id_producto_requisicion,id_marca})
        return data
    } catch (error) {
        
    }
}
