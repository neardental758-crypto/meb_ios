interface EnvInteface {
    apiUrlMysql: string;
    plantilla: string;
    modo: string;
}

export const Env: EnvInteface = {
    //apiUrlMysql: "http://192.168.1.8:3002/api/", //develop - localhost
    //apiUrlMysql: "https://movilidadsostenible.cloud/api/", //produccion - rama MAIN   
    apiUrlMysql: "https://apitest.movilidadsostenible.cloud/api/", //pruebas - rama test  
    plantilla: 'ride', //ride, davivienda
    modo: 'movil', //tablet, movil
}