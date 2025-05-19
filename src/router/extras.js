export default [
    {
        path: '/reporte-orden-trabajo-usuarios',
        name: 'reporte_orden_trabajo_usuarios',
        component: () => import(/* webpackChunkName: "reporte_orden_trabajo_usuarios" */ './../views/nuevo/view_reporte_orden_trabajo_socios.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-orden-trabajo-interno',
        name: 'reporte_orden_trabajo_interno',
        component: () => import(/* webpackChunkName: "view_reporte_orden_trabajo_interno" */ './../views/nuevo/view_reporte_orden_trabajo_interno.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/orden-trabajo-version2',
        name: 'orden_trabajo_version2',
        component: () => import(/* webpackChunkName: "orden-trabajo-version2" */ './../views/nuevo/view_orden_trabajo_version2.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/validacion-nuevo-ingreso-version2',
        name: 'view-proceso-validacion-nuevo-ingreso-version2',
        component: () => import(/* webpackChunkName: "validacion-nuevo-ingreso" */ './../views/nuevo/view_proceso_validacion_nuevo_ingreso_version2.vue'),
        props: true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-asistencia-colaborador-dia',
        name: 'reporteAsistenciaColaboradorDia',
        component: () => import(/* webpackChunkName: "reporte-asistencia-colaborador-dia" */ '@/views/reportes/view_reporte_asistencia_colaborador_by_dia.vue'),
        props:true,
        meta: { requiresAuth: true ,is_modulo:true}

      },
      {
        path: '/celebracion',
        name: 'celebracion',
        component: () => import(/* webpackChunkName: "celebracion" */ '@/views/nuevo/view_celebracion.vue'),
        props:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-asistencia-colaborador-revision',
        name: 'reporteAsistenciaColaboradorRevision',
        component: () => import(/* webpackChunkName: "reporte-asistencia-colaborador-revision" */ '@/views/reportes/view_reporte_asistencia_colaborador_revision.vue'),
        props:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      
      {
        path: '/revision-vacaciones',
        name: 'revisionVacaciones',
        component: () => import(/* webpackChunkName: "revision-vacaciones" */ '@/views/nuevo/view_revision_vacaciones.vue'),
        props:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/reporte-asistencia-colaborador-revision-final',
        name: 'reporteAsistenciaColaboradorRevisionFinal',
        component: () => import(/* webpackChunkName: "reporte-asistencia-colaborador-revision-final" */ '@/views/reportes/view_reporte_asistencia_colaborador_revision_final.vue'),
        props:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-vacaciones',
        name: 'reporteVacaciones',
        component: () => import(/* webpackChunkName: "reporte-vacaciones" */ '@/views/nuevo/view_reporte_vacaciones.vue'),
        props:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },

      {
        path: '/actividades-full-calendar',
        name: 'actividades_full_calendar',
        component: () => import(/* webpackChunkName: "celebracion" */ '@/views/nuevo/view_actividades.vue'),
        porps:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
     
      {
        path: '/reporte-formato-m8-by-accion',
        name: 'ReporteFormatoM8ByAccion',
        component: () => import(/* webpackChunkName: "celebracion" */ '@/views/nuevo/view_reporte_formato_m8_by_accion.vue'),
        porps:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      {
        path: '/reporte-altas-bajas-colaborador',
        name: 'ReporteAltasBajasColaborador',
        component: () => import(/* webpackChunkName: "reporte_altas_bjas_colaborador" */ '@/views/nuevo/view_reporte_altas_bajas_colaborador.vue'),
        porps:true,
        meta: { requiresAuth: true ,is_modulo:true}
      },
      
]