import { ActivityIndicator, Image, ImageBackground, Modal, Platform, SafeAreaView, Text, TouchableNativeFeedbackBase, TouchableOpacity, View, Dimensions, Pressable, StyleSheet } from 'react-native'
import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as React from 'react'
import { Component } from 'react'
import { appActions, getPermissions } from '../../actions/actions';
import { getActiveTrip, getTripUser, verifyLockResume } from "../../actions/rideActions";
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Geolocation from 'react-native-geolocation-service';
import Images from '../../Themes/Images';
//import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import { styles } from './Styles/QrCodeScreen.style';
import * as RootNavigation from '../../RootNavigation';

export class TripEndScreen extends Component<any, any> {
    // static navigationOptions = {       //icon
    //     drawerLabel: 'Fin',
    //     drawerIcon: ({ tintColor }: any) => (
    //         <Image
    //             source={Images.whiteBk}
    //             style={{ width: 35, height: 25, tintColor: tintColor }}
    //         />
    //     ),
    // };
    constructor(props: any) {
        super(props);
        this.state = {
            socket: null,
            position: {}
        }
    }
    componentDidMount() {
        this.props.getTripUser();
        Geolocation.getCurrentPosition(
            this.geoSuccess
        );
        //this.props.getPermissions();
        console.log('las coordenadas son ::::', this.props.coordinates.length)
    }

    geoSuccess = (positionActual: any) => {
        let { latitude, longitude } = positionActual.coords
        // updating state 
        this.setState({
            position: {
                lat: latitude,
                lng: longitude
            }
        })
    }

    resumeTrip() {
        this.props.verifyLockResume();
    }

    goBack = () => {
        this.props.navigation.goBack();
    }
    navigateFinishingScreen = () => {
        //RootNavigation.navigate('FinishingScreen');
        RootNavigation.navigate('VerificationsScreent');
    }

    secondsToHour(second: any) {
        const sec = parseInt(second, 10); // convert value to number if it's string
        let hours: any = Math.floor(sec / 3600); // get hours
        let minutes: any = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds: any = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ":" + minutes + ":" + seconds;
    }

