export default [
    {
        path: '/accion',
        name: 'accion',
        component: () => import(/* webpackChunkName: "acciones" */ './../views/catalogos/view_catalogo_acciones.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      /*{
        path: '/servicios',
        name: 'servicios',*/
        //component: () => import(/* webpackChunkName: "servicios" */ './../views/reportes/servicios.vue')
      /*},*/

      //detalle accion no exiaste ya
      // {
      //   path: '/detalle_accion',
      //   name: 'detalle',
      //   component: () => import(/* webpackChunkName: "detalle_accion" */ './../views/catalogos/detalle_accion.vue'),
      //   props: true,
      //   meta: { requiresAuth: true }
      // },
     //igual se da de baja form_socio no se esta seguro si aun funciona
      // {
      //   path: '/form_socio',
      //   name: 'form_socio',
      //   component: () => import(/* webpackChunkName: "formSocios" */ './../views/catalogos/formAltaSocios.vue'),
      //   props: true,
      //   meta: { requiresAuth: true }
      // },
      /**{
        // path: '/form_dueno',
        // name: 'form_dueno',*/
        //component: () => import(/* webpackChunkName: "formDuenos" */ './../views/catalogos/formDueno.vue'),
        /**props: true,
        meta: { requiresAuth: true }
      },*/ 
      {
        path: '/catalogo_documentos',
        name: 'catalogo_documentos',
        component: () => import(/* webpackChunkName: "docu" */ './../views/catalogos/view_catalogo_documentos.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/cuotas',
        name: 'cuotas',
        component: () => import(/* webpackChunkName: "catalogo_cuotas" */ './../views/catalogos/view_catalogo_conceptos.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/form_concepto',
        name: 'FormConcepto',
        component: () => import(/* webpackChunkName: "form_cuotas" */ './../views/catalogos/view_form_concepto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:false}
      },
      //parentesco creo ni se usa por eso esta comentado
      {
        path: '/parentesco',
        name: 'parentesco',
        component: () => import(/* webpackChunkName: "parenteco" */ './../views/catalogos/view_catalogo_parentesco.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/profesion',
        name: 'profesion',
        component: () => import(/* webpackChunkName: "profesion" */ './../views/catalogos/view_catalogo_profesion.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/apartados',
        name: 'apartados',
        component: () => import(/* webpackChunkName: "apartado" */ './../views/catalogos/view_apartados.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/catalogo-productos',
        name: 'CatalogoProductos',
        component: () => import(/* webpackChunkName: "catalogo_productos" */ './../views/catalogos/view_catalogo_producto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/accion-detalle',
        name: 'AccionDetalle',
        component: () => import(/* webpackChunkName: "accion-detalle" */ './../views/catalogos/view_accion_detalle.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:false},
        beforeEnter: (to, from, next) => {
          if(from.name==='accion' || from.name==='FormDueno' || from.name==='FormSocio') next();
          else next({name:'accion'})
        }
      },

      {
        path: '/formulario-accionista',
        name: 'FormDueno',
        component: () => import(/* webpackChunkName: "FormDuenos" */ './../views/catalogos/view_form_dueno.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:false},
        beforeEnter: (to, from, next) => {
          if(from.name==='AccionDetalle') next();
          else next({name:'accion'})
        }
      },

      {
        path: '/formulario-socio',
        name: 'FormSocio',
        component: () => import(/* webpackChunkName: "FormSocios" */ './../views/catalogos/view-form-socio.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:false},
        beforeEnter: (to, from, next) => {
          if(from.name==='AccionDetalle') next();
          else next({name:'accion'})
        }
      },

      {
        path: '/cancelar-cargo',
        name: 'cancelarCargo',
        component: () => import(/* webpackChunkName: "cancelar-cargo" */ './../views/procesos/view_proceso_eliminar_cargo.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
       
        
      },

      //se elimina temporal porque no se sabe si lleva algo...
      // {
      //   path: '/cancelar-descuento',
      //   name: 'cancelarDescuento',
      //   component: () => import(/* webpackChunkName: "cancelar-descuento" */ './../views/procesos/procesoEliminarDescuento.vue'),
      //   props: true,
      //   meta: { requiresAuth: true },               
      // },

      {
        path: '/formulario-colaborador',
        name: 'CatalogoColaborador',
        component: () => import(/* webpackChunkName: "formulario-colaborador" */ './../views/catalogos/view_catalogo_colaborador.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true} 
      },

    //  {
    //    path: '/catalogo_productos_almacen',
    //    name: 'CatalogoProductosAlmacen',
    //    component: () => import(/* webpackChunkName: "catalogo_productos_almacen" */ './../views/catalogos/catalogo_productos_almacen.vue'),
    //    props: true,
    //    meta: { requiresAuth: true },               
    //  },

     {
       path: '/catalogo_categoria_almacen',
       name: 'CatalogoCategoriaAlmacen',
       component: () => import(/* webpackChunkName: "catalogo_categoria_almacen" */ './../views/catalogos/view_catalogo_categoria_almacen.vue'),
       props: true,
       meta: { requiresAuth: true ,is_modulo:true}
     },

     {
      path: '/catalogo-proveedor',
      name: 'CatalogoProveedor',
      component: () => import(/* webpackChunkName: "catalogo_proveedor" */ './../views/catalogos/view_catalogo_proveedor.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true}
    }, 

    {
      path: '/pedido-almacen',
      name: 'PedidosAlmacen',
      component: () => import(/* webpackChunkName: "pedidos-almacen" */ './../views/catalogos/view_pedidos_almacen.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true} 
    },
    
    {
      path: '/catalogo-locker',
      name: 'catalogo_locker',
      component: () => import(/* webpackChunkName: "catalogo_locker" */ './../views/catalogos/view_catalogo_locker.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true} 
    },

    {
      path: '/alta-dias-asueto',
      name: 'view_alta_dias_asueto',
      component: () => import(/* webpackChunkName: "alta-dias-asueto" */ './../views/catalogos/view-alta-dias-asueto.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true} 
    },
    
    

      
]