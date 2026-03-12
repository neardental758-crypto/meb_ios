import React from 'react';
import { useContext, useEffect } from 'react';
import { View, Button, SafeAreaView, StyleSheet, Pressable, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import Fonts from '../Themes/Fonts';
import { ButtonComponent } from './ButtonComponent';
import { navigationLogin } from '../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';
import { AuthContext } from '../AuthContext';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import * as RootNavigation from '../RootNavigation';

function ButtonSignOffComponent(props){

    const { isLogin, token, dataUser, logout } = useContext( AuthContext )

    const goLoggin = async () => {
        //await props.navigationLogin();
        await logout()
    }

    return (
        <SafeAreaView style={ estilos.safe }> 
        <View style={{
            width: '100%',
            alignItems: 'center',
        }}>
            {/*<Image 
                source={require('../Resources/gif/stop.gif')} 
                style={{width: 250, height: 250}} 
    />*/}
            <Pressable 
                onPress={()  => goLoggin()}
                style={ estilos.botonCerrar }
            >
                <Text style={ estilos.textBotonCerrar }>Cerrar Sesión</Text>
            </Pressable> 

            <Pressable 
                onPress={()  => RootNavigation.navigate('Home')}
                style={ estilos.botonVolver }
            >
                <Text style={ estilos.textBotonVolver }>Volver a Inicio</Text>
            </Pressable> 
        </View>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    safe: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.$secundario
    },
    container: {
      backgroundColor: Colors.$primario,
      paddingTop: 50
    },
    botonCerrar: {
      backgroundColor: Colors.$primario,
      width: moderateScale(200),
      height: "auto",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      borderRadius: 20,
      marginTop: 20,
    },
    botonVolver: {
        backgroundColor: Colors.$secundario,
        width: moderateScale(200),
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 10,
        marginTop: 50,
      },
    textBotonCerrar: {
        color: Colors.$blanco,
        fontSize: 20,
    },
    textBotonVolver: {
        color: Colors.$texto,
        fontSize: 20,
    },
    logo: {
      maxWidth: moderateScale(200), 
      maxHeight : moderateScale(100),
      marginBottom: 20
    }
  })

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        navigationLogin: () => dispatch(navigationLogin()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ButtonSignOffComponent);
