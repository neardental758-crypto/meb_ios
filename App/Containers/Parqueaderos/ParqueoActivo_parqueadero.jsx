import {
    Image,
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    TextInput,
    Alert
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    finalizar_parqueo,
    validate_tyc
} from '../../actions/actionParqueadero';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { NativeModules } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { NotificacionModule } = NativeModules;

function ParqueoActivo_parqueadero(props) {
    const dispatch = useDispatch();
    const { infoUser } = useContext(AuthContext);
    const [tiempoRestante, setTiempoRestante] = useState(null);
    const [vencido, setVencido] = useState(false);
    const dataParqueo = props.dataParqueo.parqueo_activo[0];
    const fechaInicio = new Date(dataParqueo.fecha); 
    const fechaVencimiento = new Date(fechaInicio.getTime() + 4 * 60 * 60 * 1000); // Sumamos 4 horas
    const [fill, setFill] = useState(0);

    useEffect(() => {
        const actualizarCuentaRegresiva = () => {
            const ahora = new Date();

            const [hInicio, mInicio, sInicio] = dataParqueo.inicio.split(':').map(Number);
            const [hFin, mFin, sFin] = dataParqueo.fin.split(':').map(Number);

            const fechaInicio = new Date(dataParqueo.fecha);
            fechaInicio.setHours(hInicio, mInicio, sInicio || 0);

            const fechaVencimiento = new Date(dataParqueo.fecha);
            fechaVencimiento.setHours(hFin, mFin, sFin || 0);

            // Si la hora de fin es menor que la de inicio, significa que cruza la medianoche
            // Entonces agregamos un día a la fecha de vencimiento
            if (hFin < hInicio || (hFin === hInicio && mFin < mInicio)) {
                fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);
            }

            const tiempoTotal = fechaVencimiento - fechaInicio;
            const tiempoTranscurrido = ahora - fechaInicio;

            const porcentaje = Math.min(Math.max((tiempoTranscurrido / tiempoTotal) * 100, 0), 100);
            setFill(porcentaje);

            const diferencia = fechaVencimiento - ahora;

            if (diferencia <= 0) {
                setVencido(true);
                setTiempoRestante(null);
                return;
            }

            const horas = Math.floor(diferencia / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            setTiempoRestante(`${horas}h ${minutos}m ${segundos}s`);
        };

        const interval = setInterval(actualizarCuentaRegresiva, 1000);
        actualizarCuentaRegresiva();

        return () => clearInterval(interval);
    }, []);

    const detener_Notificaciones = async() => {
        console.log('Eliminar datos pendientes');
        await NotificacionModule.detenerNotificaciones();
        await eliminarReservaStorage();
    };

    const eliminarReservaStorage = async () => {
        try {
            const pendientes = JSON.parse(await AsyncStorage.getItem('qr_pendientes')) || [];

            if (pendientes.length === 0) {
            Alert.alert('Modo Offline', 'No tiene ninguna reserva pendiente en storage');
            return;
            }

            Alert.alert(
            "Eliminar Pendiente",
            "¿Confirma que desea eliminar el pendiente del storage?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                text: "Confirmar", 
                onPress: async () => {
                    // Limpiamos la lista de pendientes
                    pendientes.shift(); 
                    await AsyncStorage.setItem('qr_pendientes', JSON.stringify(pendientes));
                    Alert.alert('Éxito', 'Pendientes eliminada del storage');
                } 
                }
            ]
            );

        } catch (error) {
            console.log('Error eliminando reserva de storage:', error);
        }
        };

    const finalizarParqueo = (data) => {
        
        Alert.alert(
            "Confirmar",
            "¿Estás seguro de finalizar el parqueo?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        detener_Notificaciones(),
                        dispatch(finalizar_parqueo(data, 'parqueadero'))
                    }
                }
            ]
        );
    };

    const irCalificar_parqueadero = () => { 
        setTiempoRestante(null);
        setFill(0);
        setVencido(false);
        RootNavigation.navigate('Calificar_parqueadero');
    }

    function quitarUltimosTres(str) {
        return str.slice(0, -3);
    }

    const [ vehiculoCargado, setVehiculoCargado] = useState(false)

    useFocusEffect( 
    React.useCallback(() => { 
        console.log('vericacion desde focus de validate hgjhgjghj si entra')
        dispatch(validate_tyc());
    },[])
    );

    /*useEffect(()=>{
        if (props.dataParqueo.ultimo_vehiculo !== '') {
            setVehiculoCargado(true)
        }
    },[props.dataParqueo.ultimo_vehiculo])*/

    useEffect(() => {
        // Validamos que exista toda la cadena de propiedades antes de marcar como cargado
        if (props.dataRent?.vel_select?.data?.vus_img && 
            props.dataParqueo?.ultimo_vehiculo !== '') {
            setVehiculoCargado(true);
        } else {
            setVehiculoCargado(false);
        }
    }, [
        props.dataRent?.vel_select?.data?.vus_img, 
        props.dataParqueo?.ultimo_vehiculo
    ]);



    return (
        <SafeAreaView style={styles.contenedor}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {
                    props.dataParqueo.parqueadero_finalizado ? 
                    <View style={styles.card}>
                        <Text style={styles.titulo}>Parqueadero terminó correctamente.</Text>
                        <Pressable
                            style={styles.botonFinalizar}
                            onPress={() => irCalificar_parqueadero()}>
                            <Text style={styles.botonFinalizarText}>Calificar</Text>
                        </Pressable>
                    </View>
                    :
                    <View style={styles.card}>
                        <Text style={styles.titulo}>Parqueadero Activo</Text>

                    <AnimatedCircularProgress
                        size={240}
                        width={24}
                        fill={fill}
                        tintColor={Colors.$parqueo_color_adicional}
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor="#3d5875"
                        rotation={0}
                        lineCap="round">
                        {
                            () => (
                                vencido
                                ? <Text style={styles.vencido}>⚠️</Text>
                                : 
                                <>
                                {
                                    vehiculoCargado && 
                                    props.dataRent?.vel_select?.data?.vus_img ? (
                                        <Image 
                                            source={{ uri: props.dataRent.vel_select.data.vus_img }} 
                                            style={{
                                                width: 160,
                                                height: 160,
                                                borderRadius: 80,
                                                borderColor: Colors.$parqueo_color_texto,
                                                borderWidth: 2
                                            }}
                                            onError={(error) => {
                                                console.log('Error cargando imagen del vehículo:', error);
                                                setVehiculoCargado(false);
                                            }}
                                        />
                                    ) : (
                                        // Placeholder mientras carga el vehículo
                                        <View style={{
                                            width: 160,
                                            height: 160,
                                            borderRadius: 80,
                                            borderColor: Colors.$parqueo_color_texto,
                                            borderWidth: 2,
                                            backgroundColor: Colors.$parqueo_color_secundario_20,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                color: Colors.$parqueo_color_texto,
                                                fontSize: 16,
                                                textAlign: 'center'
                                            }}>
                                                Cargando...
                                            </Text>
                                        </View>
                                    )
                                }
                                </>
                            )
                        }
                    </AnimatedCircularProgress>

                        {vencido ? (
                            <Text style={styles.vencido}>⚠️ El parqueo ha vencido</Text>
                        ) : (
                            <Text style={styles.cuentaRegresiva}>{tiempoRestante}</Text>
                        )}
                        <View style={{
                            width: '60%',
                            backgroundColor: Colors.$parqueo_color_secundario_20,
                            padding: 10,
                            borderRadius: 15,
                            paddingLeft:20
                        }}>
                            <Text style={styles.texto}>Inicio: {quitarUltimosTres(dataParqueo.inicio)}</Text>
                            <Text style={styles.texto}>Fin: {quitarUltimosTres(dataParqueo.fin)}</Text>
                            <Text style={styles.texto}>Punto: {dataParqueo.parqueo_lugar.numero}</Text>
                        </View>
                        
                        
                        {<Pressable
                            style={styles.botonFinalizar}
                            onPress={() => finalizarParqueo(dataParqueo)}>
                            <Text style={styles.botonFinalizarText}>Finalizar Parqueadero</Text>
                        </Pressable>}
                    </View>
                }

                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: Colors.$parqueo_color_fondo,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: Colors.$parqueo_color_fondo,
        elevation: 5,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 24,
        color: Colors.$parqueo_color_texto,
        marginBottom: 10,
        fontFamily: Fonts.$poppinsregular,
        textAlign: 'center'
    },
    texto: {
        fontSize: 18,
        color: Colors.$parqueo_color_texto_80,
        marginBottom: 5,
        fontFamily: Fonts.$poppinsmedium
    },
    cuentaRegresiva: {
        fontSize: 30,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$parqueo_color_texto,
        marginVertical: 10,
    },
    vencido: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: '#DC3545',
        marginVertical: 10,
    },
    botonFinalizar: {
        width: '80%',
        alignItems: 'center',
        backgroundColor: Colors.$parqueo_color_secundario,
        borderRadius: 20,
        padding: 10,
        marginTop: 20,
        fontFamily: Fonts.$poppinsregular
    },
    botonFinalizarText: {
        color: Colors.$parqueo_color_fondo,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular
    }
});

function mapStateToProps(state) {
    return {
        dataParqueo: state.reducerParqueadero,
        dataRent: state.reducer3G,
    };
}

export default connect(mapStateToProps)(ParqueoActivo_parqueadero);
