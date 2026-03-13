import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    Dimensions,
    Platform,
    PermissionsAndroid,
    DeviceEventEmitter
} from 'react-native';
import {
    savePrestamo,
    cancelar__
} from '../../actions/actionParqueadero';
import { connect, useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import LottieView from 'lottie-react-native';
import * as RootNavigation from '../../RootNavigation';
import { Env } from "../../Utils/enviroments";
import { v4 as uuidv4 } from 'uuid';
import { NativeModules } from 'react-native';
const { ElectroHubBLEModule } = NativeModules;

const ConnectionBLE = (props) => {
    const dispatch = useDispatch();
    const { infoUser, logout } = useContext(AuthContext)
    const { mac, macCargado, claveHC05, claveHC05Cargada, estaciones, numVehiculo, dataVehiculo, dataParqueo, finalizando_con, apagando, siParqueoActivo, horasParquear, saldo } = props;
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [devices, setDevices] = useState([]);
    const [conectado, setConectado] = useState(false); // valor inicial false
    const [bluetoothOn, setBluetoothOn] = useState(false); //valor inicial false
    const [touchRentar, setTouchRentar] = useState(false); //valor inicial false
    const [btnSeRento, setBtnSeRento] = useState(false); //valor inicial false
    const [stateConect, setStateConect] = useState('conectando');

    async function pedirPermisosBLE() {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
        }
    }

    const conectarBLE = async () => {
        try {
            const resp = await ElectroHubBLEModule.connectToESP32(mac);
            console.log("Conexión:", resp);

            const result = await ElectroHubBLEModule.sendCommand(claveHC05);
            console.log("Comando:", result);


        } catch (error) {
            console.error("Error BLE:", error);
        }
    };

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('BLEStatus', (event) => {
            const { status, message } = event;

            //Alert.alert('BLE', message);

            if (status === 'success') {
                setConectado(true);
                if (apagando) {
                    RootNavigation.navigate('Calificar_parqueo');
                }

                /*if (!apagando) {
                     rentar();
                }*/
            } else if (status === 'error') {
                setConectado(false);
            }
        });

        return () => subscription.remove();
    }, []);

    /*const guardarPrestamo = async () => {
        let hoy = new Date();
        let dia = hoy.toUTCString().substr(0, 3);

        // Obtener hora actual en formato HH:mm:ss
        const formatoHora = (date) => {
            return date.toTimeString().split(' ')[0]; // Extrae solo HH:mm:ss
        };

        let inicio = new Date();
        let inicio_5 = new Date(inicio.getTime() - 5 * 60 * 60 * 1000);
        let fin = new Date(inicio_5.getTime() + horasParquear * 60 * 60 * 1000); // Sumar 4 horas

        const data = {
            "id": uuidv4(),
            "usuario": infoUser.DataUser.idNumber,
            "parqueadero": dataParqueo.parqueadero, 
            "lugar_parqueo": dataParqueo.id, 
            "vehiculo": dataVehiculo.vus_id,
            "fecha": hoy.toJSON(),       // Fecha completa en formato ISO
            "inicio": formatoHora(inicio_5),  // Solo la hora actual (HH:mm:ss)
            "fin": formatoHora(fin),        // Solo la hora +4 horas (HH:mm:ss)
            "duracion": "duracion",
            "dispositivo": Platform.OS,
            "estado": "ACTIVA",
        };

        console.log('Data para el préstamo parqueadero:', data);
        console.log('en conectBLE el saldo es', saldo)
        await dispatch(savePrestamo(data, dataVehiculo, dataParqueo, horasParquear, saldo)); 
        await setBtnSeRento(true);
    }*/

    const guardarPrestamo = async () => {
        let hoy = new Date(); // Fecha local
        let hoy_5 = new Date(hoy.getTime() - 5 * 60 * 60 * 1000);
        const formatoHora = (date) => {
            return date.toLocaleTimeString('es-CO', { hour12: false }); // Hora local HH:mm:ss
        };

        let inicio = new Date(); // Hora actual local
        let fin = new Date(inicio.getTime() + horasParquear * 60 * 60 * 1000); // Sumar n horas

        const data = {
            id: uuidv4(),
            usuario: infoUser.DataUser.idNumber,
            parqueadero: dataParqueo.parqueadero,
            lugar_parqueo: dataParqueo.id,
            vehiculo: dataVehiculo.vus_id,
            fecha: hoy_5.toJSON(),   // Si quieres ISO UTC completa, si prefieres local usa hoy.toLocaleString()
            inicio: formatoHora(inicio),
            fin: formatoHora(fin),
            duracion: "duracion",
            dispositivo: Platform.OS,
            estado: "ACTIVA",
        };

        console.log('Data para el préstamo parqueadero:', data);
        await dispatch(savePrestamo(data, dataVehiculo, dataParqueo, horasParquear, saldo));
        await setBtnSeRento(true);
    }


    const rentar = async () => {
        console.log('entrando a rentar')
        await guardarPrestamo();
    }

    useEffect(() => {
        if (macCargado) {
            //Alert.alert('ya estamos en el componente ble ')
            pedirPermisosBLE();
            conectarBLE();
        }
    }, [macCargado])

    useEffect(() => {
        if (apagando) {
            console.log('la mac parqueo:::::::', mac)
            console.log('la macCargago', macCargado)
            pedirPermisosBLE();
            conectarBLE();
        }
    }, [apagando])

    return (
        <View style={styles.container}>
            {
                //valor inicial conectado
                conectado ?
                    <>
                        {
                            finalizando_con ?
                                <View style={styles.column_}>
                                    <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop
                                        style={{
                                            width: Dimensions.get('window').width * .5,
                                            height: 'auto'
                                        }} />

                                </View>
                                :
                                <View style={styles.column_}>
                                    <Text style={{ fontSize: 20, fontFamily: Fonts.$poppinsregular, color: Colors.$parqueo_color_texto }}>
                                        {
                                            !btnSeRento ?
                                                '¿Se energizó el parqueadero?'
                                                :
                                                'Parqueo exitoso'
                                        }

                                    </Text>
                                    <View style={styles.row_}>
                                        {
                                            !btnSeRento ?
                                                <>
                                                    <Pressable
                                                        onPress={() => rentar()}
                                                        //onPress={() => console.log(dataVehiculo)}
                                                        style={styles.btnSI}
                                                    >
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Text style={styles.textLiberar2}>SI</Text>
                                                        </View>
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => { conectarBLE() }}
                                                        style={[styles.btnSI, { backgroundColor: Colors.$parqueo_color_secundario }]}
                                                    >
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <Text style={[styles.textLiberar2, { color: Colors.$parqueo_color_fondo }]}>NO</Text>
                                                        </View>
                                                    </Pressable>
                                                </>
                                                :
                                                <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular, color: Colors.$parqueo_color_texto_80 }}>Se ocupó un parqueadero</Text>
                                        }
                                    </View>
                                </View>
                        }
                    </>

                    :
                    <View style={styles.column_}>
                        <Text style={styles.textos}>{stateConect === 'conectando' ? 'Si estás finalizando y no te conectas, tu sesión terminará automáticamente al calificar.' : 'No se pudo conectar.'}</Text>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: Dimensions.get('window').width,
                            height: 'auto',
                            marginTop: 5,
                            marginBottom: 5
                        }}>
                            {
                                Env.modo === 'tablet' ?
                                    <Text style={{
                                        fontSize: 20,
                                        color: Colors.$parqueo_color_fondo,
                                        textAlign: 'center',
                                        fontFamily: Fonts.$poppinsregular
                                    }}>Conectando.....</Text>
                                    :
                                    <LottieView source={require('../../Resources/Lotties/bicy_bluetooth.json')} autoPlay loop
                                        style={{
                                            width: Dimensions.get('window').width * .4,
                                            height: Dimensions.get('window').width * .4
                                        }} />
                            }

                            <Pressable
                                onPress={() => { conectarBLE() }}
                                style={styles.btnEnviar}
                            >
                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={styles.textLiberar2}>Conectar</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.$parqueo_color_fondo,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    sinConexion: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 0,
        zIndex: 1000,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_: {
        width: Dimensions.get('window').width * .8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 30
    },
    column_: {
        alignItems: 'center',
        justifyContent: 'space-around',
        width: Dimensions.get('window').width,
        height: 'auto'
    },
    btnConect: {
        width: 150,
        height: 'auto',
        padding: 10,
        borderRadius: 30,
        backgroundColor: Colors.$texto,
        alignItems: 'center',
    },
    btnActBluetooth: {
        width: 100,
        height: 100,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnEnviar: {
        width: Dimensions.get('window').width * .8,
        borderRadius: 20,
        padding: 5,
        backgroundColor: Colors.$parqueo_color_primario,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    btnSI: {
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 5,
        backgroundColor: Colors.$parqueo_color_primario,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    textLiberar1: {
        fontSize: 26,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
    },
    textLiberar2: {
        fontSize: 20,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
    },
    textos: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 20,
        color: Colors.$parqueo_color_texto,
        width: Dimensions.get('window').width * .8,
        textAlign: 'center'
    }
});

export default ConnectionBLE;
