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
    finalizar_parqueo
} from '../../actions/actionParqueadero';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import Bluetooth from './ConnectionBLE';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

function ParqueoActivo(props) {
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
                    onPress: () => dispatch(finalizar_parqueo(data, 'electrohub'))
                }
            ]
        );
    };

    const irCalificar = () => { 
        setTiempoRestante(null);
        setFill(0);
        setVencido(false);
        RootNavigation.navigate('Calificar_parqueo');
    }

    function quitarUltimosTres(str) {
        return str.slice(0, -3);
    }

    return (
        <SafeAreaView style={styles.contenedor}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {
                    props.dataParqueo.parqueo_finalizado ? 
                    <View style={styles.card}>
                        <Text style={styles.titulo}>Parqueo terminó correctamente.</Text>
                        
                        {<Bluetooth 
                            mac={dataParqueo.parqueo_lugar.bluetooth} 
                            macCargado={true}
                            claveHC05={dataParqueo.parqueo_lugar.clave+0}//se envía la clave concatenada con cero
                            claveHC05Cargada={true}
                            numVehiculo={dataParqueo.parqueo_lugar.numero}
                            dataVehiculo={null}
                            dataParqueo={props.dataParqueo.parqueo_lugar}
                            finalizando_con={true}
                            apagando={true}
                            siParqueoActivo={props.dataParqueo.si_parqueo_activo}
                        />}

                        {<Pressable
                            style={styles.botonFinalizar}
                            onPress={() => irCalificar()}>
                            <Text style={styles.botonFinalizarText}>Calificar</Text>
                        </Pressable>}
                    </View>
                    :
                    <View style={styles.card}>
                        <Text style={styles.titulo}>Parqueo Activo</Text>
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
                                    : <Image source={Images.ImagenScoterParqueo} style={{width: 120, height: 120, marginTop: 40, marginBottom: 40}}/> 
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
                            <Text style={styles.texto}>Estación: {dataParqueo.parqueo_lugar.numero}</Text>
                        </View>
                        
                        
                        {<Pressable
                            style={styles.botonFinalizar}
                            onPress={() => finalizarParqueo(dataParqueo)}>
                            <Text style={styles.botonFinalizarText}>Finalizar Parqueo</Text>
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
    };
}

export default connect(mapStateToProps)(ParqueoActivo);
