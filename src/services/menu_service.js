import {$axiosSeguridad_token as $axios} from '@/util/axios_instance'

export const getMenuService=async()=>{

    try {
        const {data,status}=await $axios.get("/menu")
        return data
    } catch (error) {
        throw error
    }
}