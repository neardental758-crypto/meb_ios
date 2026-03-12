import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    Modal,
    Button,
    Dimensions,
    PermissionsAndroid
} from 'react-native';
import { 
    savePrestamo,
    cancelar__
} from '../../actions/actionParqueadero';
import { connect, useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import LottieView from 'lottie-react-native';
import { Env } from "../../Utils/enviroments"; 
import { v4 as uuidv4 } from 'uuid';
//const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
//const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const BluetoothClassic = (props) => {
    const dispatch = useDispatch();
    const { infoUser, logout } = useContext( AuthContext )
    const { mac, macCargado, claveHC05, claveHC05Cargada, estaciones, numVehiculo, dataVehiculo, dataParqueo, finalizando_con, apagando, siParqueoActivo} = props;
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [connectionMessage, setConnectionMessage] = useState('');
    const [devices, setDevices] = useState([]);
    const [conectado, setConectado] = useState(false); // valor inicial false
    const [bluetoothOn, setBluetoothOn] = useState(false); //valor inicial false
    const [touchRentar, setTouchRentar] = useState(false); //valor inicial false
    const [prestamoHecho, setPrestamoHecho] = useState(false); //valor inicial false
    const [stateConect, setStateConect] = useState('conectando');
    const [casco, setCasco] = useState(false);
    const [sobrio, setSobrio] = useState(false);
    const [funcional, setFuncional] = useState('');
    const [btnSeRento, setBtnSeRento] = useState(false);

    async function conectar() {
        try {
            const device = await RNBluetoothClassic.connectToDevice(mac);
            console.log('Conexión exitosa!', mac);
            setConnectedDevice(device);
            setConnectionMessage(`Conectado a ${device.name} (${device.address})`);
            setConectado(true);
    
            // Desconectar después de 20 segundos
            setTimeout(async () => {
                try {
                    await device.disconnect();
                    console.log('Dispositivo desconectado');
                    setConnectionMessage('Desconectado');
                    setConectado(false);
                } catch (error) {
                    console.error('Error al desconectar: ', error);
                    setConnectionMessage('Error al desconectar');
                }
            }, 20000); // 20 segundos
    
        } catch (error) {
            console.error('Error al conectar: ', error);
            setConnectionMessage('Error al conectar ' + mac);
            setStateConect('error');
        }
    }

    async function sendMessage(message) {
        try {
            await RNBluetoothClassic.writeToDevice(connectedDevice.id, message);
            console.log(`Mensaje ${message} enviado correctamente`);
            apagando(true);
        } catch (error) {
            console.log('Error al enviar el mensaje:', error);
        }
    }

    const guardarPrestamo = async () => {
        let hoy = new Date();
        let dia = hoy.toUTCString().substr(0, 3);

        // Obtener hora actual en formato HH:mm:ss
        const formatoHora = (date) => {
            return date.toTimeString().split(' ')[0]; // Extrae solo HH:mm:ss
        };

        let inicio = new Date();
        let inicio_5 = new Date(inicio.getTime() - 5 * 60 * 60 * 1000);
        let fin = new Date(inicio_5.getTime() + 4 * 60 * 60 * 1000); // Sumar 4 horas

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
        await dispatch(savePrestamo(data, dataVehiculo, dataParqueo)); 
        await setBtnSeRento(true);
    }

    const rentar = async () => {
        console.log('entrando a rentar')
        await guardarPrestamo();          
    }
    
    async function onCorriente() {
        try {
            //await rentar();
            await sendMessage(claveHC05);
            await setTouchRentar(true);
        } catch (error) {
            console.log('Error al abrir el solenoide', error);
        }
    }

    async function turnOffLed() {
        try {
            await sendMessage('0'); // Envía el mensaje '0' al Arduino
        } catch (error) {
            console.log('Error al apagar el LED', error);
        }
    }

    async function habilitarDis() {
        try {
            const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
            if (enabled) {
                console.log('Bluetooth habilitado');
                setBluetoothOn(true)
            } else {
                console.log('Bluetooth no habilitado');
                /*Alert.alert(
                    "Bluetooth no habilitado",
                    ":)",
                    [
                        { text: "Habilitar", onPress: () => console.log('ok') }
                    ]
                );*/
                Alert.alert('habilitar bluetooth')
            }
        } catch (error) {
            console.log('Error al habilitar Bluetooth', error);
        }
    }

    async function buscarDispositivos() {
        try {
            const availableDevices = await RNBluetoothClassic.list();
            setDevices(availableDevices);
        } catch (error) {
            console.log('Error al buscar dispositivos', error);
        }
    }

    useEffect(() => {
        if (macCargado) {
            console.log('la mac parqueo', mac)
            console.log('la macCargago', macCargado)
            //console.log('la respuesta', respuestaArduino)
            buscarDispositivos();
            conectar();  
            habilitarDis();
        }              
    },[macCargado])  

    return (
        <View style={styles.container}>
            {
                conectado ? 
                <></>
                :
                <View style={styles.column_}>

                    {
                        bluetoothOn ? 
                        <></>
                        :
                        <Pressable
                            onPress={() => {habilitarDis()}}
                            style={styles.btnActBluetooth}
                        >
                            <Image source={Images.bluetoothRefresh} style={{width: 60, height: 60}}/>
                            <Text style={{
                                textAlign: 'center',
                                color: Colors.$parqueo_color_texto
                            }}>Activar bluetooth</Text>
                        </Pressable>
                    }
                    <Text style={styles.textos}>{ stateConect === 'conectando' ? 'Conectando...' : 'No se pudo conectar.'}</Text>
                    <View style={{
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: Dimensions.get('window').width,
                        height: 'auto', 
                        marginTop: 20,
                        marginBottom: 20
                        }}>
                        {
                            Env.modo === 'tablet' ?
                            <Text style={{
                                fontSize: 25,
                                color: Colors.$texto,
                                textAlign: 'center',  
                                fontFamily: Fonts.$poppinsregular
                            }}>Conectando.....</Text>
                            :
                            <LottieView source={require('../../Resources/Lotties/bicy_bluetooth.json')} autoPlay loop 
                            style={{
                                width: Dimensions.get('window').width*.5,
                                height: Dimensions.get('window').width*.5              
                            }}/>
                        }
                    </View> 
                    
                    {
                        stateConect === 'error' ?
                        <View style={styles.row_}>                                     
                            <Pressable
                                onPress={() => {conectar()}}
                                style={styles.btnConect}
                            >
                                <Text style={styles.textLiberar2}>Conectar</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {buscarDispositivos()}}
                                style={styles.btnConect}
                            >
                                <Text style={styles.textLiberar2}>Buscar</Text>
                            </Pressable>
                        </View> 
                        :
                        <></>
                    }
                      
                </View> 
            }
             
            {
                claveHC05Cargada && conectado && !touchRentar ? 
                <Pressable
                    onPress={() => { onCorriente() }}
                    style={styles.btnEnviar}
                >
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={styles.textLiberar2}>{numVehiculo}</Text>
                        <Text style={styles.textLiberar1}>ON</Text>   
                    </View>                        
                </Pressable>
                :
                <></>
            }
              
            {
                touchRentar && conectado && !finalizando_con ?                 
                <View style={styles.column_}>
                    <Text style={{fontSize: 20, fontFamily: Fonts.$poppinsregular, color: Colors.$texto}}>
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
                                onPress={() => {setTouchRentar(false)}}
                                style={[styles.btnSI, {backgroundColor: Colors.$parqueo_color_fondo_50}]}
                            >
                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={styles.textLiberar2}>NO</Text>   
                                </View>                        
                            </Pressable>
                            </>
                            :
                            <>
                            <Text>Se ocupó un parqueadero</Text>
                            </>
                        }
                        
                        
                    </View>                    
                </View>
                :
                <>
                {
                    siParqueoActivo ?
                    <Pressable
                        onPress={() => { onCorriente() }}
                        style={styles.btnEnviar}
                    >
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.textLiberar2}>{/*numVehiculo*/}Finalizar Parqueo</Text> 
                        </View>                        
                    </Pressable>
                    :
                    <></>
                }
                </>
            }
            <View>
                {devices.map(device => (
                    <Text key={device.id}>dispositivo : {device.name} ({device.address})</Text>
                ))}
            </View>
        </View>
    );
}

