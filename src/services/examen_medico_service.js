import {$axios} from '@/util/axios_instance'


export const allPersonasService=async(p)=>{
    try {
        const {data,status}=await $axios.get('/examen-medico/personas',{params:p})
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const findPersonaByIdService=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/examen-medico/persona/${id}`)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}


export const createExamenMedicoService=async(p)=>{
    try {
        const {data,status}=await $axios.post('/examen-medico',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const finalizarExamenMedico=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/examen-medico/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const getExamenMedico=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/examen-medico/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

//antecedentes familiares
export const getAntecedentesFamiliares=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/examen-medico/antecedentes/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const saveAntecedentesFamiliares=async(p)=>{
    try {
        const {data,status}=await $axios.post('/examen-medico/antecedentes',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar antecedentes familiares")
    }
}

export const updateAntecedentesFamiliares=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/examen-medico/antecedentes/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al actualizar antecedentes familiares")
    }
}


//historia medica personal
export const getHistoriaMedica=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/examen-medico/historia-medica/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const saveHistoriaMedica=async(p)=>{
    try {
        const {data,status}=await $axios.post('/examen-medico/historia-medica',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar historia-medica familiares")
    }
}

export const updateHistoriaMedica=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/examen-medico/historia-medica/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al actualizar historia-medica familiares")
    }
}


//alimentacion habitual
export const getAlimentacionHabitual=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/examen-medico/alimentacion-habitual/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const saveAlimentacionHabitual=async(p)=>{
    try {
        const {data,status}=await $axios.post('/examen-medico/alimentacion-habitual',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar alimentacion-habitual familiares")
    }
}

export const updateAlimentacionHabitual=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/examen-medico/alimentacion-habitual/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al actualizar alimentacion-habitual familiares")
    }
}


//exploracion
export const getExploracionFisica=async(id)=>{
    try {
        const {data,status}=await $axios.get(`/examen-medico/exploracion-fisica/${id}`)
        return data;
    } catch (error) {
        throw Error("no se encuentra accion...")
    }
}

export const saveExploracionFisica=async(p)=>{
    try {
        const {data,status}=await $axios.post('/examen-medico/exploracion-fisica',p)
        return data;
    } catch (error) {
        throw Error("Error al guardar exploracion-fisica familiares")
    }
}

export const updateExploracionFisica=async(id,p)=>{
    try {
        const {data,status}=await $axios.put(`/examen-medico/exploracion-fisica/${id}`,p)
        return data;
    } catch (error) {
        throw Error("Error al actualizar exploracion-fisica familiares")
    }
}

