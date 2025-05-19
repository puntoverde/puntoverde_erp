import {$axiosDeportes as $axios,$axiosOrigin as $axios_origin,$axios as $axiosLegal} from '@/util/axios_instance'
import uniqBy from 'lodash/uniqBy'


export async function disponibles() {

    console.log('entra al services')
    // {
    //         "cve_equipo":0,
    //         "actual": "2023-03-13 20:07:36",
    //         "cve_apartado": null,
    //         "disponible": null,
    //         "nombre_equipo": "-",
    //         "descripcion": "Cancha de tenis 5",
    //         "inicio": null,
    //         "fin": null,
    //         "foto": "NA",
    //         "nombre": "-",
    //         "paterno": "-",
    //         "materno": "-",
    //         "nip": null
    //     }
    try {
        console.log('entra al services try')
        // const axios = getCurrentInstance().proxy.$axiosDeportes;
        const { data, status } = await $axios.get("/apartados")

        if (status === 200 && Boolean(data)) {
            const socios_map = data.filter(i => Boolean(i.cve_apartado)).map(i => ({                
                cve_equipo: i.cve_equipo,
                nombre: i.nombre,
                paterno: i.paterno,
                materno: i.materno,
                foto: i.foto,
                imagen:null
            }))


            const data_map = uniqBy(data, 'cve_equipo').map(i => (
                {
                    cve_apartado:i.cve_apartado,
                    equipo: i.nombre_equipo,
                    descripcion: i.descripcion,
                    disponible: i.disponible,
                    inicio: i.inicio,
                    fin: i.fin,
                    socios: socios_map.filter(j => j.cve_equipo == i.cve_equipo)
                }))

            return data_map;
        }//fin if
        else {
            console.log('entra al services else')
            return [];
        }
    }
    catch (e) {
        console.log('entra al services catch:',e)
        return [];
    }
}

export async function horariosEnvivo(){
try {
    const {data}=await $axios.get("/apartados/reporte-horarios")
    return data
} catch (error) {
    throw Error("no se encontro horarios envivo...")
}
}

export async function getApartadosService()
{
     // accion.value = 4;
  // axios
  //   .post("/apartadosController.php", qs.stringify({ accion: accion.value }))
  //   .then((res) => {
  //     itemsCancelar.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
    try {
        const params = new URLSearchParams();
        params.append('accion', 4);
        const {data}=await $axios_origin.post("/apartadosController.php", params)
        return data
    } catch (error) {
        
    }
}

export async function getApartadosDesabilitadosService()
{
    // accion.value = 5;
    // axios
    //   .post("/apartadosController.php", qs.stringify({ accion: accion.value }))
    //   .then((res) => {
    //     
    //   })
    //   .catch(function (res) {
    //     alert(res);
    //   });
    try {
        const params = new URLSearchParams();
        params.append('accion', 5);
        const {data}=await $axios_origin.post("/apartadosController.php",params)
        return data
    } catch (error) {
        
    }
}

export async function getItemsEspaciosDeportivosService()
{
    // accion.value = 6;
    //   axios
    //   .post("/apartadosController.php", qs.stringify({ accion: accion.value }))
    //   .then((res) => {
    //     itemsEspacioD.value = res.data;
    //   })
    //   .catch(function (res) {
    //     alert(res);
    //   });
    try {
        const params = new URLSearchParams();
        params.append('accion', 6);
        const {data}=await $axios_origin.post("/apartadosController.php", params)
        return data
    } catch (error) {
        
    }
}

export async function getEquiposByService(cve_ed)
{
//     accion.value = 7;
//   axios
//     .post(
//       "/apartadosController.php",
//       qs.stringify({ accion: accion.value, cve_ed: espacioDeportivo.value })
//     )
//     .then((res) => {
//       itemsEquiposSlc.value = res.data;
//     })
//     .catch(function (res) {
//       alert(res);
//     });
    try {
        const params = new URLSearchParams();
        params.append('accion', 7);
        params.append('cve_ed', cve_ed);
        const {data}=await $axios_origin.post("/apartadosController.php", params)
        return data
    } catch (error) {
        
    }
}

