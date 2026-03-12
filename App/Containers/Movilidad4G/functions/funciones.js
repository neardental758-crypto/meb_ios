import { fetch } from '../../../Services/refresh.service';

const consultaURLDATA = async (url:any, formulario:any, callback:any) =>{
    await fetch( url,{
        method: 'POST',
        body: JSON.stringify(formulario),
        enctype: 'multipart/form-data'
    })
    .then( (dato:any)=>{
        callback(dato)
    })
}

const consultaURL = async (url:any, callback:any) =>{
    await fetch( url )
    .then( (dato:any)=>{
        return callback(dato)
    })
}

const gr_Rad = (gr) => {
    return gr * Math.PI / 180;
};

const calDistancia = (lat1, lon1, lat2, lon2) => {
    // Convertir todas las coordenadas a radianes
    lat1 = gr_Rad(lat1);
    lon1 = gr_Rad(lon1);
    lat2 = gr_Rad(lat2);
    lon2 = gr_Rad(lon2);
    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaLon = (lon2 - lon1);
    let diferenciaLat = (lat2 - lat1);
    let a = Math.pow(Math.sin(diferenciaLat / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaLon / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (RADIO_TIERRA_EN_KILOMETROS * c) * 1000;
};

export const apimysql = {
    consultaURLDATA,
    consultaURL,
    calDistancia,
}