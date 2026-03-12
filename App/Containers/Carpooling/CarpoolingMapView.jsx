import { Button, Image, Modal, Platform, SafeAreaView, Text, TouchableOpacity, View, TextInput, StyleSheet } from 'react-native';
import MapView, {  Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Moment from 'moment';
import { getPermissions, getStations, routingIfHasTrip, socketConection, validatePenalty } from '../../actions/actions';
import Colors from '../../Themes/Colors';
import Geolocation from 'react-native-geolocation-service';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Images from '../../Themes/Images';

const mapRef = React.createRef();
function CarpoolingMapView (props){
    const [ state, setState ] = useState({
        socket: null,
        position: {},
        isOpenBackgroundInfoModal: false
    });

    const goBack = () => {
        props.navigation.goBack();
      }

    useEffect(() => {
        if(Platform.OS == 'ios'){
            props.getPermissions();
        }
        props.validatePenalty();
        props.getStations();
        getPosition();
        setTimeout(() => {
            props.routingIfHasTrip();
        }, 1500);
        setState({ ...state, socket: null, position: {} });
      }, []);

    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
    }

    const getPosition = () => {
        console.log('----getposition----')
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
    }
    // Get geo position setup 
    geoSetup = Platform.OS == "android" ? {
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
        setState({
            ...state,
            position: {
                lat: latitude,
                lng: longitude
            }
        })
    }

    const openBackgroundInfoModal = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
                height: 20,
            }}>
                <Modal transparent={true} animationType="slide">
                    <View style={{ backgroundColor: "rgba(52, 52, 52, 0.9)", flexDirection: "column", flex: 1 }}>
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                            <Image style={{
                                width: 60,
                                height: 60,
                            }} source={Images.bicycleicon} />

                            <Text style={{ textAlign: "center", color: "#818181", fontSize: 18, fontWeight: "700", marginTop: 20 }}>Acceso a tu ubicacion</Text>
                            <Text style={{ textAlign: "center", color: "#818181", fontSize: 14, fontWeight: "200", marginTop: 20 }}>Bicycle Capital quiere acceder a tu ubicación, incluso cuando la aplicación no está en uso</Text>
                            <Text style={{ textAlign: "center", color: "#818181", fontSize: 14, fontWeight: "200", marginTop: 20 }}>Necesitamos acceso todo el tiempo a tu ubicación para poder registrar tu ruta con la bicicleta mientras tienes el dispositivo en tu bolsillo, y luego poder calcular los indicadores de tu viaje</Text>
                            <Image style={{
                                marginTop: 20,
                                width: 200,
                                height: 120,
                            }} source={Images.mapa} />

                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Button
                                        title="Cancelar"
                                        color={Colors.$primario}
                                        onPress={() => { displayBackgroundInfoModal(false) }}
                                    />
                                </View>
                                <View style={{ marginLeft: 8 }}>
                                    <Button
                                        title="Aprobar"
                                        color={Colors.$primario}
                                        onPress={() => { props.getPermissions(), displayBackgroundInfoModal(false) }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }

    // When get geo position fail 
    const geoFailed = (error) => {
        //Alert.alert('Error al obtener ubicación')
        if (Platform.OS === 'android' && !state.isOpenBackgroundInfoModal) {
            displayBackgroundInfoModal(true)
        }
    }
        return (
            <>
    <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
      <View >
        <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
      </View>
    </TouchableOpacity>
                {state.isOpenBackgroundInfoModal ? openBackgroundInfoModal() : <></>}
                
                <SafeAreaView style={[{ flex: 1 }, { backgroundColor: Colors.$gray }]}>
                    <MapView
                        ref={mapRef}
                        loadingEnabled={true}
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
                    </MapView>
                    <View style={[styles.input,{ flexDirection : 'row' , justifyContent : 'flex-start', alignSelf : 'center' , alignItems : 'center', position : 'absolute', width : 300, marginTop : 50, flexDirection : 'row'}]}>
                        <Image style={{width : 30, height  : 30, marginStart : 20}} source={Images.puntoMap}></Image>
                            <TextInput
                                placeholder=''
                                placeholderTextColor={'black'}
                                style={{width : 280}}
                            />
                    </View>
                </SafeAreaView>
            </>
        );
}
const styles = StyleSheet.create({
    input: {
    borderWidth: 1,
    borderColor : Colors.$texto,
    fontSize : 18,
    backgroundColor : 'white',
    textAlign : 'center',
    borderRadius : 50
    }
  });

function mapStateToProps(state){
    return {
        dataUser: state.userReducer,
        stations: state.mapReducer.stations,
        penalty: state.mapReducer.penalty,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getStations: () => dispatch(getStations()),
        validatePenalty: () => dispatch(validatePenalty()),
        getPermissions: () => dispatch(getPermissions()),
        //socketConection: (props) => dispatch(socketConection(props)),
        routingIfHasTrip: () => dispatch(routingIfHasTrip())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CarpoolingMapView);
