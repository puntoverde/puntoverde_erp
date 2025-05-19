// axios.interceptors.request.use(function (config) {
//     // Haz algo antes que la petición se ha enviada
//     return config;
//   }, function (error) {
//     // Haz algo con el error de la petición
//     return Promise.reject(error);
//   });
import { useEventBus } from '@vueuse/core'
import dayjs from 'dayjs'

const bus = useEventBus('news')


export const token_interceptor=(request)=>{
   
      let token=JSON.parse(sessionStorage.getItem('vuejs__token')??'{}')?.value
      const [,data]=token.split('.')
      if(dayjs.unix(JSON.parse(atob(data))?.exp).isBefore(dayjs()))
      {
        bus.emit('The Tokyo Olympics has begun')
      }
    
    console.log('token--',JSON.parse(sessionStorage.getItem('vuejs__token')??'{}')?.value)
    console.log('valid:',dayjs.unix(JSON.parse(atob(data))?.exp).isBefore(dayjs()))


    request.headers.common['Authorization'] = JSON.parse(sessionStorage.getItem('vuejs__token')??'{}')?.value;
    request.headers.common['perfil'] = JSON.parse(sessionStorage.getItem('vuejs__perfil')??'{}')?.value?.cve_perfil;
    
 return request;
}