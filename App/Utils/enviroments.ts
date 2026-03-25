interface EnvInteface {
    apiUrlMysql: string;
    plantilla: string;
    modo: string;
}

export const Env: EnvInteface = {
    //apiUrlMysql: "http://192.168.1.6:3002/api/", //develop - localhost
    apiUrlMysql: "https://movilidadsostenible.cloud/api/", //produccion - localhost url   
    plantilla: 'ride', //ride, davivienda
    modo: 'movil', //tablet, movil
}