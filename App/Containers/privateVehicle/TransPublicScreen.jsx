import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { 
    saveVehicleSelect
} from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import Colors from '../../Themes/Colors';
import estilos from './styles/transPublico.style';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';

function TransPublicScreen(props){

    const { infoUser } = useContext( AuthContext );
    const dispatch = useDispatch();

    const [ state , setState ] = useState({
        user: '1111',
        numVehiculo: null,
        transporte: '',
    });

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
    }

    const verState2 = () => { 
        console.log('EL STATE ACT::::: ', props) 
        console.log('MY VEHICLES::::: ', props.dataRent.myVehiclesVP) 
    }
    
    const goBack = () => {
        RootNavigation.navigate('VehiculoParticular');
        console.log('atras');
    }
    const home = () => {
        RootNavigation.navigate('Home');
    }

    

    const irAviaje = (medio) => {
        dispatch(saveVehicleSelect(medio));
        if (medio === 'avion') {
            RootNavigation.navigate('AvionScreen');
        }else {
            RootNavigation.navigate('StartTripScreen');
        }
    }
   
    return (
        
        <ImageBackground source={Images.grayBackground} style={estilos.generales}>
            <SafeAreaView style={estilos.safeArea}>
                <ScrollView>
                    <View style={estilos.contenedor}>
                        

                        <View style={estilos.boxPrincipalItems}>
                                <Text style={estilos.title}>Medios de Transporte público</Text>
                                
                           
                                <TouchableOpacity 
                                    onPress={() => { irAviaje('avion')}} 
                                    style={ estilos.btnVehiculos }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.avion_Icon} style={[estilos.iconBici, {tintColor : 'black'}]}/>
                                        <Text style={estilos.textVehiculo}>Avión</Text> 
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { irAviaje('taxi')}} 
                                    style={ estilos.btnVehiculos }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.taxi_Icon} style={[estilos.iconBici, {tintColor : 'black'}]}/>
                                        <Text style={estilos.textVehiculo}>Taxi</Text> 
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { irAviaje('bus')}} 
                                    style={ estilos.btnVehiculos }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.bus_Icon} style={[estilos.iconBici, {tintColor : 'black'}]}/>
                                        <Text style={estilos.textVehiculo}>Bus</Text> 
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { irAviaje('metro')}} 
                                    style={ estilos.btnVehiculos }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.metro_Icon} style={[estilos.iconBici, {tintColor : 'black'}]}/>
                                        <Text style={estilos.textVehiculo}>Metro</Text> 
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { irAviaje('tren')}} 
                                    style={ estilos.btnVehiculos }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                    <Image source={Images.tren_Icon} style={[estilos.iconBici, {tintColor : 'black'}]}/>
                                        <Text style={estilos.textVehiculo}>Tren</Text> 
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { RootNavigation.navigate('VehiculoParticular') }} 
                                    style={ estilos.btnVehiculos }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                    <Image source={Images.misvehiculos_Icon} style={[estilos.iconBici, {tintColor : 'black'}]}/>
                                        <Text style={estilos.textVehiculo}>Mis vehículos</Text> 
                                    </View>
                                </TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
    
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
    }
}

export default connect(mapStateToProps)(TransPublicScreen);