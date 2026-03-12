import React, { useState, useEffect, useContext, useRef } from 'react';
import { Env } from "../../../keys";
import {
    verificarRecorrido,
    actDireccion,
    verifyTripActiveCache
} from '../../actions/actions3g'
import {
    BackHandler,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    Dimensions,
    Button,
    Linking,
    Pressable,
    Platform,
    Animated,
    Easing,
    Modal
} from 'react-native';
import Hyperlink from 'react-native-hyperlink'
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import HeaderNavComponent from '../../Components/HeaderNavComponent'
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import Colors from '../../Themes/Colors';
import MapScreen from './MapScreen';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import Geocoder from 'react-native-geocoding';
import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useFocusEffect } from '@react-navigation/native';
import { routingIfHasTrip, notificationPermissions } from '../../actions/actions';
import { patch__img, patch__calificacion } from '../../actions/actionCarpooling'
import { AuthContext } from '../../AuthContext';
import * as RootNavigation from '../../RootNavigation';
import { refreshToken } from '../../Services/refresh.service';
import { apiPerfil } from '../../api/apiPerfil';
import { connect, useDispatch } from 'react-redux';
import { getEstaciones } from '../../actions/actionPerfil'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Chatbot from '../Chatbot/Chatbot';

const mapRef = React.createRef();
const keyMap = Env.key_map_google;

