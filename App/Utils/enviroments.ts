interface EnvInteface {
    apiUrlMysql: string;
    plantilla: string;
    modo: string;
}

export const Env: EnvInteface = {
    //apiUrlMysql: "http://192.168.1.3:3002/api/", //develop - localhost
    apiUrlMysql: "https://violet-goldfish-283275.hostingersite.com/api/", //produccion - localhost url   
    plantilla: 'ride', //ride, davivienda
    modo: 'movil', //tablet, movil
}