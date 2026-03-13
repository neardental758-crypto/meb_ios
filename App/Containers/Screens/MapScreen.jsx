import {
    Button,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Easing,
    StyleSheet,
    Dimensions
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import {
    getPermissions,
    getStations,
} from '../../actions/actions';
import {
    ask_practice,
    ask_theoretical,
    get_schedule
} from '../../actions/actionCarpooling';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
import React, { useState, useEffect, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Images from '../../Themes/Images';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { KeyboardAvoidingView } from 'react-native';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Fonts from '../../Themes/Fonts';
import { Env } from "../../Utils/enviroments";

const mapRef = React.createRef();

function MapScreen(props) {

    const { isLogin, token, infoUser } = useContext(AuthContext)

    const dispatch = useDispatch();
    const [state, setState] = useState({
        socket: null,
        position: {},
        isOpenBackgroundInfoModal: false,
        coordenadasCargadas: false,
    });

    const [preload, setPreload] = React.useState(false);
    const rotation = new Animated.Value(0);

    useEffect(() => {

        if (Platform.OS == 'ios') {
            //props.getPermissions();

            //Geolocation.requestAuthorization("always");
            //getPosition();
            dispatch(getPermissions());
            //PERMISSIONS.IOS.LOCATION_WHEN_IN_USE


        }
        const rotateAnimation = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        rotateAnimation.start();
    }, [rotation]);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        verCoordenadas();
    }, []);

    const verCoordenadas = async () => {
        await getPosition()
        await dispatch(ask_practice());
        await dispatch(ask_theoretical());
        await dispatch(get_schedule());
    }

    useEffect(() => {
        if (!props.isValidatedPractise) {
            dispatch(ask_practice());
        }
    }, [props.isValidatedPractise])

    useEffect(() => {
        if (!props.isValidatedTheory) {
            dispatch(ask_theoretical());
        }
    }, [props.isValidatedTheory])

    const verCoordenadas2 = () => {
        getPosition()
        dispatch(getStations());
    }

    useFocusEffect(
        React.useCallback(() => {
            verCoordenadas();
            dispatch(getStations());
        }, [])
    );

    useEffect(() => {
        const checkLocationPermission = async () => {
            try {
                if (Platform.OS === 'ios') {
                    const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
                    if (result === 'granted') {
                        console.log('Permiso concedido');
                    } else {
                        console.log('Permiso denegado');
                    }
                }
            } catch (error) {
                console.error('Error al solicitar permisos:', error);
            }
        }
        checkLocationPermission();
    });




    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
    }

    const getPosition = () => {
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
    }
    // Get geo position setup 
    geoSetup = Platform.OS == "ios" ? {
        enableHighAccuracy: true,
        timeout: 100000
    } : {
        enableHighAccuracy: true,
        timeout: 100000,
        maximumAge: 3600000
    }

    // When get position is success, update state 
    const geoSuccess = (positionActual) => {
        let { latitude, longitude } = positionActual.coords
        // updating state 
        setState({
            ...state,
            position: {
                lat: latitude,
                lng: longitude
            },
            coordenadasCargadas: true
        })
    }

    const openBackgroundInfoModal = () => {
        return (
            <Modal transparent={true} animationType="slide" visible={true}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(52, 52, 52, 0.9)' }}
                >
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: moderateScale(20),
                        width: "90%",
                        alignItems: "center"
                    }}>
                        <Image
                            style={{ width: moderateScale(250), height: moderateScale(80), padding: moderateScale(20) }}
                            source={Images.rideLoginBlack}
                        />

                        <Text style={{ textAlign: "center", color: Colors.$texto, fontSize: 20, fontFamily: Fonts.$poppinsmedium, marginTop: 20 }}>
                            Acceso a tu ubicación
                        </Text>

                        <Text style={{ textAlign: "justify", color: Colors.$texto80, fontSize: 16, marginTop: 20, fontFamily: Fonts.$poppinsregular }}>
                            La aplicación requiere acceder a tu ubicación incluso cuando está no está en uso. Utilizaremos la información únicamente con la finalidad de entender tus patrones de movilidad y registrar tus viajes.
                        </Text>

                        <Image
                            style={{ marginTop: moderateScale(20), width: horizontalScale(180), height: verticalScale(160) }}
                            source={Images.mapa}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScale(20) }}>
                            <TouchableOpacity
                                style={{ backgroundColor: Colors.$primer, padding: moderateScale(10), borderRadius: moderateScale(5), marginHorizontal: 8 }}
                                onPress={() => displayBackgroundInfoModal(false)}
                            >
                                <Text style={{ fontSize: moderateScale(20) }}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ backgroundColor: Colors.$primer, padding: moderateScale(10), borderRadius: moderateScale(5), marginHorizontal: 8 }}
                                onPress={() => {
                                    dispatch(getPermissions());
                                    displayBackgroundInfoModal(false);
                                }}
                            >
                                <Text style={{ fontSize: moderateScale(20) }}>Aprobar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    };


    // When get geo position fail 
    const geoFailed = (error) => {
        //Alert.alert('Error al obtener ubicación')
        console.log("error de ubicación", error)
        if (Platform.OS === 'android' && !state.isOpenBackgroundInfoModal && error) {
            displayBackgroundInfoModal(true)
        }
    }

    /*const verUserInfo = () => {
        console.log('la info del usuario es :::', infoUser.DataUser.organizationId);
        dispatch(getStations(infoUser.DataUser.organizationId));
    }*/

    return (
        <>
            {state.isOpenBackgroundInfoModal ? openBackgroundInfoModal() : <></>}
            <SafeAreaView style={[{ flex: 1 }, { backgroundColor: Colors.$gray }]}>
                {state.coordenadasCargadas ?
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
                            latitude: state.position.lat ? state.position.lat : 0,
                            longitude: state.position.lng ? state.position.lng : 0,
                            latitudeDelta: 0.0421,
                            longitudeDelta: 0.0421,
                        }}
                        onMapReady={() => {
                            setState({ ...state, paddingTop: 5 })
                        }}
                    >
                        {
                            Array.isArray(props.stations) && Env.modo === 'movil' ?
                                <>{
                                    props.stations.map((station) => {
                                        return (
                                            <Marker
                                                key={station.id}
                                                coordinate={{
                                                    latitude: Number(station.latitude),
                                                    longitude: Number(station.longitude),
                                                }}
                                                description={"This is a marker in React Native"}
                                            >
                                                <View style={{ height: 30, width: 30, backgroundColor: station.electricBikes + station.mechanicBikes + station.cargoBikes == 0 ? "red" : "green", borderRadius: 100, justifyContent: "center" }}>
                                                    <Text style={{ textAlign: "center", color: "white" }}>{station.electricBikes + station.mechanicBikes + station.cargoBikes}</Text>
                                                </View>
                                                <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../Resources/Images/garaje.png')} ></Image>

                                                <Callout tooltip style={{ flex: 1, width: 250, height: 'auto', flexDirection: "column" }}>
                                                    <View style={{ flex: 1, padding: 10 }}>
                                                        <View style={{ flex: 0.4, backgroundColor: Colors.$adicional, borderTopRightRadius: 10, borderTopLeftRadius: 10, justifyContent: "center", paddingVertical: 10 }}>
                                                            <Text style={{ fontSize: 15, textAlign: "center", color: "white", fontFamily: Fonts.$poppinsregular }}>{station.name}</Text>
                                                        </View>
                                                        <View style={{ flex: 0.7, backgroundColor: "#101010", paddingHorizontal: 20, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, paddingTop: 10, paddingBottom: 15 }}>
                                                            <Text style={{ fontSize: 10, textAlign: "left", color: "white" }}>Bicicletas disponibles: {station.electricBikes + station.mechanicBikes + station.cargoBikes ? station.cargoBikes : 0}</Text>
                                                            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 10, textAlign: "left", color: "white" }}>Eléctricas: {station.electricBikes}</Text>
                                                            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 10, textAlign: "left", color: "white" }}>Mecánicas: {station.mechanicBikes}</Text>
                                                            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 10, textAlign: "left", color: "white" }}>De carga: {station.cargoBikes ? station.cargoBikes : 0}</Text>
                                                            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 10, textAlign: "left", color: "white" }}>Capacidad de {station.bikesCapacity} bicicletas</Text>
                                                            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 10, textAlign: "left", color: "white" }}>Apertura: {Moment(station.openingTime).format("HH:mm a")}</Text>
                                                            <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 10, textAlign: "left", color: "white" }}>Cierre: {Moment(station.closingTime).format("HH:mm a")}</Text>
                                                        </View>
                                                    </View>
                                                </Callout>
                                            </Marker>)
                                    })
                                }</>
                                : null
                        }
                    </MapView>
                    :
                    <View style={stylesLoader.container}>
                        {!state.coordenadasCargadas ? verCoordenadas2() : <></>}
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: Dimensions.get('window').width,
                            height: 'auto',
                            position: "absolute",
                            top: 0,
                            zIndex: 1
                        }}>
                            {
                                Env.modo === 'tablet' ?
                                    ''
                                    :
                                    <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop
                                        style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height,
                                        }} />
                            }

                        </View>
                    </View>
                }
            </SafeAreaView>
        </>
    );
}

const stylesLoader = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'white'
    },
    spinner: {
        width: 50,
        height: 50,
        borderColor: '#333',
        borderWidth: 3,
        borderRadius: 25,
        borderTopWidth: 0,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
})

function mapStateToProps(state) {
    return {
        stations: state.mapReducer.stations,
        penalty: state.mapReducer.penalty,
        globalReducer: state.globalReducer,
        navigation: state.globalReducer,
        isValidatedPractise: state.reducerCarpooling.userPractise_isValidated,
        isValidatedTheory: state.reducerCarpooling.userTheoretical_isValidated,
    }
}

export default connect(mapStateToProps)(MapScreen);
