/* eslint-disable prettier/prettier */
/**
 * TripScreen5G - Movilidad 5G Module
 * Active trip screen for the 5G bicycle mobility module
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Platform,
    Dimensions,
    PermissionsAndroid,
    SafeAreaView
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Moment from 'moment';
import { Env } from "../../Utils/enviroments";
import { BackgroundTask } from '../ViajeActivo/BackgroundTask';
import { setItem, getItem } from '../../Services/storage.service';
import { getPermissions, startCalculateTime, endCalculateTime, getStations, calculateTripTime } from '../../actions/actions';
import { connect } from 'react-redux';
import { movilidad5gActions } from '../../actions/movilidad5gActions';
import * as RootNavigation from '../../RootNavigation';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { styles } from './styles/movilidad5g.style';

function TripScreen5G(props) {
    const [timer, setTimer] = useState('00:00:00');
    const [startTime] = useState(new Date());

    // Tracking & Map state
    const [iniciarRastreo, setIniciarRastreo] = useState(false);
    const [position, setPosition] = useState({ lat: 4.66597713, lng: -74.05369725 });
    const [outOfScreen, setOutOfScreen] = useState(false);
    const [terminando, setTerminando] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = now.getTime() - startTime.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimer(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    useEffect(() => {
        let dateLocation = new Date();
        setItem('lastLocationDate', dateLocation);
        setItem('appStateTrip', 'foreground');

        if (Env.modo === 'movil') {
            setIniciarRastreo(true);
        }

        props.startCalculateTime();
        props.getPermissions();

        if (props.tripInformation?.organizationId) {
            props.getStations(props.tripInformation.organizationId);
        }
        setOutOfScreen(false);

        Geolocation.getCurrentPosition(
            (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (e) => props.getPermissions(),
            Platform.OS === 'android' ? { enableHighAccuracy: true, timeout: 20000 } : { enableHighAccuracy: true, timeout: 50000, maximumAge: 3600000 }
        );

        // Required to actually trigger the Redux Time Calculator
        const timeCalcTimeout = setTimeout(() => {
            if (props.calculateTripTime) {
                props.calculateTripTime();
            }
        }, 1000);

        const watchId = Geolocation.watchPosition(
            (pos) => {
                if (!outOfScreen) setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (e) => console.log('watch poistion error', e),
            { enableHighAccuracy: true, timeout: 3000, maximumAge: 0, distanceFilter: 1 }
        );

        return () => {
            clearTimeout(timeCalcTimeout);
            Geolocation.clearWatch(watchId);
            props.endCalculateTime();
            setOutOfScreen(true);
        };
    }, []);

    const terminadoTrip = (valor) => {
        if (valor) {
            handleEndTrip();
        }
    }

    const handleEndTrip = () => {
        Alert.alert(
            'Finalizar Viaje',
            '¿Estás seguro de que deseas finalizar tu viaje?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Finalizar',
                    onPress: () => {
                        props.endTrip(props.activeTripId, '', props.tripInformation);
                    }
                },
            ]
        );
    };

    const handleResetLock = () => {
        Alert.alert(
            "Abrir candado",
            "¿Deseas intentar abrir el candado vía Bluetooth?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Abrir",
                    onPress: () => {
                        props.resetLock(
                            props.lock.mac,
                            props.lock.id,
                            props.lock.imei
                        );
                    }
                }
            ]
        );
    };

    const routingSupport = () => {
        // Mock support routing, as per original TripScreen
        Alert.alert("Soporte", "Contactando con soporte...");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerSpacer} />
                <Text style={styles.headerTitle}>Viaje en Curso</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={{ flex: 1, backgroundColor: Colors.$fondo, marginTop: 10, marginBottom: 10 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <BackgroundTask
                    terminadoTrip={terminadoTrip}
                    time={props.actualTripTime}
                    minutes={props.actualTripMinutes}
                    iniciar={iniciarRastreo}
                    modo={Env.modo}
                    estacionPrestamo={props.tripInformation?.pre_retiro_estacion || 'Estacion'}
                />

                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Pressable
                        style={[styles.controlButton, { backgroundColor: Colors.$error, width: '90%' }]}
                        onPress={handleEndTrip}
                    >
                        <Text style={styles.controlButtonText}>Finalizar Viaje</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Floating Support Button (Top Left) - Replicating working TripScreen */}
            <View style={{
                position: 'absolute',
                top: 100,
                left: 20,
                zIndex: 999,
            }}>
                <Pressable
                    onPress={routingSupport}
                    style={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#333',
                        borderRadius: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.30,
                        shadowRadius: 4.65,
                    }}>
                    <Text style={{ fontSize: 30 }}>📞</Text>
                    <Text style={{
                        color: 'white',
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 9,
                        marginTop: 2,
                        textAlign: 'center'
                    }}>SOPORTE</Text>
                </Pressable>
            </View>

            {/* Floating Unlock Button (Top Left, below Support) - Replicating working TripScreen */}
            <View style={{
                position: 'absolute',
                top: 200,
                left: 20,
                zIndex: 999,
            }}>
                <Pressable
                    onPress={handleResetLock}
                    style={{
                        width: 80,
                        height: 80,
                        backgroundColor: Colors.$primario,
                        borderRadius: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.30,
                        shadowRadius: 4.65,
                    }}>
                    <Text style={{ fontSize: 30 }}>🔓</Text>
                    <Text style={{
                        color: 'white',
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 9,
                        marginTop: 2,
                        textAlign: 'center'
                    }}>ABRIR</Text>
                </Pressable>
            </View>

            {/* Loading Indicator for Operations */}
            {(props.loading || props.loadingLock) && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }]}>
                    <ActivityIndicator size="large" color={Colors.$primario} />
                    <Text style={{ marginTop: 10, fontFamily: Fonts.$poppinsmedium, color: Colors.$texto }}>
                        {props.loadingLock ? 'Comunicando con el candado...' : 'Procesando...'}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const mapStateToProps = (state) => ({
    lock: state.movilidad5gReducer?.lock || {},
    bike: state.movilidad5gReducer?.bike || {},
    activeTripId: state.movilidad5gReducer?.activeTrip,
    tripInformation: state.movilidad5gReducer?.tripInformation || {},
    connectionState: state.movilidad5gReducer?.connectionState,
    loading: state.movilidad5gReducer?.loading,
    loadingLock: state.movilidad5gReducer?.loadingLock,
    stations: state.mapReducer?.stations || [],
    actualTripTime: state.userReducer?.actualTripTime,
    actualTripMinutes: state.userReducer?.actualTripMinutes,
});

const mapDispatchToProps = (dispatch) => ({
    endTrip: (tripId, endStationId, info) => dispatch(movilidad5gActions.endTrip(tripId, endStationId, info)),
    resetLock: (mac, id, imei) => dispatch(movilidad5gActions.resetLock(mac, id, imei)),
    getStations: (orgId) => dispatch(getStations(orgId)),
    startCalculateTime: () => dispatch(startCalculateTime()),
    endCalculateTime: () => dispatch(endCalculateTime()),
    calculateTripTime: () => dispatch(calculateTripTime()),
    getPermissions: () => dispatch(getPermissions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripScreen5G);
