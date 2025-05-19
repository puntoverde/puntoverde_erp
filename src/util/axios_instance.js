import axios from 'axios'
import {token_interceptor} from './axios_interceptor'

export const $axios=axios.create({baseURL:import.meta.env.VITE_APP_LEGAL_API})
const $axios_token=axios.create({baseURL:import.meta.env.VITE_APP_LEGAL_API})
$axios_token.interceptors.request.use(token_interceptor)

export const $axiosFinanzas = axios.create({ baseURL: import.meta.env.VITE_APP_FINANZAS_API }); //
const $axiosFinanzas_token = axios.create({ baseURL: import.meta.env.VITE_APP_FINANZAS_API })
$axiosFinanzas_token.interceptors.request.use(token_interceptor); //

export const $axiosRh = axios.create({ baseURL: import.meta.env.VITE_APP_RH_API }); //
const $axiosRh_token = axios.create({ baseURL: import.meta.env.VITE_APP_RH_API })
$axiosRh_token.interceptors.request.use(token_interceptor); //

export const $axiosDeportes = axios.create({ baseURL: import.meta.env.VITE_APP_DEPORTES_API }); //
const $axiosDeportes_token = axios.create({ baseURL: import.meta.env.VITE_APP_DEPORTES_API })
$axiosDeportes_token.interceptors.request.use(token_interceptor); //

export const $axiosSeguridad = axios.create({ baseURL: import.meta.env.VITE_APP_SEGURIDAD_API_2 }); //
const $axiosSeguridad_token = axios.create({ baseURL: import.meta.env.VITE_APP_SEGURIDAD_API_2 })
$axiosSeguridad_token.interceptors.request.use(token_interceptor); //

export const $axiosCompaq = axios.create({ baseURL: import.meta.env.VITE_APP_COMPAQ_API }); //
export const $axiosOrigin = axios.create({ baseURL: import.meta.env.VITE_APP_SEGURIDAD_API }); //
export const $axiosLegal2=axios.create({baseURL:import.meta.env.VITE_APP_RUTA_API_LEGAL2})

export {
    $axios_token,
    $axiosFinanzas_token,
    $axiosRh_token,
    $axiosDeportes_token,
    $axiosSeguridad_token
}