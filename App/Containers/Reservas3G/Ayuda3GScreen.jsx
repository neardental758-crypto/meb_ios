import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Content } from 'native-base';
//Layout
import Images from '../../Themes/Images';
//Components
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import estilos from './styles/rentas.style';
import * as RootNavigation from '../../RootNavigation';

function Ayuda3GScreen (props) {
    const [ state, seStates ] = useState({})

    const goBack = () => {
        RootNavigation.navigate('Rentar') 
    }

    const verState = () => {
        console.log('ver state actualizado', this.state)
    }

    return (
        <SafeAreaView style={estilos.safeArea}>
            <ScrollView style={estilos.contenedor}>
                <View style={estilos.contentTop}>
                    <TouchableOpacity onPress={() => { goBack() }} style={estilos.btnBack}>
                        <Image source={Images.arrowBackBC} style={estilos.imgback}/>
                    </TouchableOpacity>
                    <Image source={Images.vpsoporte} style={estilos.vpsoporte}/>
                    <View style={estilos.contentTitle}>
                        <Text style={estilos.title}>
                        Ayuda
                        </Text>
                    </View>
                </View>           
                <Text style={estilos.title_user}>PANTALLA DE AYUDA</Text>    
            </ScrollView>
        </SafeAreaView>
    );
}

function mapStateToProps(state:any) {
    return {
    }
}

export default connect(
    mapStateToProps
)(Ayuda3GScreen);