    renderLoading() {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Cargando tu viaje...</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    renderEndLoading() {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: "#FFC300", flexDirection: "column", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Estamos finalizando tu viaje...</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    renderResumeLoading() {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: "#FFC300", flexDirection: "column", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: Fonts.$poppinsregular }}>Estamos validando que todo esté en orden...</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    renderLockLoading() {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: "#FFC300", flexDirection: "column", flex: 1 }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, marginTop: 20, fontFamily: Fonts.$poppinsregular, marginHorizontal: 20 }}>Validando la información del candado y del usuario para iniciar viaje....</Text>
                       
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        if (this.props.loadingLock) {
            return this.renderLockLoading()
        }
        if (this.props.loadingEnd) {
            return this.renderEndLoading();
        }
        if (this.props.loadingResume) {
            return this.renderResumeLoading();
        }
        if (this.props.loading) {
            return this.renderLoading();
        } else {
            return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ImageBackground source={Images.grayBackground} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: Colors.$texto20, margin: 20, paddingHorizontal: 5, borderRadius: 25 }}>
                    <TouchableOpacity onPress={() => { this.resumeTrip() }} style={styles.return}>
                        <View style={{ 
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: 50,
                            width: 100,
                        }}>
                            <Image style={{ width: 50, height: 50}} source={Images.iconoatras}></Image>
                            <Text style={{
                                fontSize: 20,
                                fontFamily: Fonts.$poppinsregular,
                                color: Colors.$texto
                            }}>Atras</Text>
                        </View>
                        
                    </TouchableOpacity>
                    <Text style={{
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 20,
                        width: "100%",
                        backgroundColor: Colors.$blanco,
                        textAlign: 'center',
                        marginTop: 20
                    }}>Mi viaje</Text>
                    {/*!this.props.coordinates.length || (this.props.coordinates[0].latitude == 0 && this.props.coordinates[0].longitude == 0) &&
                        <View style={{ flex: 0.2, borderWidth: 1, position: "absolute", top: 100, zIndex: 100, borderColor: "#97D077", backgroundColor: "rgba(255,255,255, 0.5)", width: "60%", height: "10%", justifyContent: "center", left: 70 }}>
                            <Text style={{ textAlign: "center", textAlignVertical: "center", fontFamily: "Aldo-SemiBold" }}>Al parecer este viaje no tiene coordenadas asociadas</Text>
                        </View>
                    */}
                    <MapView
                        loadingEnabled={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        showsScale={true}
                        showsUserLocation={true}
                        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                        style={{ flex: 1, width: 'auto', maxHeight: 300,  }}
                        region={{
                            latitude: this.props.coordinates[0]?.latitude ? this.props.coordinates[0]?.latitude : this.state.position.lat,
                            longitude: this.props.coordinates[0]?.longitude ? this.props.coordinates[0]?.longitude : this.state.position.lng,
                            latitudeDelta: 0.0421,
                            longitudeDelta: 0.0421,
                        }}
                        onMapReady={() => {
                            this.setState({ paddingTop: 5 })
                        }}
                    >
                        {
                            !!this.props.coordinates.length &&
                            <Polyline
                                coordinates={this.props.coordinates}
                                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                                strokeColors={[
                                    '#7F0000',
                                    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                                    '#B24112',
                                    '#E5845C',
                                    '#238C23',
                                    '#7F0000'
                                ]}
                                miterLimit={10000000}
                                strokeWidth={6}
                            />
                        }

                        {
                            this.props.coordinates
                                && this.props.coordinates[0] &&
                                <Marker
                                    key={this.props.coordinates[0].latitude}
                                    coordinate={{
                                        latitude: Number(this.props.coordinates[0].latitude ? this.props.coordinates[0].latitude : 0),
                                        longitude: Number(this.props.coordinates[0].longitude ? this.props.coordinates[0].longitude : 0),
                                    }}
                                    description={"This is a marker in React Native"}
                                >
                                    <Text style={{ textAlign: "center", color: "black" }}>{"Inicio"}</Text>
                                    <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../Resources/Images/flag.png')} ></Image>

                                </Marker>
                        }  
                        
                    </MapView>

                    {/*<MapView
                        loadingEnabled={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        showsScale={true}
                        showsUserLocation={true}
                        provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                        style={{ flex: 1, width: 'auto', maxHeight: 300,  }}
                        region={{
                            latitude: this.props.coordinates[0]?.latitude ? this.props.coordinates[0]?.latitude : 0,
                            longitude: this.props.coordinates[0]?.longitude ? this.props.coordinates[0]?.longitude : 0,
                            latitudeDelta: 0.0421,
                            longitudeDelta: 0.0421,
                        }}
                        onMapReady={() => {
                            this.setState({ paddingTop: 5 })
                        }}

                    >
                        {!!this.props.coordinates.length &&
                            <Polyline
                                coordinates={this.props.coordinates}
                                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                                strokeColors={[
                                    '#7F0000',
                                    '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                                    '#B24112',
                                    '#E5845C',
                                    '#238C23',
                                    '#7F0000'
                                ]}
                                miterLimit={10000000}
                                strokeWidth={6}
                            />}
                            {this.props.coordinates
                                && this.props.coordinates[0] &&
                                <Marker
                                    key={this.props.coordinates[0].latitude}
                                    coordinate={{
                                        latitude: Number(this.props.coordinates[0].latitude ? this.props.coordinates[0].latitude : 0),
                                        longitude: Number(this.props.coordinates[0].longitude ? this.props.coordinates[0].longitude : 0),
                                    }}
                                    description={"This is a marker in React Native"}
                                >
                                    <Text style={{ textAlign: "center", color: "black" }}>{"Inicio"}</Text>
                                    <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../Resources/Images/flag.png')} ></Image>

                                </Marker>}
                        {this.props.coordinates && this.props.coordinates[this.props.coordinates.length - 1] &&
                            <Marker
                                key={this.props.coordinates[this.props.coordinates.length - 1].latitude}
                                coordinate={{
                                    latitude: Number(this.props.coordinates[this.props.coordinates.length - 1].latitude),
                                    longitude: Number(this.props.coordinates[this.props.coordinates.length - 1].longitude),
                                }}
                                description={"This is a marker in React Native"}
                            >
                                <Text style={{ textAlign: "center", color: "black" }}>{"Fin"}</Text>
                                <Image style={{ height: 40, width: 40, resizeMode: "contain" }} source={require('../../Resources/Images/flag.png')} ></Image>

                            </Marker>
                        }
                    </MapView>*/}

                    
                    <View style={{ marginTop: 10, marginBottom: 30, backgroundColor: Colors.$blanco, paddingLeft: 40, paddingVertical: 10, borderRadius: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Image style={{ height: 30, width: 30, marginLeft: 5, tintColor: Colors.$texto }} source={require('../../Resources/Icons/reloj.png')} />
                            <Text style={{ fontSize: 15, marginTop: 1, marginHorizontal: 5, fontFamily: Fonts.$poppinsregular, alignSelf: 'center', color: '#878787' }}>Tiempo:</Text>
                            <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular, marginTop: 5, color: '#878787' }}>{this.secondsToHour(this.props.userTripInformation.time)}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Image style={{ height: 30, width: 30, marginLeft: 5, tintColor: Colors.$texto }} source={require('../../Resources/Icons/Bike.png')} />
                            <Text style={{ fontSize: 15, marginTop: 1, marginHorizontal: 5, fontFamily: Fonts.$poppinsregular, alignSelf: 'center', color: '#878787' }}>Distancia:</Text>
                            <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular, marginTop: 5, color: '#878787' }}>{parseFloat(this.props.userTripInformation.distance).toFixed(4) + " Km"}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Image style={{ height: 20, width: 30, marginLeft: 5,  }} source={require('../../Resources/Icons/co2.png')} />
                            <Text style={{ fontSize: 15, marginTop: 1, marginHorizontal: 5, fontFamily: Fonts.$poppinsregular, alignSelf: 'center', color: '#878787' }}>Co2:</Text>
                            <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular, marginTop: 5, color: '#878787' }}>{parseFloat(this.props.userTripInformation.co2).toFixed() + " Co2"}</Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Image style={{ height: 30, width: 30, marginLeft: 5, tintColor: Colors.$texto }} source={require('../../Resources/Icons/calories.png')} />
                            <Text style={{ fontSize: 15, marginTop: 1, marginHorizontal: 5, fontFamily: Fonts.$poppinsregular, alignSelf: 'center', color: '#878787' }}>Calorias:</Text>
                            <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular, marginTop: 5, color: '#878787' }}>{parseFloat(this.props.userTripInformation.calories).toFixed()}</Text>
                        </View>
                    </View>

                    <View style={{ width: 300, height: 100, alignSelf: 'center', }}>
                        
                        <Pressable 
                            onPress={() => { this.navigateFinishingScreen() }} 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$primario,
                            borderRadius : 50}}> 
                            <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Finalizar Viaje</Text>
                        </Pressable>
                    </View>
                    <View style={{ width: 300, height: 100, alignSelf: 'center' }}>                    
                        <Pressable 
                            onPress={() => { this.resumeTrip() }}
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$primario,
                            borderRadius : 50}}> 
                            <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Reanudar Viaje</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </ImageBackground>
            </View>
            )
        }
    }
}

const estilos = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderRadius: 1,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 10
    },
    btnAtras:{
        position: 'absolute',
        top: 10, 
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
    textButton : {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 18, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
    },
});

function mapStateToProps(state: any) {
    return {
        userTripInformation: state.rideReducer.userTripInformation,
        coordinates: state.rideReducer.coordinates,
        loading: state.rideReducer.loading,
        loadingLock: state.rideReducer.loadingLock,
        loadingEnd: state.rideReducer.loadingEnd,
        loadingResume: state.rideReducer.loadingResume
    }
}

function mapDispatchtoProps(dispatch: any) {
    return {
        getPermissions: () => dispatch(getPermissions()),
        getTripUser: () => dispatch(getTripUser()),
        getActiveTrip: () => dispatch(getActiveTrip()),
        verifyLockResume: () => dispatch(verifyLockResume()),
        getCurrentLocation: () => dispatch(appActions.getCurrentLocation())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchtoProps
)(TripEndScreen);