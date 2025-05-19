export default [
    {
        path: '/reporte_acceso',
        name: 'reporte_acceso',
        component: () => import(/* webpackChunkName: "reporte_acceso" */ './../views/reportes/view_reporte_acceso.vue'),
        props: true,
      },
      {
        path: '/reporte_acceso_v2',
        name: 'reporte_acceso_v2',
        component: () => import(/* webpackChunkName: "reporte_acceso_v2" */ './../views/reportes/view_reporte_acceso_v2.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_estacionamiento',
        name: 'reporte_estacionamiento',
        component: () => import(/* webpackChunkName: "reporte_estacionamiento" */ './../views/reportes/view_reporte_estacionamiento.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      //se cmenta reporte_preofesiones porque no se usa pero igual no se sabe si se va ausar
      // {
      //   path: '/reporte_profesiones',
      //   name: 'reporte_profesiones',
      //   component: () => import(/* webpackChunkName: "reporte_profesiones" */ './../views/reportes/reporte_profesiones.vue'),
      //   props: true,
      // },
      //se cmenta reporte_vehiculos_registrados porque no se usa pero igual no se sabe si se va ausar
      // {
      //   path: '/reporte_vehiculos_registrados',
      //   name: 'reporte_vehiculos_registrados',
      //   component: () => import(/* webpackChunkName: "reporte_vehiculos_registradoss" */ './../views/reportes/reporte_vehiculos_registrados.vue'),
      //   props: true,
      // },
      {
        path: '/reporte_acceso_graficas',
        name: 'reporte_acceso_graficas',
        component: () => import(/* webpackChunkName: "reporte_acceso_graficas" */ './../views/reportes/view_reporte_acceso_graficas.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_apartado',
        name: 'reporte_apartado',
        component: () => import(/* webpackChunkName: "reporte_apartado" */ './../views/reportes/view_reporte_apartados.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {path: '/reporte_apartados_v2',
      name: 'reporteApartados',
      component: () => import(/* webpackChunkName: "reporte_apartados_v2" */ './../views/reportes/view_reporte_apartados_v2.vue'),
      props: true,
      meta: { requiresAuth: true ,is_modulo:true} },
      
      {
        path: '/reporte_socios',
        name: 'reporte_socios',
        component: () => import(/* webpackChunkName: "reporte_socios" */ './../views/reportes/view_reporte_socios.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_pagos',
        name: 'reporte_pagos',
        component: () => import(/* webpackChunkName: "reporte_pagos" */ './../views/reportes/view_reporte_pagos.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_acceso_invitados',
        name: 'reporte_acceso_invitados',
        component: () => import(/* webpackChunkName: "reporte_acceso_invitados" */ './../views/reportes/view_reporte_acceso_invitados.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_disciplinario',
        name: 'reporte_disciplinario',
        component: () => import(/* webpackChunkName: "reporte_disciplinario" */ './../views/reportes/view_reporte_disciplinario.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      //se pospone reporte encuensta no se sabe si se llege a utilizar no esta gargaodo a los modulos
      // {
      //   path: '/reporte_encuesta',
      //   name: 'reporte_encuesta',
      //   component: () => import(/* webpackChunkName: "reporte_encuesta" */ './../views/reportes/reporte_encuesta.vue'),
      //   meta: { requiresAuth: true ,is_modulo:true}
      // },
      {
        path: '/reporte_corte_caja',
        name: 'reporte_corte_caja',
        component: () => import(/* webpackChunkName: "reporte_corte_caja" */ './../views/reportes/view_reporte_corte_caja.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_pago_concepto',
        name: 'repoterAccionConcepto',
        component: () => import(/* webpackChunkName: "reporte_pago_concepto" */ './../views/reportes/view_reporte_pago_concepto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_cargo_pago_concepto',
        name: 'repoterCargoAccionConcepto',
        component: () => import(/* webpackChunkName: "reporte_cargo_pago_concepto" */ './../views/reportes/view_reporte_cargo_pago_concepto.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte_pago_concentrado',
        name: 'repoterPagoConcentrado',
        component: () => import(/* webpackChunkName: "reporte_pago_concentrado" */ './../views/reportes/view_reporte_pago_concentrado.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },      
      {
        path: '/reporte_descuento',
        name: 'repoteDescuento',
        component: () => import(/* webpackChunkName: "reporte_descuento" */ './../views/reportes/view_reporte_descuentos.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      //se porpone si esta pero no esta agregad alos modulos y no se sabe si se usa
      // {
      //   path: '/reporte_facturacion',
      //   name: 'repoteFacturacion',
      //   component: () => import(/* webpackChunkName: "reporte_facturacion" */ './../views/reportes/reporte_facturacion.vue'),
      //   props: true,
      // },
      {
        path: '/reporte-registro-invitados',
        name: 'ReporteRegistroInvitado',
        component: () => import(/* webpackChunkName: "reporte-registro-invitados" */ '@/views/reportes/view_reporte_registro_invitados.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
       {
         path: '/reporte-descuento-cancelado',
         name: 'ReporteDescuentoCancelado',
         component: () => import(/* webpackChunkName: "reporte-descuento-cancelado" */ '@/views/reportes/view_reporte_descuento_cancelado.vue'),
         meta: { requiresAuth: true ,is_modulo:true}
       },
       {
         path: '/reporte-cargo-cancelado',
         name: 'ReporteCargoCancelado',
         component: () => import(/* webpackChunkName: "reporte-cargo-cancelado" */ '@/views/reportes/view_reporte_cargo_cancelado.vue'),
         meta: { requiresAuth: true ,is_modulo:true}
       },

      //  se cambio por la version que le sigue abajo la v4
      
      {
        path: '/reporte-pagos-comercial',
        name: 'ReportePagosComercial',
        component: () => import(/* webpackChunkName: "reporte_pagos_comercial" */ '@/views/reportes/reporte_pagos_comercial.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },


      {
        path: '/reporte-pagos-comercial-v4',
        name: 'ReportePagosComercialV4',
        component: () => import(/* webpackChunkName: "reporte_pagos_comercial_v4" */ '@/views/reportes/view_factura_comercial_v4.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-lockers',
        name: 'ReporteLocker',
        component: () => import(/* webpackChunkName: "reporte_lockers" */ '@/views/reportes/view_reporte-locker.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-lockers-simple',
        name: 'ReporteLockerSimple',
        component: () => import(/* webpackChunkName: "reporte_lockers-simple" */ '@/views/reportes/view_reporte_locker_simple.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-acciones-historico',
        name: 'ReporteAccionesHistorico',
        component: () => import(/* webpackChunkName: "reporte-acciones-historico" */ '@/views/reportes/view_reporte_acciones_historico.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-socios-historico',
        name: 'ReporteSociosHistorico',
        component: () => import(/* webpackChunkName: "reporte-socios-historico" */ '@/views/reportes/view_reporte_socios_historico.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-asistencia-colaborador',
        name: 'reporteAsistenciaColaborador',
        component: () => import(/* webpackChunkName: "reporte-asistencia-colaborador" */ '@/views/reportes/view_reporte_asistencia_colaborador.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-pago-cancelado',
        name: 'reportePagoCancelado',
        component: () => import(/* webpackChunkName: "reporte-pago-cancelado" */ '@/views/reportes/view_reporte_pago_cancelado.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-pago-detalle',
        name: 'reportePagoDetalle',
        component: () => import(/* webpackChunkName: "reporte-pago-detalle" */ '@/views/reportes/view_reporte_pago_detalle.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-comercial-cancelado',
        name: 'reporteComercialCancelado',
        component: () => import(/* webpackChunkName: "reporte-comercial-cancelado" */ '@/views/reportes/view_reporte_comercial_cancelado.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-apartado-estatus',//Reporte para ver los apartados y si se cancelo por salida del usuario
        name: 'reporteApartadoEstatus',
        component: () => import(/* webpackChunkName: "reporte-apartado-estatus" */ '@/views/reportes/view_reporte_apartados_estatus.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-locker-general',
        name: 'reporteLockerGeneral',
        component: () => import(/* webpackChunkName: "reporte-locker-general" */ '@/views/reportes/view_reporte_locker_general.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-locker-liberar',
        name: 'reporteCandadoLocker',
        component: () => import(/* webpackChunkName: "reporte-locker-liberar" */ '@/views/reportes/view_reporte_candado_locker.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-sat-xml',
        name: 'reporte_sat_xml',
        component: () => import(/* webpackChunkName: "reporte-sat-xml" */ '@/views/reportes/view_reporte_sat_xml.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-inscripciones',
        name: 'reporte_inscripciones',
        component: () => import(/* webpackChunkName: "reporte-inscripciones" */ '@/views/reportes/view_reporte_inscripciones.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/apartados-envivo',
        name: 'apatadosEnvivo',
        component: () => import(/* webpackChunkName: "apartados-envivo" */ '@/views/reportes/view_apartado.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-historial-medico',
        name: 'ReporteHistorialMedico',
        component: () => import(/* webpackChunkName: "reporte-historial-medico" */ '@/views/reportes/view_reporte_historial_medico.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-formato-m8',
        name: 'ReporteFormatoM8',
        component: () => import(/* webpackChunkName: "reporte-reporte-m8" */ '@/views/reportes/view_reporte_formato_m8.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-apartados-envivo',
        name: 'ReporteApartadosEnvivo',
        component: () => import(/* webpackChunkName: "reporte-apartados-envivo" */ '@/views/reportes/view_reporte_apartados_envivo.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-almacen',
        name: 'reporte_almacen',
        component: () => import(/* webpackChunkName: "reporte-almacen" */ '@/views/reportes/view_reporte_almacen.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-requisicion',
        name: 'reporte_requisicion',
        component: () => import(/* webpackChunkName: "reporte-requisicion" */ '@/views/reportes/view_reporte_requisicion.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-pedido',
        name: 'reporte_pedido',
        component: () => import(/* webpackChunkName: "reporte-pedido" */ '@/views/reportes/view_reporte_pedido.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-almacen-salida',
        name: 'reporte_almacen_salida',
        component: () => import(/* webpackChunkName: "reporte-almacen_salida" */ '@/views/reportes/view_reporte_almacen_salida.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-general',
        name: 'view_reporte_general',
        component: () => import(/* webpackChunkName: "view-reporte-general" */ '@/views/reportes/view_reporte_general.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-producto-requisicion',
        name: 'view_reporte_producto_requisicion',
        component: () => import(/* webpackChunkName: "view-reporte-producto_requisicion" */ '@/views/reportes/view_reporte_producto_requisicion.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-producto-requisicion-revision',
        name: 'view_reporte_producto_requisicion_revision',
        component: () => import(/* webpackChunkName: "view-reporte-producto_requisicion_revision" */ '@/views/reportes/view_reporte_producto_requisicion_revision.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-producto-requisicion-cuadricula',
        name: 'view_reporte_producto_requisicion_cuadricula',
        component: () => import(/* webpackChunkName: "view-reporte-producto_requisicion_cuadricula" */ '@/views/reportes/view_reporte_producto_requisicion_cuadricula.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-estadistica-lockers',
        name: 'view_reporte_estadistica_lockers',
        component: () => import(/* webpackChunkName: "view_reporte_estadistica_lockers" */ '@/views/reportes/view_reporte_estadistica_lockers.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      },            
      {
        path: '/reporte-jugadores-futbol',
        name: 'view_reporte_estadistica_lockers',
        component: () => import(/* webpackChunkName: "view_reporte_equipo_futbol_jugadores" */ '@/views/reportes/view_reporte_equipo_futbol_jugadores.vue'),
        meta: { requiresAuth: true ,is_modulo:true}
      
      },
      {
        path: '/reporte_pago_concepto_deporte',
        name: 'repoterAccionConceptoDeporte',
        component: () => import(/* webpackChunkName: "reporte_pago_concepto_deporte" */ './../views/reportes/view_reporte_pago_concepto_deporte.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },        
      {
        path: '/reporte-concentrado-incidencias',
        name: 'repoterConcentradoIncidencias',
        component: () => import(/* webpackChunkName: "reporte_concentrado_incidencias" */ '@/views/reportes/view_reporte_incidencias_concentrado.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },        
      {
        path: '/reporte-orden-trabajo',
        name: 'repoterConcentradoIncidencias',
        component: () => import(/* webpackChunkName: "reporte_orden_trabajo" */ '@/views/reportes/view_reporte_orden_trabajo.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },        
      {
        path: '/reporte-actividades-orden-trabajo',
        name: 'reporte_actividades_orden_trabajo',
        component: () => import(/* webpackChunkName: "reporte_orden_trabajo" */ '@/views/reportes/actividades_orden_trabajo_reporte.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },      
      {
        path: '/reporte-libro-accionista',
        name: 'reporte_libro_accionista',
        component: () => import(/* webpackChunkName: "reporte_libro_accionista" */ '@/views/reportes/view_reporte_libro_accionistas.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },      
      
]