export async function getSaveEquipoService(cve_equipo,fechaI,fechaF,horaI,horaF)
{

    // accion.value = 8;
    //   axios
    //     .post(
    //       "/apartadosController.php",
    //       qs.stringify({
    //         accion: accion.value,
    //         cve_equipo: equipo.value,
    //         fechaI: fechaIF.value,
    //         fechaF: fechaFF.value,
    //         horaI: horaI.value,
    //         horaF: horaF.value,
    //       })
    //     )
    //     .then((res) => {
    //       if (res.data == true && isBoolean(res.data)) {
    //         itemsTablaCancelar();
    //         dialogNuevo.value = false;
    //         limpiarCamposNuevo();
    //       } else alert("Ocurrio un error, inténtalo de nuevo más tarde.");
    //     })
    //     .catch(function (res) {
    //       alert(res);
    //     });

    try {
        const params = new URLSearchParams();
        params.append('accion', 8);
        params.append('cve_equipo', cve_equipo);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('horaI', horaI);
        params.append('horaF', horaF);
        const {data}=await $axios_origin.post("/apartadosController.php", params)
        return data
    } catch (error) {
        
    }
}

export async function getDesailitarEquipoService(cve_equipo,estatus,motivo)
{

//     accion.value = 2;
//   axios
//     .post(
//       "/apartadosController.php",
//       qs.stringify({
//         accion: accion.value,
//         cve_equipo: cve,
//         estatus: estatus,
//         motivo: motivo.value,
//       })
//     )
//     .then((res) => {
//       itemsTablaDeshabilitar(); //Recarga la tabla
//       dialog.value = false;
//     })
//     .catch(function (res) {
//       alert(res);
//     });

    try {
        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('cve_equipo', cve_equipo);
        params.append('estatus', estatus);
        params.append('motivo', motivo);
        const {data}=await $axios_origin.post("/apartadosController.php", params)
        return data
    } catch (error) {
        
    }
}


export async function getCancelarApartadoService(cve_apartado)
{

    // accion.value = 1;
    // axios
    //   .post(
    //     "/apartadosController.php",
    //     qs.stringify({ accion: accion.value, cve_apartado: cve })
    //   )
    //   .then((res) => {
    //     itemsTablaCancelar(); //Recarga la tabla
    //   })
    //   .catch(function (res) {
    //     alert(res);
    //   });

    try {
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('cve_apartado', cve_apartado);
        const {data}=await $axios_origin.post("/apartadosController.php",params)        
        return data
    } catch (error) {
        
    }
}

export async function getApartadoEstatusService(filter)
{
    try {
        const { data, status } = await $axiosLegal.get("/apartado", {params: filter});      
        return data
    } catch (error) {
        
    }
}


export async function getReporteApartadoService(tipoQuery,fechaI,fechaF,horaI,horaF)
{
    try {

        
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('tipoQuery', tipoQuery);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('horaI', horaI);
        params.append('horaF', horaF);
        const { data, status } = await $axios_origin.post("/reporteApartadosController.php", params);           
        return data
    } catch (error) {
        
    }
}

export async function getReporteApartadoGraficaService(tipoQuery,fechaI,fechaF,horaI,horaF,espacio)
{
    try {

        
        const params = new URLSearchParams();
        params.append('accion', 2);
        params.append('tipoQuery', tipoQuery);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        params.append('horaI', horaI);
        params.append('horaF', horaF);
        params.append('espacio', espacio);
        const { data, status } = await $axios_origin.post("/reporteApartadosController.php", params);     
        
        return data
    } catch (error) {
        
    }
}

export async function getReporteApartadoEspaciosDeportivosService()
{
    try {

        
        const params = new URLSearchParams();
        params.append('accion', 2);
        const { data, status } = await $axios_origin.post("/reporteApartadoEquipoController.php", params); 
        
        return data
    } catch (error) {
        
    }
}

export async function getReporteApartadoEquipoService(fechaI,fechaF)
{
    try {

        
        const params = new URLSearchParams();
        params.append('accion', 1);
        params.append('fechaI', fechaI);
        params.append('fechaF', fechaF);
        const { data, status } = await $axios_origin.post("/reporteApartadoEquipoController.php", params); 
        
        
        return data
    } catch (error) {
        
    }
}