const stylesModal = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    subContenedor: { 
        flex: 1,
        backgroundColor: "rgba(52, 52, 52, 0.9)", 
        flexDirection: "column"
    },
    btnSaveColor2: {
        color: Colors.$blanco,
        fontSize: 20,
        padding: 10
    },
    caja1: { 
        flex: 1, 
        borderRadius: 6,
        marginVertical: 0, 
        marginHorizontal: 0, 
        backgroundColor: Colors.$blanco, 
        justifyContent: "flex-start", 
        alignItems: "center",
        paddingTop: 30
    },
    titulo: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        color: Colors.$texto80
    },
    cajaPregunta: {
        width: Dimensions.get('window').width*.9,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10
    },
    textoPregunta: {
        width: Dimensions.get('window').width*.4,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto80,
        paddingLeft: 10
    },
    cajaSiNo: {
        width: Dimensions.get('window').width*.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',   
    },
    btnPregunta: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnSI: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$parqueo_color_primario,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    btnNO: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$parqueo_color_secundario,
    },
    textoOpcion: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco,
    }
})

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
    row_ : {
        width: Dimensions.get('window').width*.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 30
    },
    column_: {
        alignItems: 'center',
        justifyContent: 'space-around',
        width: Dimensions.get('window').width,
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
        width: Dimensions.get('window').width*.8,
        borderRadius: 20,
        padding: 5,
        backgroundColor: Colors.$parqueo_color_primario,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
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
        color: Colors.$texto80,
        width: Dimensions.get('window').width*.8,
        textAlign: 'center'
    }
});

export default BluetoothClassic;
