import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { 

} from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import estilos from './styles/estilos.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
// PUSH notification

function Ride8_Screen(props){
    const [ state , setState ] = useState({
        
    });

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
    }

    const verProps = () => {
        console.log('EL STATE ACT::::: ', props )
        AsyncStorage.getItem('user').then((res) => {
            if (res !== null) {
              console.log( 'documentouser', res );
            }
          })
    }
    
    const goBack = () => {
        props.navigation.goBack();
    }

    const next = () => {
        props.navigationProp.navigate('Ride9_Screen')
    }   
    return (
        <ImageBackground source={Images.grayBackground} style={estilos.generales}>
            <SafeAreaView style={estilos.safeArea}>
                <Content style={estilos.contenedor}>

                    <View style={estilos.contentTop}>
                        <TouchableOpacity onPress={() => { goBack() }} style={{ width: 100}}>
                            <View style={estilos.btnBack}>
                                <Image source={Images.goBackWhite} />
                            </View>
                        </TouchableOpacity>
                        <View style={estilos.subRaya} />
                    </View>

                        <View>      
                        <Image 
                            source={Images.Ride8} 
                            style={{ 
                                width: 400, 
                                height: 900, 
                                alignSelf: 'center'}} 
                        />
                        <TouchableOpacity 
                            onPress={() => {  next() }}
                            style={estilos.btnCenter}
                        >
                            <Text style={estilos.btnSaveColor}>SIGUIENTE</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </SafeAreaView>
        </ImageBackground>
    );
    
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        navigationProp: state.globalReducer.nav._navigation,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Ride8_Screen);