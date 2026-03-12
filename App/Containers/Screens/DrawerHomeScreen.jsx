import { BackHandler, Dimensions, Image, Modal, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';
import HomeScreen from './HomeScreen'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routingIfHasTrip } from '../../actions/actions'; 

function DrawerHomeScreen(props) {
    let backHandler;
    const [isLoading, setIsLoading] = useState(true);
    const [ state , setState ] = useState({
        dataCargada: false,
    });
    useEffect(() => {
        props.routingIfHasTrip();
        backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => { return true; }
        );
        return () => { 
           backHandler.remove();
        }
    },[]);

    useEffect(() => {
        validarUserClaro();
    },[state.dataCargada === true]);

    useEffect(() => {
        AsyncStorage.getItem('user')
        .then((data) => {
            setState({ 
                dataCargada: true,  
                DataUser: JSON.parse(data) 
            });
            setIsLoading(false);
        })
        .catch((error) => {
            console.log(error);
        });
      }, []);


    const validarUserClaro = async () => {
        if(!!state.DataUser){
            console.log('EMAIL menu lateral::', state.DataUser.email)

            const correo = state.DataUser.email;
            const busqueda = "@claro.co";
            const indice = correo.indexOf(busqueda);

            if (indice !== -1) {
                console.log(`La cadena '${busqueda}' se encontró en el índice ${indice} de '${correo}'.`);      
                await setState({ 
                    ...state,
                    userClaro: true,
                });
            } else {
                console.log(`La cadena '${busqueda}' no se encontró en '${correo}'.`);
            }
        }
    }
    if (isLoading) {
        return (
            <Modal transparent={true}>
            <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image source={require('../../Resources/gif/loading.gif')} style={{
                width: Dimensions.get('window').width*.8,
                height: 250, 
              }} />
                </View>
            </View>
        </Modal>
        );
    }

    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator initialRouteName="HomeScreen">
            <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        </Drawer.Navigator>
    );
    
} 

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        routingIfHasTrip: () => dispatch(routingIfHasTrip())
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DrawerHomeScreen);