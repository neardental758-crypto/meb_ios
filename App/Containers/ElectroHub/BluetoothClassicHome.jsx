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
} from 'react-native';
import { 
    savePrestamo,
} from '../../actions/actions3g';
import { connect, useDispatch } from 'react-redux';
import { AuthContext } from '../../AuthContext';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
const DEVICE_ID = '00:22:05:00:27:64'; // Dirección MAC de tu HC-05
//const password = '1234'; // Reemplaza "1234" con tu contraseña actual

const BluetoothClassic = (props) => {
    const dispatch = useDispatch();
    const { infoUser } = useContext( AuthContext )
    const { mac, macCargado, claveHC05, claveHC05Cargada, estaciones, numVehiculo, conexion} = props;
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [connectionMessage, setConnectionMessage] = useState('');
    const [devices, setDevices] = useState([]);
    const [conectado, setConectado] = useState(false); // valor inicial false
    const [bluetoothOn, setBluetoothOn] = useState(false);
    const [touchRentar, setTouchRentar] = useState(false);
    const [prestamoHecho, setPrestamoHecho] = useState(false); //valor inicial false

    async function conectar() {
        try {
            const device = await RNBluetoothClassic.connectToDevice(mac);
            console.log('Conexión exitosa!', mac);
            setConnectedDevice(device);
            setConnectionMessage(`Conectado a ${device.name} (${device.address})`); 
            setConectado(true);  
            conexion(true);                    
        } catch (error) {
            console.error('Error al conectar: ', error);
            setConnectionMessage('Error al conectar' + mac);
        }
    }

    async function conectar2() {
        try {
            const device = await RNBluetoothClassic.connectToDevice(DEVICE_ID);
            console.log('Conexión exitosa!', mac);
            setConnectedDevice(device);
            setConnectionMessage(`Conectado a ${device.name} (${device.address})`);                          
        } catch (error) {
            console.error('Error al conectar: ', error);
            setConnectionMessage('Error al conectar' + mac);
        }
    }


    async function sendMessage(message) {
        try {
            await RNBluetoothClassic.writeToDevice(connectedDevice.id, message);
            console.log(`Mensaje ${message} enviado correctamente`);
        } catch (error) {
            console.log('Error al enviar el mensaje:', error);
        }
    }
    
    const guardarPrestamo = async () => {
        let vehiculoPrestamo = '';
        let estacionPrestamo = '';
        let bicicletero = '';
        let reservaId = '';
        let hoy = new Date();
        let dia = new Date().toUTCString().substr(0,3);
        let fechaVence = '';

        if (dia === 'Sat') {
            fechaVence = new Date( hoy.setDate(hoy.getDate() + 2 ))
        }else{
            fechaVence = new Date( hoy.setDate(hoy.getDate() + 1 ))
        }
        
        if (props.dataRent.reservas === 0) {
            vehiculoPrestamo = props.dataRent.dataVehiculoReserva.bic_id;
            estacionPrestamo = props.dataRent.dataVehiculoReserva.bic_estacion;
            bicicletero = props.dataRent.dataVehiculoReserva.bc_bicicletero.bro_id;
            reservaId = 'sinreserva';
        }else{
            vehiculoPrestamo = props.dataRent.dataVehiculoReserva.bic_id;
            estacionPrestamo = props.dataRent.dataVehiculoReserva.bic_estacion;
            bicicletero = props.dataRent.dataVehiculoReserva.bc_bicicletero.bro_id;
            reservaId = props.dataRent.reservas.data[0].res_id;
        }
        
        const data = {
            "pre_id": "0",
            "pre_hora_server": hoy.toJSON(),
            "pre_usuario": infoUser.DataUser.idNumber,
            "pre_bicicleta": vehiculoPrestamo,
            "pre_retiro_estacion": estacionPrestamo,
            "pre_retiro_bicicletero": bicicletero,
            "pre_retiro_fecha": hoy.toJSON(),
            "pre_retiro_hora": new Date().getHours(),
            "pre_devolucion_estacion": estacionPrestamo,
            "pre_devolucion_bicicletero": bicicletero,
            "pre_devolucion_fecha": fechaVence.toJSON(),
            "pre_devolucion_hora": new Date().getHours(),
            "pre_duracion": "null",
            "pre_dispositivo": Platform.OS,
            "pre_estado": "ACTIVA"
        }
        
        await dispatch(savePrestamo(data, vehiculoPrestamo, reservaId, estacionPrestamo )); 
        
    }

    const rentar = async () => {
        if (!prestamoHecho) {
            await guardarPrestamo();
        }        
    }

    async function abrirSolenoide() {
        try {
            await rentar();
            await sendMessage(claveHC05);            
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
            console.log('la mac', mac)
            console.log('la macCargago', macCargado)
            //console.log('la respuesta', respuestaArduino)
            conectar(); 
            habilitarDis();
        }              
    },[macCargado])

    useEffect(() => {
        console.log('props.dataRent.prestamoSave', props.dataRent.prestamoSave);
        if (props.dataRent.prestamoSave) {
          setPrestamoHecho(true);
        }
      },[props.dataRent.prestamoSave])

    return (
        <View style={styles.container}>

            {/*<Text style={styles.textos}>{connectionMessage}</Text>*/}

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
                        </Pressable>
                    }

                    <Text style={styles.textos}>No se a conectado a la estación, intentelo de nuevo</Text>
                    <Image source={Images.bluetoothError} style={{width: 60, height: 60}}/>
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
                </View> 
            }
           
            {
                claveHC05Cargada && conectado ? 
                <Pressable
                    onPress={() => {abrirSolenoide()}}
                    style={styles.btnEnviar}
                >
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={styles.textLiberar1}>{numVehiculo}</Text>
                        <Image source={Images.patin_Icon} style={{width: 50, height: 50, tintColor : 'black'}}/> 
                        <Text style={styles.textLiberar2}>Liberar</Text>   
                    </View>                    
                </Pressable>
                :
                <></>
            }
            
            
            <View>
                {devices.map(device => (
                    <Text key={device.id}>{device.name} ({device.address})</Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row_ : {
        width: Dimensions.get('window').width*.8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    column_: {
        alignItems: 'center',
        justifyContent: 'space-around',
        height: Dimensions.get('window').height*.3,
        width: Dimensions.get('window').width
    },
    btnConect: {
        width: 120,
        height: 'auto',
        padding: 10,
        borderRadius: 20,
        backgroundColor: Colors.$adicional,
        alignItems: 'center',
    },
    btnActBluetooth: {
        width: 100,
        height: 100,
        padding: 5,
        borderRadius: 10,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnEnviar: {
        width: 120,
        height: 120,
        borderRadius: 20,
        padding: 5,
        backgroundColor: Colors.$adicional,
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
        fontSize: 16,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
    },
    textos: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 18,
        color: Colors.$texto80,
        width: Dimensions.get('window').width*.6,
        textAlign: 'center'
    }
});

function mapStateToProps(state) {
    return {
      dataUser: state.userReducer,
      dataRent: state.reducer3G,
    }
}
export default connect(mapStateToProps)(BluetoothClassic);