function HomeScreen(props) {
    let backHandler;
    const dispatch = useDispatch();
    const { isLogin, token, dataUser, dataUser2, infoUser } = useContext(AuthContext)
    const [validandoRecorrido, setvalidandoRecorrido] = useState(true)
    const [modal, setModal] = useState(false)
    const [dirCasa, setDirCasa] = useState('')
    const [dirTrabajo, setDirTrabajo] = useState('')
    const [cargando, setCargando] = useState(false);
    const [position1, setPosition1] = useState({
        lat: '',
        lng: '',
    });
    const [position2, setPosition2] = useState({
        lat: '',
        lng: '',
    });
    const [distance, setDistance] = useState(null);
    const [pos1Cargada, setpos1Cargada] = useState(false)
    const [pos2Cargada, setpos2Cargada] = useState(false)
    const [ubicacionTrab, setUbicacionTrab] = useState('')
    const [account, setAccount] = useState(1)
    const [modalVisibleChat, setModalVisibleChat] = useState(false);

    // Animación para el icono del bot
    const animBob = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animBob, {
                    toValue: -10,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(animBob, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [animBob]);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(routingIfHasTrip());
        }, [])
    );

    const trearEstaciones = async () => {
        const correo_cor = infoUser.DataUser.email;
        let tablaEmail = 'bc_empresas/email/' + correo_cor;
        let emailCorporativo = await apiPerfil.get__empresa(tablaEmail);
        console.log('empresa por el correo corporativo es:', emailCorporativo);
        dispatch(getEstaciones(emailCorporativo.data[0].emp_nombre));
    }

    useEffect(() => {
        if (infoUser) {
            refreshToken()
            trearEstaciones();
        }
    }, [infoUser])

    useEffect(() => {
        //dispatch( patch__img() )
        //dispatch( patch__calificacion() )
    }, []);
    /**
     Versión de Android: 
     {  
        "OS": "android", 
        "Version": 34, 
        "__constants": 
        {
            "Brand": "google", 
            "Fingerprint": "google/sdk_gphone64_x86_64/emu64xa:14/UE1A.230829.036.A1/11228894:userdebug/dev-keys", 
            "Manufacturer": "Google", 
            "Model": "sdk_gphone64_x86_64", 
            "Release": "14", "Serial": "unknown", "ServerHost": "10.0.2.2:8081", "Version": 34, "isTesting": false, "reactNativeVersion": {"major": 0, "minor": 72, "patch": 0, "prerelease": null}, "uiMode": "normal"}, "constants": {"Brand": "google", "Fingerprint": "google/sdk_gphone64_x86_64/emu64xa:14/UE1A.230829.036.A1/11228894:userdebug/dev-keys", "Manufacturer": "Google", "Model": "sdk_gphone64_x86_64", "Release": "14", "Serial": "unknown", "ServerHost": "10.0.2.2:8081", "Version": 34, "isTesting": false, "reactNativeVersion": {"major": 0, "minor": 72, "patch": 0, "prerelease": null}, "uiMode": "normal"}, "isTV": false, "isTesting": false, "select": [Function select]}
    */

    useEffect(() => {
        //dispatch(verifyTripActiveCache())
        if (Platform.OS === 'android') {
            console.log('Versión de Android:', Platform.__constants.Release);
            if (Platform.__constants.Release >= '13') {
                dispatch(notificationPermissions());
            } else {
                console.log('Está versión no necesita permisos para notificación')
            }
        }

        refreshToken()
        setTimeout(function () {
            dispatch(routingIfHasTrip());
        }, 1000);

        backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => { return true; }
        );
        return () => {
            backHandler.remove();
        }
    }, []);

    useEffect(() => {
        dataUser()
    }, [isLogin === false])

    const verificandoRecorrido = async () => {
        //await dispatch(verificarRecorrido())
    }

    useEffect(() => {
        if (props.dataRent.recorrido === 'sin validar') {
            refreshToken();
            setTimeout(function () {
                verificandoRecorrido();
            }, 1000);
        }
    }, [props.dataRent.recorrido === 'sin validar'])

    useEffect(() => {
        if (props.dataRent.recorrido === 'vacio') {
            displayDireccionModal(true)
        }
    }, [props.dataRent.recorrido === 'vacio'])


    useEffect(() => {
        if (props.dataRent.estadoUser !== '') {
            setAccount(props.dataRent.estadoUser)
        }
    }, [props.dataRent.estadoUser !== ''])

    const displayDireccionModal = (value) => {
        setModal(value);
    }

    const validarCampos = () => {
        if (dirCasa !== '' && dirTrabajo !== '') {
            buscandoDir1()
        } else {
            Alert.alert(
                "Faltan campos por llenar",
                ":(",
                [
                    { text: "OK", onPress: () => console.log('ok') }
                ]
            );
        }
    }

    const buscandoDir1 = () => {
        Geocoder.init(keyMap, { language: "es" });
        Geocoder.from(dirCasa)
            .then(json => {
                var location1 = json.results[0].geometry.location;
                setpos1Cargada(true);
                setPosition1({
                    lat: location1.lat,
                    lng: location1.lng,
                })
            })
            .catch(error => console.warn(error));
        buscandoDir2();
    }

    const buscandoDir2 = () => {
        Geocoder.init(keyMap, { language: "es" });
        Geocoder.from(dirTrabajo)
            .then(json => {
                var location2 = json.results[0].geometry.location;
                setpos2Cargada(true);
                setPosition2({
                    lat: location2.lat,
                    lng: location2.lng,
                })
            })
            .catch(error => console.warn(error));
    }

    const saveDirUser = () => {
        let data = {
            "usu_dir_trabajo": dirTrabajo,
            "usu_dir_casa": dirCasa,
            "usu_recorrido": distance,
        }
        dispatch(actDireccion(data))
    }

    const direccionModal = () => {
        return (
            <View style={estilos.contenedorModal}>
                <View>
                    <Modal transparent={true} animationType="slide">
                        <View style={estilos.cajaModal}>
                            <View style={estilos.cajaModal2}>
                                <Text style={{ textAlign: "center", color: "#818181", fontSize: moderateScale(18), marginTop: 20 }}>Ubicación</Text>
                                <View>
                                    {<GooglePlacesAutocomplete
                                        placeholder='Dirección casa'
                                        onPress={(data, details = null) => {
                                            setDirCasa(data.description)
                                        }}
                                        query={{
                                            key: keyMap,
                                            language: 'es',
                                            components: 'country:co'  // Limitar resultados a Colombia
                                        }}
                                        redefinedPlaces={[]}
                                        styles={{
                                            container: {
                                                flex: 0,
                                            },
                                            textInputContainer: {
                                                borderWidth: 1,
                                                borderColor: Colors.$blanco,
                                                backgroundColor: Colors.$tercer,
                                                borderRadius: 5,
                                            },
                                            textInput: {
                                                fontSize: 18,
                                                backgroundColor: Colors.$tercer,
                                            },
                                            listView: {
                                                backgroundColor: '#fff',
                                            },
                                        }}
                                    />}
                                    {
                                        props.perfil.estacionesCargadas
                                            ?
                                            <>
                                                {
                                                    <View>
                                                        <RNPickerSelect
                                                            style={pickerSelectStyles}
                                                            placeholder={{ label: 'Sedes', value: '' }}
                                                            useNativeAndroidPickerStyle={false}
                                                            value={state.dirTrabajo}
                                                            onValueChange={
                                                                (value) => {
                                                                    setState({
                                                                        ...state,
                                                                        dirTrabajo: value
                                                                    })
                                                                }
                                                            }

                                                            items={props.perfil.estaciones.data.map(data =>
                                                                ({ label: data.est_estacion, value: data.est_direccion }))
                                                            }

                                                            Icon={() => {
                                                                return (
                                                                    <Image source={Images.iconPickerYellow} style={{ top: 15, right: 25, height: 25, width: 25, resizeMode: 'contain', tintColor: Colors.$texto }} />
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                }
                                            </>
                                            :
                                            <></>
                                    }

                                    {
                                        (pos2Cargada === true && pos2Cargada === true) ?
                                            <>
                                                <MapView
                                                    ref={mapRef}
                                                    loadingEnabled={true}
                                                    showsMyLocationButton={true}
                                                    showsCompass={true}
                                                    showsScale={true}
                                                    showsUserLocation={true}
                                                    provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                                                    style={{ flex: 1 }}
                                                    region={{
                                                        latitude: position1.lat ? position1.lat : 0,
                                                        longitude: position1.lng ? position1.lng : 0,
                                                        latitudeDelta: 0.0421,
                                                        longitudeDelta: 0.0421,
                                                    }}

                                                >
                                                    <Marker
                                                        draggable
                                                        key='1'
                                                        coordinate={{
                                                            latitude: Number(position1.lat),
                                                            longitude: Number(position1.lng),
                                                        }}
                                                        description={"casa"}
                                                    //onDragEnd={(direction) => state.position1(direction)}
                                                    />
                                                    <Marker
                                                        draggable
                                                        key='2'
                                                        coordinate={{
                                                            latitude: Number(position2.lat),
                                                            longitude: Number(position2.lng),
                                                        }}
                                                        description={"trabajo"}
                                                        onDragEnd={(direction) => state.position2(direction)}
                                                    />

                                                    <MapViewDirections
                                                        origin={{
                                                            latitude: Number(position1.lat),
                                                            longitude: Number(position1.lng),
                                                        }}
                                                        destination={{
                                                            latitude: Number(position2.lat),
                                                            longitude: Number(position2.lng),
                                                        }}
                                                        apikey={keyMap} //key 
                                                        strokeColor={Colors.$primario}
                                                        strokeWidth={6}
                                                        onReady={(result) => {
                                                            setDistance(result.distance); // Almacena la distancia calculada en el estado
                                                        }}
                                                    />
                                                </MapView>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        saveDirUser()
                                                        displayDireccionModal(false)
                                                    }}
                                                    style={estilos.btnAceptar}>
                                                    <Text>ACEPTAR {distance}</Text>
                                                </TouchableOpacity>
                                            </>
                                            :
                                            <>
                                                <View style={[pickerSelectStyles.margin, { flex: 1, alignItems: 'center' }]}>
                                                    <Image source={Images.iconoMapa} style={{ width: 300, height: 300, alignSelf: 'center', marginBottom: 30, marginTop: 30 }} />
                                                    <Text style={[{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(22), textAlign: 'center', color: '#606060', padding: 5 }]}>Por favor ingresa tu lugar de trabajo y de residencia.</Text>

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            validarCampos()
                                                            setCargando(true)
                                                        }}
                                                        style={estilos.btnCenter}
                                                    >
                                                        <Text style={estilos.btnSaveColor}>Calcular ruta</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                    }

                                </View>


                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }

    useEffect(() => {
        const time2 = setInterval(() => {
            refreshToken()
        }, 300000);
    }, [])

    const refreshAppInactiva = () => {
        refreshToken();
    }

    useEffect(() => {
        const loadStoredData = async () => {
            const wasTracking_vp = await AsyncStorage.getItem('isTrackingActive_vp');
            if (wasTracking_vp) {
                RootNavigation.navigate('StartTripScreen');
            }
        };
        loadStoredData();
    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            {(modal) ? direccionModal() : <></>}
            {props.dataRent.tokenInvalido ? refreshAppInactiva() : <></>}
            {
                account === 1 ?
                    <></>
                    :
                    <View style={estilos.caja_user_0}>
                        <Text style={estilos.user_0}>Cuenta NO activa</Text>
                        <Text style={estilos.user_1}>Para activar tu cuenta tienes que reservar test Drive a través del siguiente número de WhatsApp</Text>
                        <Text style={estilos.user_0}>3167792746</Text>
                    </View>
            }
            <MapScreen></MapScreen>
            {/* Floating Chatbot Button */}
            <Pressable onPress={() => setModalVisibleChat(true)} style={estilos.fabBot}>
                <View style={estilos.tooltipContainer}>
                    <Text style={estilos.tooltipText}>¿Necesitas ayuda?</Text>
                </View>
                <Animated.View style={{ transform: [{ translateY: animBob }] }}>
                    <Image source={Images.robot_bike} style={estilos.robotIcon} />
                </Animated.View>
            </Pressable>

            {/* Chatbot Modal */}
            <Modal
                visible={modalVisibleChat}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisibleChat(false)}>
                <View style={{ flex: 1 }}>
                    <Chatbot goBack={() => setModalVisibleChat(false)} />
                </View>
            </Modal>
        </View>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 13,
        paddingVertical: 8,
        borderBottomWidth: 1,
        backgroundColor: "transparent",
        paddingLeft: 15,
        marginLeft: 20,
        marginRight: 20,
        borderColor: Colors.$primario,
        borderWidth: 2,
        borderRadius: 25,
        marginTop: 15,
        color: 'red',
        height: 40,
        marginBottom: 30,
    },
    inputAndroid: {
        width: Dimensions.get("window").width * .9,
        fontSize: 20,
        paddingHorizontal: 20,
        paddingBottom: 10,
        color: Colors.$texto,
        backgroundColor: Colors.$tercer,
        height: 50,
    },
    placeholder: {
        color: Colors.$texto,
        fontSize: 20,
    },
    registerTitleContainer: {
        color: Colors.$blanco,
    },
    accountTitle: {
        marginBottom: 1,
    },

});

