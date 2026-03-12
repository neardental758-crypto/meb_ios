/* eslint-disable prettier/prettier */
/**
 * Home5G - Movilidad 5G Module
 * Landing screen for the 5G bicycle mobility module
 */

import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ImageBackground,
    Image,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { movilidad5gActions } from '../../actions/movilidad5gActions';
import { getItem } from '../../Services/storage.service';
import { Env } from '../../Utils/enviroments';
import { fetch as customFetch } from '../../Services/refresh.service';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';

const { width } = Dimensions.get('window');

function Home5G(props) {
    const { infoUser } = useContext(AuthContext);
    const [checkingTrip, setCheckingTrip] = useState(true);

    useEffect(() => {
        props.clearError();
        checkActiveTrip();
    }, []);

    const checkActiveTrip = async () => {
        try {
            if (props.activeTrip) {
                console.log('🚴 Active 5G trip found in Redux, redirecting to TripScreen5G');
                RootNavigation.navigate('TripScreen5G');
                return;
            }

            const user = await getItem('user');
            if (user?.idNumber) {
                console.log('🔍 Checking active 5G trips for user:', user.idNumber);
                const url = Env.apiUrlMysql + 'bc_prestamos/prestamoActivo/' + user.idNumber;
                const response = await customFetch(url, { method: 'GET' });
                console.log('🔍 Active trip API response:', JSON.stringify(response?.body));

                if (response?.body?.data && response.body.data.length > 0) {
                    const active5gTrip = response.body.data.find(
                        (trip) => trip.pre_modulo === '5g' || trip.pre_dispositivo?.includes('5g')
                    );

                    if (active5gTrip) {
                        console.log('🚴 Active 5G trip found in DB:', active5gTrip.pre_id);
                        const tripData = {
                            id: active5gTrip.pre_id,
                            pre_id: active5gTrip.pre_id,
                            pre_usuario: active5gTrip.pre_usuario,
                            userId: user.id,
                            bikeId: active5gTrip.pre_bicicleta,
                            startTime: active5gTrip.pre_retiro_fecha,
                            status: 'active',
                        };
                        props.setActiveTripId(String(active5gTrip.pre_id));
                        props.setTripInformation(tripData);
                        await AsyncStorage.setItem('activeTrip5g', JSON.stringify(tripData));

                        RootNavigation.navigate('TripScreen5G');
                        return;
                    }
                }
            }

            const storedTrip = await AsyncStorage.getItem('activeTrip5g');
            if (storedTrip) {
                const tripData = JSON.parse(storedTrip);
                console.log('🚴 Active 5G trip found in AsyncStorage, restoring and redirecting', tripData);

                if (tripData.pre_id) {
                    props.setActiveTripId(String(tripData.pre_id));
                    props.setTripInformation(tripData);
                }

                RootNavigation.navigate('TripScreen5G');
                return;
            }

            console.log('✅ No active 5G trip found');
        } catch (error) {
            console.error('Error checking active 5G trip:', error);
        } finally {
            setCheckingTrip(false);
        }
    };

    const navigateToQrScanner = () => {
        RootNavigation.navigate('QrScanScreen5G');
    };

    const navigateBackToMainHome = () => {
        RootNavigation.navigate('Home');
    };

    if (checkingTrip) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.$primario} />
                <Text style={{ marginTop: 10, fontFamily: Fonts.$poppinsregular, color: Colors.$texto50 }}>
                    Verificando viaje activo...
                </Text>
            </View>
        );
    }

    return (
        <ImageBackground source={Images.fondoMapa} style={styles.imgFondo}>
            <View style={styles.contenedor}>
                {/* Botón Atrás Transparente (Estilo 3G) */}
                <View style={styles.cajaCabeza}>
                    <Pressable
                        onPress={navigateBackToMainHome}
                        style={styles.btnAtras}>
                        <View>
                            <Image source={Images.menu_icon} style={styles.iconMenu} />
                        </View>
                    </Pressable>
                </View>

                {/* Título Central Top */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>
                        Movilidad 5G
                    </Text>
                </View>

                {/* Animación Central Lottie */}
                <View style={styles.lottieContainer}>
                    <LottieView
                        source={require('../../Resources/Lotties/home5g.json')}
                        autoPlay
                        loop
                        style={styles.lottieViewProps}
                    />
                </View>

                {/* Botón Flotante Leer Candado */}
                <View style={styles.containerButtons}>
                    <Pressable
                        style={styles.button}
                        onPress={navigateToQrScanner}
                        disabled={!!props.activeTrip}
                    >
                        <Text style={styles.textButton}>
                            {props.activeTrip ? 'Finaliza tu viaje actual' : 'Leer candado'}
                        </Text>
                    </Pressable>
                </View>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.$fondo,
    },
    imgFondo: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    contenedor: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 40,
    },
    cajaCabeza: {
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 1,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0
    },
    btnAtras: {
        position: 'absolute',
        top: 30,
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    welcomeContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 26,
        fontFamily: Fonts.$poppinsbold,
        color: Colors.$blanco,
        textAlign: 'center'
    },
    lottieContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: Dimensions.get('window').width,
    },
    lottieViewProps: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 1.2,
    },
    containerButtons: {
        marginTop: 15,
        marginBottom: Dimensions.get('window').height * 0.05,
        alignSelf: 'center',
    },
    button: {
        width: Dimensions.get('window').width * 0.6,
        padding: 12,
        backgroundColor: Colors.$primario,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButton: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 20,
        color: Colors.$blanco,
        alignSelf: "center",
    },
});

const mapStateToProps = (state) => ({
    activeTrip: state.movilidad5gReducer.activeTrip,
});

const mapDispatchToProps = (dispatch) => ({
    clearError: () => dispatch(movilidad5gActions.clearError()),
    setActiveTripId: (tripId) => dispatch(movilidad5gActions.setActiveTripId(tripId)),
    setTripInformation: (tripData) => dispatch(movilidad5gActions.setTripInformation(tripData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home5G);
