interface EnvInteface {
    apiUrl: string;
    apiUrlMysql: string;
    plantilla: string;
    modo: string;
}

export const Env: EnvInteface = {
    apiUrl: "https://application.tuhuella.co/",
    //apiUrl: "http://200.118.61.93:3001/", //local
    apiUrlMysql: "https://middleware.tuhuella.co/api/", //develop - dejarlo para tienda mientras
    //apiUrlMysql: "http://192.168.1.6:3002/api/", //develop - dejarlo para tienda mientras
    plantilla: 'meb', //ride, meb
    modo: 'movil', //tablet, movil
}