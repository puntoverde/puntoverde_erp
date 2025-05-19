import Vue from 'vue'
import Router from 'vue-router'
import catalogos from './catalogos'
import procesos from './procesos'
import reportes from './reportes'
import extras from './extras'
import dayjs from 'dayjs'
import view_finaliza_session from '../views/nuevo/view_finaliza_session.vue'
import view_sin_autorizacion from '../views/nuevo/view_sin_autorizacion.vue'

Vue.use(Router)

const router= new Router({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/finaliza-session',
      name: 'session-finalize',
      component:view_finaliza_session      
    },
    {
      path: '/sin-autorizacion',
      name: 'sin_autorizacion',
      component:view_sin_autorizacion      
    },
    ...catalogos,...procesos,...reportes,...extras
  ]
})

router.beforeEach((to,from,next)=>{

  
console.log('to:',to)

  
  if(!Boolean(to.name) || to.name=='session-finalize' || to.name=='sin_autorizacion')
  {
    next()
    return
  }
  
  let token=Vue.ls.get('token','')
  const [,data]=token.split('.')
  if(dayjs.unix(JSON.parse(atob(data))?.exp).isBefore(dayjs()))
  {
    next({name:'session-finalize'})
    return 
  }

  let menu_=Vue.ls.get('menu_',[])
  console.log(menu_)
  console.log(to.path,menu_.some(i=>to.path.endsWith(i.value)))
  if(!menu_.some(i=>to.path.endsWith(i.value)) && to.matched.some(record=>record.meta.is_modulo))
  {
    console.log("entra a sin autorizacion")
    next({name:'sin_autorizacion'})
    // next()
  }

  let protect=to.matched.some(record=>record.meta.requiresAuth)
  let logueado=Vue.ls.get('logueado',false)

 if(protect && logueado){
     next()
 }
 else if(protect && !logueado)
 {
   next({name:'login'})
 }
 else{
   next()
 }

})




export default router;