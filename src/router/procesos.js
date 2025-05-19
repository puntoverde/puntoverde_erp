export default [
    {
        path: '/toallas',
        name: 'toallas',
        component: () => import(/* webpackChunkName: "formDuenos" */ './../views/catalogos/view_toallas.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      }, 
      
      //en invitados osn las pulseras
      // {
      //   path: '/invitados',
      //   name: 'invitados',
      //   component: () => import(/* webpackChunkName: "repo_socios" */ './../views/catalogos/invitados.vue'),
      //   props: true,
      // },
      {
        path: '/moduloUsuario',
        name: 'modulousuario',
        component: () => import(/* webpackChunkName: "modulo_usuario" */ './../views/catalogos/view-grupo-seguridad.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
       {
         path: '/facturacion',
         name: 'facturacion',
         component: () => import(/* webpackChunkName: "facturacion" */ './../views/catalogos/view_catalogo_facturacion.vue'),
         props: true,
         meta: { requiresAuth: true ,is_modulo:true}
       }, 
       //no se sabe se se usa       
      //  {
      //    path: '/subir_documentos',
      //    name: 'subir_documentos',
      //    component: () => import(/* webpackChunkName: "subirdoc" */ './../views/procesos/subir_documentos.vue'),
      //    props: true,
      //  },
      {
        path: '/aplicar_descuento',
        name: 'aplicarDescuento',
        component: () => import(/* webpackChunkName: "descuentos" */ './../views/procesos/view_aplicar_descuento.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/cancelar_pago',
        name: 'cancelarPago',
        component: () => import(/* webpackChunkName: "descuentos" */ './../views/procesos/view_cancelar_pago.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      

      {path: '/accion_recepcion',
      name: 'accionRecepcion',
      component: () => import(/* webpackChunkName: "accion_recepcion" */ './../views/catalogos/view_catalogo_acciones_recepcion.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true} },        
      
      {path: '/detalle_accion_recepcion',
      name: 'detalleAccionRecepcion',
      component: () => import(/* webpackChunkName: "detalle_accion_recepcion" */ './../views/catalogos/view_detalle_accion_recepcion.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:false} },        

      {path: '/auto_usuario',
      name: 'AutoUsuario',
      component: () => import(/* webpackChunkName: "autos_usuario" */ './../views/procesos/view_catalogo_autos.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true} }, 
      {
        path: '/form-alta-invitados',
        name: 'FormAltaInvitados',
        component: () => import(/* webpackChunkName: "formInvitados" */ './../views/catalogos/view_alta_invitados.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
        // meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/form-baja-invitados',
        name: 'FormBajaInvitados',
        component: () => import(/* webpackChunkName: "formInvitados" */ './../views/catalogos/view_baja_invitados.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
        // meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/asignar-locker',
        name: 'AsignarLockers',
        component: () => import(/* webpackChunkName: "asignar_lockers" */ './../views/procesos/view_asignar_lockers.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
        // meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/asignar-locker-masivo',
        name: 'AsignarLockersMasivo',
        component: () => import(/* webpackChunkName: "asignar_lockers_masivo" */ './../views/procesos/view_asignar_lockers_masivo.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
        // meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/cambiar_forma_pago',
        name: 'CambiarFormaPago',
        component: () => import(/* webpackChunkName: "cambiar_forma_pago" */ './../views/procesos/view_cambio_forma_pago.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/torneo-futbol',
        name: 'TorneoFutbol',
        component: () => import(/* webpackChunkName: "torneo_futbol" */ './../views/procesos/view_torneos_futbol.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/equipo-futbol',
        name: 'EquipoFutbol',
        component: () => import(/* webpackChunkName: "equipo_futbol" */ './../views/procesos/view_equipo_futbol.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      //se comenta por que no realiza ninguna funcionalidad
      // {
      //   path: '/usuario-observaciones',
      //   name: 'UsuarioOrservaciones',
      //   component: () => import(/* webpackChunkName: "usuario_observaciones" */ './../views/procesos/agregarObservaciones.vue'),
      //   props: true,
      // },
      {
        path: '/candado-locker',
        name: 'CandadoLocker',
        component: () => import(/* webpackChunkName: "candado-locker" */ './../views/procesos/view_candado_locker.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/registro-prospecto',
        name: 'RegistroProspecto',
        component: () => import(/* webpackChunkName: "registro-prospecto" */ './../views/procesos/view_registro_prospecto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/revision-prospecto',
        name: 'RevisionProspecto',
        component: () => import(/* webpackChunkName: "revision-prospecto" */ './../views/procesos/view_revision_prospecto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/examen-medico-prospecto',
        name: 'ExamenMedicoProspecto',
        component: () => import(/* webpackChunkName: "examen-medico-prospecto" */ './../views/procesos/view_examen_medico_prospecto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/historial-medico-socios',
        name: 'HistorialMedico',
        component: () => import(/* webpackChunkName: "historial-medico-socios" */ './../views/procesos/view_historial_medico.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/observacion-meta-deporte',
        name: 'ObservacionMetaDeporte',
        component: () => import(/* webpackChunkName: "observacion-meta-deporte" */ './../views/procesos/view_observacion_meta_deporte.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/formato-m8',
        name: 'formato_m8',
        component: () => import(/* webpackChunkName: "formato-m8" */ './../views/procesos/view_formato_m8.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/requisicion',
        name: 'requisicion',
        component: () => import(/* webpackChunkName: "requisicion" */ './../views/procesos/view_requisicion.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/requisicion-producto',
        name: 'requisicion_producto',
        component: () => import(/* webpackChunkName: "requisicion-producto" */ './../views/procesos/view_requisicion_producto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/pedido-producto',
        name: 'pedido_producto',
        component: () => import(/* webpackChunkName: "pedido-producto" */ './../views/procesos/view_pedido_producto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/pedido-revision',
        name: 'pedido_revision',
        component: () => import(/* webpackChunkName: "revision-pedido" */ './../views/procesos/view_revision_pedido.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/orden-compra',
        name: 'orden_compra',
        component: () => import(/* webpackChunkName: "orden-compra" */ './../views/procesos/view_orden_compra.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/almacen-entrada',
        name: 'almacen_entrada',
        component: () => import(/* webpackChunkName: "almacen-entrada" */ './../views/procesos/view_almacen_entradas.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/almacen-salidas',
        name: 'almacen_salidas',
        component: () => import(/* webpackChunkName: "almacen-salida" */ './../views/procesos/view_almacen_salidas.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/validacion-nuevo-ingreso',
        name: 'view-proceso-validacion-nuevo-ingreso',
        component: () => import(/* webpackChunkName: "validacion-nuevo-ingreso" */ './../views/procesos/view_proceso_validacion_nuevo_ingreso.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/cortes-almacen',
        name: 'cortes_almacen',
        component: () => import(/* webpackChunkName: "cortes_almacen" */ './../views/procesos/view_proceso_cortes_almacen.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/revision-retardos',
        name: 'revision_retardo',
        component: () => import(/* webpackChunkName: "revision_retardo" */ './../views/procesos/view_revision_retardos.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/orden-trabajo',
        name: 'orden_trabajo',
        component: () => import(/* webpackChunkName: "orden_trabajo" */ './../views/procesos/view_orden_trabajo.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      
      {
        path: '/revision-incidencias',
        name: 'revision_incidencias',
        component: () => import(/* webpackChunkName: "revision_incidencias" */ './../views/procesos/view_incidencias.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/alta-vacaciones-permisos',
        name: 'alta_vacaciones_permisos',
        component: () => import(/* webpackChunkName: "alta_vacaciones_permisos" */ './../views/procesos/view_alta_vacaciones_permisos.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/actividades-orden-trabajo',
        name: 'actividades_orden_trabajo',
        component: () => import(/* webpackChunkName: "actividades-orden-trabajo" */ './../views/procesos/actividades_orden_trabajo.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/actividades-orden-trabajo-futuras',
        name: 'actividades_orden_trabajo_futuras',
        component: () => import(/* webpackChunkName: "actividades-orden-trabajo" */ './../views/procesos/actividades_orden_trabajo_futuras.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/validacion-nuevo-dueno',
        name: 'proceso_validacion_nuevo_dueno',
        component: () => import(/* webpackChunkName: "proceso-validacion-nuevo-dueno" */ './../views/procesos/view_proceso_validacion_nuevo_dueno.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },


      
]