const estilos = StyleSheet.create({
    contenedorModal: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    caja_user_0: {
        width: Dimensions.get("window").width,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.$texto,
    },
    caja_user_1: {
        width: Dimensions.get("window").width,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.$texto,
    },
    btnRefresh: {
        width: 100,
        height: 50,
        backgroundColor: Colors.$primario,
    },
    user_0: {
        width: Dimensions.get("window").width * .8,
        textAlign: "center",
        fontSize: 16,
        color: Colors.$blanco,
    },
    user_1: {
        width: Dimensions.get("window").width * .8,
        textAlign: "center",
        fontSize: 14,
        color: Colors.$blanco,
    },
    botonItem: {
        backgroundColor: Colors.$primario,
        width: "50%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 5,
    },
    textBoton: {
        fontSize: 20,
    },
    cajaModal: {
        backgroundColor: "rgba(52, 52, 52, 0.9)",
        flexDirection: "column",
        flex: 1
    },
    cajaModal2: {
        flex: 3,
        borderRadius: 6,
        marginVertical: 20,
        marginHorizontal: 20,
        backgroundColor: Colors.$blanco,
        justifyContent: "space-around",
        alignItems: "center",
    },
    inputPlace: {
        flex: .5,
        backgroundColor: Colors.$primario,
        width: "100%",
        height: 100
    },
    inputDirCasa: {
        width: Dimensions.get("window").width * .9,
        backgroundColor: Colors.$tercer,
        fontSize: 20,
        paddingLeft: 20,
        color: Colors.$texto,
    },
    btnCenter: {
        width: Dimensions.get("window").width * .5,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$texto,
        height: 50,
        marginTop: 20
    },
    btnSaveColor: {
        color: '#fff',
        fontSize: 20,
    },
    btnAceptar: {
        width: Dimensions.get("window").width * .9,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$primario,
        height: 50,
        marginTop: 20
    },
    fabBot: {
        position: 'absolute',
        bottom: moderateScale(40),
        right: 0,
        width: Dimensions.get("window").width,
        height: moderateScale(100),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: horizontalScale(20),
        zIndex: 1000,
    },
    robotIcon: {
        width: moderateScale(75),
        height: moderateScale(75),
        resizeMode: 'contain',
    },
    tooltipContainer: {
        backgroundColor: Colors.$primario,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: horizontalScale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    tooltipText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco,
        fontWeight: '600',
    },
})

function mapStateToProps(state) {
    return {
        dataRent: state.reducer3G,
        perfil: state.reducerPerfil
    }
}

export default connect(mapStateToProps)(HomeScreen);
