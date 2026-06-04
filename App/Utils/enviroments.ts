interface EnvInteface {
    apiUrl: string;
    apiUrlMysql: string;
    plantilla: string;
    modo: string;
}

// const activeUrl = "http://192.168.1.8:3002/api/"; //develop - localhost
const activeUrl = "https://movilidadsostenible.cloud/api/"; //produccion - rama MAIN   
// const activeUrl = "https://apitest.movilidadsostenible.cloud/api/"; //pruebas - rama test  

export const Env: EnvInteface = {
    apiUrl: activeUrl,
    apiUrlMysql: activeUrl,
    plantilla: 'ride',
    modo: 'movil',
}